CREATE TABLE "cart_line_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"cart_id" integer NOT NULL,
	"item_name" varchar NOT NULL,
	"variant" varchar,
	"qty" integer NOT NULL,
	"price" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "cart_customer_id_unique" UNIQUE("customer_id")
);
--> statement-breakpoint
ALTER TABLE "cart_line_items" ADD CONSTRAINT "cart_line_items_cart_id_cart_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON DELETE cascade ON UPDATE no action;