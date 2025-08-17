import { Pool } from 'pg'

// Prefer Supabase pooled connection in production; fall back to direct or local for dev
const connectionString =
	process.env.POOLER_URL || process.env.DATABASE_URL || 'postgresql://hugin:hugin@localhost:5432/hugin_local'

const isLocal = connectionString.includes('localhost') || connectionString.includes('127.0.0.1')

// Create a pool, but allow failures to be handled gracefully in query()
export const pool = new Pool({
	connectionString,
	// Supabase requires SSL; disable for local
	ssl: isLocal ? undefined : { rejectUnauthorized: false },
})

type SqlParam = string | number | boolean | null | Date | Buffer

export async function query<T = unknown>(text: string, params?: SqlParam[]): Promise<{ rows: T[] }> {
	let client: import('pg').PoolClient | null = null
	try {
		client = await pool.connect()
		const result = await client.query(text, params)
		return { rows: result.rows as T[] }
	} catch (error) {
		// If the database is not available, avoid crashing the request
		console.warn('[db] Query failed; returning empty rows. DB is disabled or unreachable.', error)
		return { rows: [] as T[] }
	} finally {
		if (client) client.release()
	}
}
