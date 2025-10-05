const dotenv = require('dotenv');

dotenv.config({ path: '../../packages/db/.env' });
const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

exports.prismaClient = prismaClient;