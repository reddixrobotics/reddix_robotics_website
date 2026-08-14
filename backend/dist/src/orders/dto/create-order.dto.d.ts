export declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerId?: string;
    items: OrderItemDto[];
}
