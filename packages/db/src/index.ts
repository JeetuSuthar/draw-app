import * as dotenv from 'dotenv';

dotenv.config({ path: '../../packages/db/.env' });
import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();