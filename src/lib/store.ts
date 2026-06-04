import type { MenuItem, Order, OrderItem, OrderStatus, CustomerDetails } from "./types";

const menuItems: MenuItem[] = [
  {
    id: "pizza-margherita",
    name: "Margherita Pizza",
    description: "Classic cheese pizza with tomato sauce and fresh basil.",
    price: 299,
    image: "https://images.pexels.com/photos/31596394/pexels-photo-31596394.jpeg",
    foodType: "veg",
  },
  {
    id: "cheese-burger",
    name: "Cheese Burger",
    description: "Juicy chicken patty with melted cheese, lettuce, and tomato.",
    price: 199,
    image: "https://images.pexels.com/photos/34407507/pexels-photo-34407507.jpeg",
    foodType: "non-veg",
  },
  {
    id: "creamy-pasta",
    name: "Creamy Pasta",
    description: "Penne pasta in a rich and creamy Alfredo sauce.",
    price: 249,
    image: "https://images.pexels.com/photos/31779533/pexels-photo-31779533.jpeg",
    foodType: "veg",
  },
  {
    id: "french-fries",
    name: "French Fries",
    description: "Crispy golden fries seasoned with salt and pepper.",
    price: 99,
    image: "https://images.pexels.com/photos/5836999/pexels-photo-5836999.jpeg",
    foodType: "veg",
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    description: "Chilled coffee blended with milk and ice.",
    price: 129,
    image: "https://images.pexels.com/photos/11299735/pexels-photo-11299735.jpeg",
    foodType: "veg",
  },
];

const globalStore = globalThis as typeof globalThis & { __orders?: Order[] };
if (!globalStore.__orders) {
  globalStore.__orders = [];
}
const orders: Order[] = globalStore.__orders;

export function getMenuItems(): MenuItem[] {
  return menuItems;
}

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}

export function createOrder(
  items: OrderItem[],
  customer: CustomerDetails
): Order {
  const order: Order = {
    id: `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    items,
    customer,
    status: "Order Received",
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  orders.push(order);
  return order;
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((order) => order.id === id);
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus
): Order | undefined {
  const order = orders.find((o) => o.id === id);
  if (!order) return undefined;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  return order;
}
