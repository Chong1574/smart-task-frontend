# n8n Automation - El Rincón de Brandy

This folder contains the logic for the two main n8n workflows required for the 3D printing service.

## 1. Weekly Scraper (Muro de Inspiración)

**Goal**: Populate the Cloudflare D1 database with trending 3D models.

### Flow Logic:
1.  **Schedule Trigger**: Executes every Monday at 00:00.
2.  **HTTP Request (Thingiverse API)**: Fetch `popular` models from the last 7 days.
    *   Endpoint: `https://api.thingiverse.com/search?sort=popular&posted_after=7-days`
    *   Auth: Bearer Token.
3.  **Item Lists (Split Out)**: Iterate through each model.
4.  **HTTP Request (Model Details)**: Fetch high-res image and metadata.
5.  **Filter**: Only include models with "Creative Commons - Attribution" or "Public Domain" licenses to avoid legal issues.
6.  **Cloudflare D1 (UPSERT)**: 
    *   Query: `INSERT INTO models (id, title, description, image_url, source_url, category) VALUES (...) ON CONFLICT(id) DO UPDATE SET trend_score = trend_score + 1;`

## 2. Order Processor (Checkout)

**Goal**: Handle payments and production queuing.

### Flow Logic:
1.  **Webhook (MercadoPago/PayPal)**: Listen for payment status updates.
2.  **Switch**: Route by payment status (Success / Pending / Failed).
3.  **Cloudflare D1 (Update)**: Update the `orders` table with status `paid`.
4.  **Trello/Notion Node**: Create a card in your "Printing Queue" board with:
    *   Model Link
    *   Material/Color
    *   Estimated Weight
5.  **Email (Gmail/SMTP)**: Send a confirmation email to the client:
    *   "¡Tu pieza ya está en la cola de impresión! Estimamos que estará lista en 48h."

---

## Trend Injection (Bonus)
The scraper also injects current "Weekly Trends" based on search frequency from Thingiverse, ensuring the "Muro de Inspiración" always feels fresh.
