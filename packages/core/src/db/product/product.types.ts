import { Generated } from "kysely";

export interface Size {
  size: string;
  available: boolean;
}

export interface ProductDb {
  id: Generated<string>;
  name: string;
  sku?: string;
  brand?: string;
  store: string;
  store_url: string;
  description?: string;
  old_price?: number;
  price: number;
  currency: string;
  installment_quantity?: number;
  installment_value?: number;
  available: boolean;
  sizes: Size[];
  images: string[];
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface ProductInsertion {
  name: string;
  sku?: string;
  brand?: string;
  store: string;
  store_url: string;
  description?: string;
  old_price?: number;
  price: number;
  currency: string;
  installment_quantity?: number;
  installment_value?: number;
  available: boolean;
  sizes: Size[];
  images: string[];
}
