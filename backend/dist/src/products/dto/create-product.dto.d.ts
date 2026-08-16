export declare class CreateProductDto {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    depositPercentage?: number;
    stock?: number;
    features: string[];
    technicalSpecifications?: any;
    availability?: boolean;
    images?: string[];
}
