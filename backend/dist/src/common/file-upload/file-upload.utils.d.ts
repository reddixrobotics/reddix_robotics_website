export declare const ALLOWED_MIMES: string[];
export declare const secureMulterOptions: {
    storage: any;
    fileFilter: (req: any, file: any, cb: any) => any;
    limits: {
        fileSize: number;
    };
};
