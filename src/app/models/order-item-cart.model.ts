export class OrderItemCart {
  items!: Array<OrderItemCartDetail>;
}
export class OrderItemCartDetail {
 product_image!: string;
 product_name!: string;
 brand!: string;
 price!: number;
 quantity!: number;
 product_id: any;
 discount!: number;
 available_qty!: number;
}