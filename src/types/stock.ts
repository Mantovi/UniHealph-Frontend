export interface Stock {
  productId: number;
  quantity: number;
  alertSent: boolean;
}

export interface StockUpdate {
  productId: number;
  newQuantity: number;
}
