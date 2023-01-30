import { CategoryModel } from "./category.model";
import { BrandModel } from "./brand.model";
import { SupplierModel } from "./supplier.model";

export class ProductModel {
  id?: number = 0;
  category_id: number = 0;
  categories?: CategoryModel;
  brand_id: number = 0;
  brands?: BrandModel;
  supplier_id: number = 0;
  suppliers?: SupplierModel;
  image: string = '';
  product_name: string = '';
  description: string = '-';
  base_price: number = 0;
  selling_price: number = 0;
  quantity: number = 0;
  unit: string = '';
  created_by: string = '';
  is_active: boolean = false;
}