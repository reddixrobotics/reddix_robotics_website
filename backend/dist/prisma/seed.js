"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@reddixrobotics.com';
    const password = process.env.INITIAL_ADMIN_PASSWORD || 'ReddixAdminSecure2026!';
    const existingAdmin = await prisma.admin.findUnique({
        where: { email },
    });
    if (existingAdmin) {
        console.log(`Admin user with email ${email} already exists. Skipping.`);
        return;
    }
    const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
        memoryCost: 65536,
        timeCost: 3,
        parallelism: 4,
    });
    const admin = await prisma.admin.create({
        data: {
            email,
            passwordHash,
            role: client_1.AdminRole.SUPER_ADMIN,
            twoFactorEnabled: false,
        },
    });
    console.log(`Created seed Admin:`);
    console.log(`- ID: ${admin.id}`);
    console.log(`- Email: ${admin.email}`);
    console.log(`- Role: ${admin.role}`);
    console.log(`- Temp Password: ${password}`);
    console.log(`\nIMPORTANT: Please change your password and enable 2FA immediately after logging in!`);
}
main()
    .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map