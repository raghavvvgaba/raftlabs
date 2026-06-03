import { z } from "zod";

export const orderStatusSchema = z.enum([
  "Order Received",
  "Preparing",
  "Out for Delivery",
  "Delivered",
]);

export const createOrderItemSchema = z.object({
  menuItemId: z.string().min(1, "Menu item is required"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const customerDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export const createOrderSchema = z.object({
  items: z.array(createOrderItemSchema).min(1, "Cart cannot be empty"),
  customer: customerDetailsSchema,
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});
