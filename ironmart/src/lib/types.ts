export type UserRole = "customer" | "seller" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  sellerId?: number | null;
  price: number;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
}

export interface CartItem {
  productId: string;
  qty: number;
  product: Product;
}

export type OrderStatus =
  | "pending_payment"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  userId: number;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  promoCode?: string | null;
  total: number;
  address: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  payMethod: "cod" | "card";
  status: OrderStatus;
  trackingNumber?: string | null;
  estimatedDeliveryAt?: string | null;
  cancellableUntil?: string | null;
  returnRequestedAt?: string | null;
  sellerId?: number | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  active: boolean;
}

export interface AdminStats {
  productCount: number;
  lowStockCount: number;
  orderCount: number;
  revenueTotal: number;
  ordersToday: number;
}

export interface SellerPayoutReport {
  sellerId: number;
  sellerEmail: string;
  periodStart: string;
  periodEnd: string;
  grossSales: number;
  commissionRate: number;
  commissionAmount: number;
  netPayout: number;
  deliveredOrders: number;
}

export interface SessionPayload {
  userId: number;
  email: string;
  role: UserRole;
}

export type ProductSort = "name" | "price-asc" | "price-desc" | "rating" | "newest";
