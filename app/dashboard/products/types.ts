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

export interface Product {
  id: number;
  title: string;
  description: string | null;
  price: number;
  fixed_price: number;
  stock: number;
  isOnSale: boolean;
  isOnShopPage: boolean;
  slug: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: Category[];
  tags?: Tag[];
  images?: ProductImage[];
}

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
