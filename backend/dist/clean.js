"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
async function main() { const rawConnectionString = process.env.DATABASE_URL || ''; let connectionString = rawConnectionString; if (rawConnectionString.startsWith('prisma+postgres://')) {
    try {
        const urlObj = new URL(rawConnectionString);
        const apiKey = urlObj.searchParams.get('api_key');
        if (apiKey) {
            const decoded = Buffer.from(apiKey, 'base64').toString('utf8');
            const parsed = JSON.parse(decoded);
            if (parsed && parsed.databaseUrl)
                connectionString = parsed.databaseUrl;
        }
    }
    catch (e) { }
} const pool = new pg_1.Pool({ connectionString }); const adapter = new adapter_pg_1.PrismaPg(pool); const prisma = new client_1.PrismaClient({ adapter }); await prisma.orderItem.deleteMany({ where: { productId: 'p-1' } }); await prisma.cartItem.deleteMany({ where: { productId: 'p-1' } }); await prisma.wishlistItem.deleteMany({ where: { productId: 'p-1' } }); await prisma.product.delete({ where: { id: 'p-1' } }); console.log('Done!'); await prisma.$disconnect(); await pool.end(); }
main().catch(console.error);
//# sourceMappingURL=clean.js.map