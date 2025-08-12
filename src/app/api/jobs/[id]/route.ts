import { NextResponse } from 'next/server'

export async function GET(_req: Request, context: { params: { id: string } }) {
  const { id } = context.params
  return NextResponse.json({ id, status: 'done' })
}
