with open('../smart-task-backend/controllers/orders.controller.ts', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("parseInt(req.params.id);", "parseInt(req.params.id as string);")

with open('../smart-task-backend/controllers/orders.controller.ts', 'w', encoding='utf-8') as f:
    f.write(content)
