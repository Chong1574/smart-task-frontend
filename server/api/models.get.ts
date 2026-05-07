export default defineEventHandler(async (event) => {
  const { DB } = event.context.cloudflare?.env || {}

  if (!DB) {
    // Mock data for local development if DB is not bound
    return [
      {
        id: '1',
        title: 'Engranaje Planetario (Local)',
        description: 'Mecanismo de ingeniería de alta precisión para proyectos mecánicos.',
        image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
        category: 'Ingeniería',
        source_url: 'https://makerworld.com'
      },
      {
        id: '2',
        title: 'Organizador Hexagonal (Local)',
        description: 'Sistema modular para escritorio impreso en PLA Silk.',
        image_url: 'https://images.unsplash.com/photo-1512446813933-467f3b5a9849?q=80&w=800&auto=format&fit=crop',
        category: 'Hogar',
        source_url: 'https://printables.com'
      }
    ]
  }

  try {
    const { results } = await DB.prepare('SELECT * FROM models ORDER BY trend_score DESC LIMIT 12').all()
    return results
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching models from D1'
    })
  }
})
