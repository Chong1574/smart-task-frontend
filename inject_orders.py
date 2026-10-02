import os
index_path = '../smart-task-backend/index.ts'
with open(index_path, 'r', encoding='utf-8') as f:
    content = f.read()

import_statement = "import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from './controllers/orders.controller';"
if import_statement not in content:
    # Insert after last import
    last_import = content.rfind("import ")
    end_of_last_import = content.find("\n", last_import)
    content = content[:end_of_last_import] + "\n" + import_statement + content[end_of_last_import:]

routes = """
// Rutas - Pedidos (Orders)
app.post('/api/orders/checkout', authenticate as any, createOrder);
app.get('/api/orders/my-orders', authenticate as any, getMyOrders);
app.get('/api/admin/orders', authenticate as any, requireAdmin, getAllOrders);
app.put('/api/admin/orders/:id/status', authenticate as any, requireAdmin, updateOrderStatus);
"""
if "/api/orders/checkout" not in content:
    # Insert before app.use(errorHandler)
    error_handler_idx = content.find("app.use(errorHandler);")
    if error_handler_idx != -1:
        content = content[:error_handler_idx] + routes + "\n" + content[error_handler_idx:]
    else:
        content += routes

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Routes injected.")
