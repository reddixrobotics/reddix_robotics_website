import { ShipmentStatus } from '@prisma/client';
export declare class UpdateShipmentDto {
    awbNumber?: string;
    trackingUrl?: string;
    status?: ShipmentStatus;
}
