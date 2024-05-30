require("dotenv").config()
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from "./schema";

export const client = createClient({ url: process.env.DB_URL!, authToken: process.env.DB_PASS! });
const db = drizzle(client, { schema })

export default db;
