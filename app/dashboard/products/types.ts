export interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: number;
  url: string;
  title: string;
  alt: string | null;
  productId: number;
  createdAt: Date;
}

export type Product = {
  id: number;
  title: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  description: string | null;
  isOnSale: boolean;
  price: number;
  fixed_price: number | null;
  stock: number;
  isOnShopPage: boolean;
  adminId: string;
  images?: { id: string; url: string }[];
};

export interface ProductFormValues {
  title: string;
  description: string;
  price: number;
  fixed_price: number;
  stock: number;
  isOnSale: boolean;
  isOnShopPage: boolean;
}

export interface ProductPageProps {
  params: {
    slug: string;
  };
}

export interface ProductsPageProps {
  searchParams?: {
    page?: string;
    success?: string;
  };
}
