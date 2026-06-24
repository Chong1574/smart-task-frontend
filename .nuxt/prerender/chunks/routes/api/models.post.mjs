import { defineEventHandler, readBody, createError } from 'file://C:/Users/ShongYi/Documents/Proyectos/Task-Manager/smart-task-frontend/node_modules/h3/dist/index.mjs';

const models_post = defineEventHandler(async (event) => {
  var _a;
  const { DB } = ((_a = event.context.cloudflare) == null ? void 0 : _a.env) || {};
  const body = await readBody(event);
  if (!DB) {
    throw createError({
      statusCode: 500,
      statusMessage: "D1 Database not found"
    });
  }
  const { id, title, description, image_url, source_url, provider, category } = body;
  try {
    await DB.prepare(`
      INSERT INTO models (id, title, description, image_url, source_url, provider, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        description = excluded.description,
        image_url = excluded.image_url,
        trend_score = trend_score + 1
    `).bind(id, title, description, image_url, source_url, provider, category).run();
    return { status: "success", message: "Modelo guardado/actualizado" };
  } catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: "Error saving to D1: " + e.message
    });
  }
});

export { models_post as default };
//# sourceMappingURL=models.post.mjs.map
