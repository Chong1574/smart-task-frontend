/**
 * Devuelve la fecha de hoy (o de referenceDate) en formato YYYY-MM-DD usando la zona horaria local.
 */
export function getLocalTodayStr(referenceDate: Date = new Date()): string {
  const y = referenceDate.getFullYear()
  const m = String(referenceDate.getMonth() + 1).padStart(2, '0')
  const d = String(referenceDate.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Convierte una cadena YYYY-MM-DD (de <input type="date">) a ISO UTC fijado a mediodía local (12:00:00)
 * para evitar desplazamientos de día al convertir zonas UTC-6.
 */
export function parseLocalDateToIso(dateStr?: string | null): string {
  if (!dateStr) return new Date().toISOString()
  const raw = String(dateStr).trim()
  if (!raw) return new Date().toISOString()

  if (raw.includes('T')) {
    const parsed = new Date(raw)
    return isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString()
  }

  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (match) {
    const localNoon = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0, 0)
    if (!isNaN(localNoon.getTime())) return localNoon.toISOString()
  }

  const fallback = new Date(raw)
  return isNaN(fallback.getTime()) ? new Date().toISOString() : fallback.toISOString()
}

/**
 * Formatea un monto numérico como moneda MXN (es-MX).
 */
export function formatCurrencyMXN(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''
  const num = Number(value)
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num)
}

/**
 * Determina si una transacción emparejada (transfer/credit_payment/loan_payment) corresponde a una entrada.
 * Prioriza el campo estructurado `direction` con respaldo retrocompatible por descripción.
 */
export function isIncomingPairedTransaction(
  tx?: { direction?: string | null; description?: string | null } | null
): boolean {
  if (!tx) return false
  if (tx.direction === 'in') return true
  if (tx.direction === 'out') return false
  const desc = tx.description || ''
  return /^(Pago recibido|Transferencia recibida)/i.test(desc)
}

/**
 * Calcula la racha consecutiva de un hábito (en días locales), manteniendo viva la racha
 * si aún no se registra hoy pero sí se cumplió ayer.
 */
export function calculateHabitStreak(
  logs?: Array<{ completedAt?: string; date?: string }> | null,
  referenceDate: Date = new Date()
): number {
  if (!logs || logs.length === 0) return 0

  const rawDates = logs
    .map((log) => {
      if (log.completedAt) return log.completedAt.split('T')[0]
      if (log.date) return log.date.split('T')[0]
      return ''
    })
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a))

  const uniqueDates = [...new Set(rawDates)]
  if (uniqueDates.length === 0) return 0

  const todayStr = getLocalTodayStr(referenceDate)
  const checkDate = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())
  let streak = 0

  if (uniqueDates[0] === todayStr) {
    streak++
    checkDate.setDate(checkDate.getDate() - 1)
    uniqueDates.shift()
  } else {
    const yesterday = new Date(checkDate)
    yesterday.setDate(yesterday.getDate() - 1)
    if (uniqueDates[0] !== getLocalTodayStr(yesterday)) {
      return 0
    }
    checkDate.setTime(yesterday.getTime())
  }

  for (const d of uniqueDates) {
    if (d === getLocalTodayStr(checkDate)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

/**
 * Calcula la próxima fecha de pago a partir de una fecha de inicio o fecha de anclaje y su frecuencia.
 * Si la fecha proporcionada está en el pasado (ej. inicio de suscripción hace meses), avanza
 * los ciclos correspondientes hasta alcanzar la fecha del próximo cobro (>= hoy).
 */
export function computeUpcomingPaymentDate(
  dateStrOrDate: string | Date,
  frequency: string,
  referenceDate: Date = new Date()
): Date {
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate())
  let current: Date

  if (typeof dateStrOrDate === 'string') {
    const parts = dateStrOrDate.split('T')[0].split('-')
    current = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  } else {
    current = new Date(dateStrOrDate.getFullYear(), dateStrOrDate.getMonth(), dateStrOrDate.getDate())
  }

  if (isNaN(current.getTime())) return today

  // Si la fecha ya es hoy o futura, esa es la fecha del próximo pago
  if (current >= today) {
    return current
  }

  const targetDay = current.getDate()

  // Si está en el pasado, avanzar ciclos hasta el próximo pago
  while (current < today) {
    let monthsToAdd = 0
    switch (frequency) {
      case 'WEEKLY':
        current.setDate(current.getDate() + 7)
        continue
      case 'BIWEEKLY':
        current.setDate(current.getDate() + 14)
        continue
      case 'SEMIMONTHLY':
        current.setDate(current.getDate() + 15)
        continue
      case 'BIMONTHLY':
        monthsToAdd = 2
        break
      case 'QUARTERLY':
        monthsToAdd = 3
        break
      case 'SEMIANNUAL':
        monthsToAdd = 6
        break
      case 'YEARLY':
        monthsToAdd = 12
        break
      case 'MONTHLY':
      default:
        monthsToAdd = 1
        break
    }

    let targetMonth = current.getMonth() + monthsToAdd
    const targetYear = current.getFullYear() + Math.floor(targetMonth / 12)
    targetMonth = ((targetMonth % 12) + 12) % 12
    const maxDays = new Date(targetYear, targetMonth + 1, 0).getDate()
    current = new Date(targetYear, targetMonth, Math.min(targetDay, maxDays))
  }

  return current
}
