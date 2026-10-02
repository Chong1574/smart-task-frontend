import os

schema_path = '../smart-task-backend/src/db/schema.ts'
with open(schema_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_tables = """

export const orders = sqliteTable('Order', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('userId').notNull().references(() => users.id),
  status: text('status').notNull().default('PENDING'), // PENDING, PRINTING, READY_TO_SHIP, COMPLETED, CANCELLED
  paymentStatus: text('paymentStatus').notNull().default('UNPAID'), // UNPAID, PAID
  totalAmount: real('totalAmount').notNull().default(0),
  totalPrintHours: real('totalPrintHours').notNull().default(0),
  estimatedDeliveryDate: text('estimatedDeliveryDate'),
  shippingAddress: text('shippingAddress'),
  createdAt: text('createdAt').notNull().$defaultFn(() => new Date().toISOString()),
  updatedAt: text('updatedAt').notNull().$defaultFn(() => new Date().toISOString()),
});

export const orderItems = sqliteTable('OrderItem', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  orderId: integer('orderId').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  productId: integer('productId').notNull().references(() => products.id),
  variantName: text('variantName'), 
  quantity: integer('quantity').notNull().default(1),
  priceAtPurchase: real('priceAtPurchase').notNull(),
  printHoursAtPurchase: real('printHoursAtPurchase').notNull().default(0),
});
"""

if 'export const orders =' not in content:
    with open(schema_path, 'a', encoding='utf-8') as f:
        f.write(new_tables)
    print("Tables added.")
else:
    print("Tables already exist.")
