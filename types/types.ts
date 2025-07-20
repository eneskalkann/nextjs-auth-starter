export type CustomerOrder = {
  id: string;
  createdAt: Date;
};

export type Customer = {
  id: string;
  name: string | null;
  email: string;
  orders: CustomerOrder[];
};

export type OrderItem = {
  id: string;
  quantity: number;
  product: {
    title: string | null;
  };
};

export type Order = {
  id: string;
  totalPrice: number;
  createdAt: Date;
  items: OrderItem[];
};
