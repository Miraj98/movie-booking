import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/schema.ts',
	out: './drizzle',
	dialect: 'sqlite', // 'postgresql' | 'mysql' | 'sqlite'
	dbCredentials: {
		url: process.env.DB_URL!,
		dbName: 'excali'
	},
});

