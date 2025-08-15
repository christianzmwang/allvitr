import { Pool } from 'pg'

const defaultUrl = 'postgresql://hugin:hugin@localhost:5432/hugin_local'

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL || defaultUrl,
})

type SqlParam = string | number | boolean | null | Date | Buffer

export async function query<T = unknown>(text: string, params?: SqlParam[]): Promise<{ rows: T[] }> {
	const client = await pool.connect()
	try {
		const result = await client.query(text, params)
		return { rows: result.rows as T[] }
	} finally {
		client.release()
	}
}
