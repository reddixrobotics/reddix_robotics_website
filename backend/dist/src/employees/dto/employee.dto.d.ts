export declare class CreateEmployeeDto {
    name: string;
    position: string;
    experience: string;
    linkedInUrl?: string;
    description: string;
    priority?: number;
    profilePhoto: string;
    skills?: string[];
}
export declare class UpdateEmployeeDto {
    name?: string;
    position?: string;
    experience?: string;
    linkedInUrl?: string;
    description?: string;
    priority?: number;
    profilePhoto?: string;
    skills?: string[];
}
