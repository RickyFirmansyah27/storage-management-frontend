export type APIResponse<T = undefined> = T extends undefined
  ? {
      status: boolean;
      message: string;
    }
  : {
      status: boolean;
      message: string;
      data: T;
    };

export type Pagination = {
  current_page: number;
  total_rows: number;
  total_pages: number;
  total_count: number;
  from: number;
  to: number;
};

export type PaginatedAPIResponse<T> = APIResponse<T> & {
  pagination: Pagination;
};

export type ErrorAPIResponse = APIResponse & {
  errors: Record<string, string[]>;
};

export interface Items {
  id: string;
  name: string;
  category_id: number;
  stock: number;
  unit: number;
  min_stock: number;
}

export interface AddItems {
  productName: string;
  description: string;
  sku: string;
  price: number;
  quantity: number;
  image: string[];
}

export type EditItems = {
  productName: string;
  description: string;
  price: number;
  sku: string;
  quantity: number;
  image: string[];
};