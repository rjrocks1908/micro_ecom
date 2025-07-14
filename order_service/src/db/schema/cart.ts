import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
  serial,
  integer,
  pgTable,
  timestamp,
  varchar,
  numeric,
} from "drizzle-orm/pg-core";

export const cartTable = pgTable("cart", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Cart = InferSelectModel<typeof cartTable>;
export type NewCart = InferInsertModel<typeof cartTable>;

export const cartLineItemsTable = pgTable("cart_line_items", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull(),
  cartId: integer("cart_id")
    .references(() => cartTable.id, { onDelete: "cascade" })
    .notNull(),
  itemName: varchar("item_name").notNull(),
  variant: varchar("variant"),
  qty: integer("qty").notNull(),
  price: numeric("price").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CartLineItem = InferSelectModel<typeof cartLineItemsTable>;

export const cartRelations = relations(cartTable, ({ many }) => ({
  lineItems: many(cartLineItemsTable),
}));

export const lineItemsRelations = relations(cartLineItemsTable, ({ one }) => ({
  cart: one(cartTable, {
    fields: [cartLineItemsTable.cartId],
    references: [cartTable.id],
  }),
}));
