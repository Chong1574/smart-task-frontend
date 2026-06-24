import { defineEventHandler, createError } from 'file://C:/Users/ShongYi/Documents/Proyectos/Task-Manager/smart-task-frontend/node_modules/h3/dist/index.mjs';

const models_get = defineEventHandler(async (event) => {
  var _a;
  const { DB } = ((_a = event.context.cloudflare) == null ? void 0 : _a.env) || {};
  if (!DB) {
    return [
      {
        id: "1",
        title: "Engranaje Planetario (Local)",
        description: "Mecanismo de ingenier\xEDa de alta precisi\xF3n para proyectos mec\xE1nicos.",
        image_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
        category: "Ingenier\xEDa",
        source_url: "https://makerworld.com"
      },
      {
        id: "2",
        title: "Organizador Hexagonal (Local)",
        description: "Sistema modular para escritorio impreso en PLA Silk.",
        image_url: "https://images.unsplash.com/photo-1512446813933-467f3b5a9849?q=80&w=800&auto=format&fit=crop",
        category: "Hogar",
        source_url: "https://printables.com"
      }
    ];
  }
  try {
    const { results } = await DB.prepare("SELECT * FROM models ORDER BY trend_score DESC LIMIT 12").all();
    return results;
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error fetching models from D1"
    });
  }
});

export { models_get as default };
//# sourceMappingURL=models.get.mjs.map
