# n8n — Taskman Bazar

n8n corre self-hosted en el Pi 5 en `/home/shongyi/n8n/` (compose separado del backend). Los workflows en esta carpeta son la fuente de verdad — se exportan desde la UI de n8n y se commitean acá.

## Workflows

### `makerworld-scraper.json` — cron diario del bazar

**Objetivo:** poblar la tabla `Product` en D1 con modelos populares de MakerWorld.

**Flujo:**
1. Cron 03:00 America/Mexico_City → emite 3 offsets (0, 40, 80).
2. `GET https://makerworld.com/api/v1/search-service/select/design2` — 120 hits sort=score.
3. Flatten hits → `normalize + sanitize` (mapea licencias CC, limpia títulos, arma `externalId`/`sourceUrl`/`imageUrl`).
4. Filtro: descarta `licenseType === 'unknown'` (no publicable sin revisión manual).
5. `GET .../design/{externalId}` en batch 5×500ms → detalle con plates para calcular precio.
6. `compute price + variants` — suma gramos+horas por plate, calcula precio con filament $400/kg, waste 5%, kWh $4.5, watts 100, margin 300%.
7. Wrap `{ products: [...] }` → `POST http://host.docker.internal:3000/api/products/sync` con **Header Auth credential** (`Authorization: Bearer $SYNC_SECRET`).

**Sube archivos a R2?** No. Solo escribe metadata a `Product` en D1. `imageUrl` es una URL externa de MakerWorld CDN. R2 solo se llena vía `/api/products/custom` (admin upload manual desde la UI).

**Auth:** ver [[feedback_n8n_no_env_vars]] — usar credencial Header Auth "Taskman Sync" post-import. No usar `$env.SYNC_SECRET` inline en el request (el workflow live-search sí lo usa en un check de validación runtime, no en el request HTTP).

**Estado por default:** `"active": false` en el JSON — activar en la UI n8n manualmente después de importar y verificar que la primera corrida manual llegue a D1 (200 y `results.created > 0`).

### `makerworld-live-search.json` — búsqueda on-demand

**Objetivo:** cuando el usuario busca en `/bazar` y no hay hits locales, disparar scrape en vivo de MakerWorld para esa query. Idéntico al scraper diario pero parametrizado por `q` y con rate-limit.

### `makerworld-calculator.json` — importar grams/hours desde MakerWorld

**Objetivo:** el usuario pega una URL de MakerWorld en `/calculadora-3d` y el workflow devuelve `{grams, hours}` (total por plato del primer perfil de impresión).

**Flujo:** `POST /webhook/makerworld-calc` (Bearer SYNC_SECRET) → Auth check → Extract ID → `GET makerworld.com/api/v1/design-service/design/{id}` → suma `plates[*].weight` y `plates[*].prediction/3600` → respondWith `{grams, hours}`.

**Consumer:** el frontend NO llama al webhook directamente. Va vía `POST /api/print-cost/makerworld` en el backend, que valida URL, rate-limita por IP (10/h, scope `calc`) y añade el header `Authorization: Bearer <SYNC_SECRET>` (`service/n8nWebhook.service.ts:callMakerworldCalc`). Configurable con `N8N_MAKERWORLD_CALC_URL` en el `.env` del Pi (default `http://n8n:5678/webhook/makerworld-calc`).

**Estado por default:** `"active": false` — activar en la UI n8n después de importar.

## Requisitos infra (Pi)

- n8n container con `extra_hosts: - "host.docker.internal:host-gateway"` en su `docker-compose.yml` (Linux Docker no lo mapea por default). Alternativa: usar el nombre del container del backend en la red compartida (ver [[project_pi_tunnel_setup]] — cloudflared usa redes externas y ingress por nombre).
- Volumen persistente `./data:/home/node/.n8n` para credenciales y ejecuciones.
- Credencial "Taskman Sync" (Header Auth): `Authorization: Bearer <SYNC_SECRET del .env del backend>`.

## Debug — "n8n corre pero D1 no se llena"

Checklist en orden de probabilidad:
1. **Credencial Header Auth mal:** el request llega al backend y `syncsecret.middleware` responde 401/403. Verifica la respuesta del último nodo.
2. **`host.docker.internal:3000` no resuelve** desde el container de n8n. Prueba desde n8n container: `docker exec -it n8n curl -v http://host.docker.internal:3000/api/health`. Si falla, agrega `extra_hosts` al compose de n8n o cambia a nombre de container.
3. **D1 credentials del backend mal:** el backend recibe 200 pero cae al warn "Cloudflare D1 credentials missing" (después del fix, ahora tira 500 explícito — hasta el fix, respondía silencioso con `success:true`). Verifica `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_DATABASE_ID` / `CLOUDFLARE_D1_TOKEN` en el `.env` del Pi.
4. **Workflow desactivado:** `active:false` en el JSON. Activar en la UI de n8n.
