"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const admin = await prisma.admin.findFirst();
    if (admin) {
        await prisma.admin.update({
            where: { id: admin.id },
            data: { email: 'reddixrobotics@gmail.com' }
        });
        console.log('Successfully updated admin email to reddixrobotics@gmail.com');
    }
    else {
        console.log('No admin found to update.');
    }
}
main()
    .catch(e => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=update-email.js.map