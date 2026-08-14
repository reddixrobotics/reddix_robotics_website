export declare class CreateProjectDto {
    name: string;
    description: string;
    images: string[];
    category: string;
    technologies: string[];
    status: string;
    date: string;
}
export declare class UpdateProjectDto {
    name?: string;
    description?: string;
    images?: string[];
    category?: string;
    technologies?: string[];
    status?: string;
    date?: string;
}
