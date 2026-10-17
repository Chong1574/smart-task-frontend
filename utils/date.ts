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
