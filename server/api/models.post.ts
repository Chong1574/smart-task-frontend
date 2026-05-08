export default defineEventHandler(async (event) => {
  const { DB } = event.context.cloudflare?.env || {}
  const body = await readBody(event)

  if (!DB) {
    throw createError({
      statusCode: 500,
      statusMessage: 'D1 Database not found'
    })
  }

  // Protección básica: podrías añadir una API_KEY en las variables de entorno
  // const config = useRuntimeConfig()
  // if (getQuery(event).key !== config.N8N_API_KEY) throw createError({ statusCode: 401 })

  const { id, title, description, image_url, source_url, provider, category } = body

  try {
    await DB.prepare(`
      INSERT INTO models (id, title, description, image_url, source_url, provider, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        image_url = excluded.image_url,
        trend_score = trend_score + 1
    `).bind(id, title, description, image_url, source_url, provider, category).run()

    return { status: 'success', message: 'Modelo guardado/actualizado' }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error saving to D1: ' + e.message
    })
  }
})
