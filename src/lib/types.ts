export type OrderStatus =
  | "Order Received"
  | "Preparing"
  | "Out for Delivery"
  | "Delivered";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  foodType: "veg" | "non-veg";
};

export type CartItem = {
  menuItemId: string;
  quantity: number;
};

export type CustomerDetails = {
  name: string;
  address: string;
  phone: string;
};

export type OrderItem = {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  customer: CustomerDetails;
  status: OrderStatus;
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type RecentOrderRef = {
  orderId: string;
  total: number;
  savedAt: string;
};
