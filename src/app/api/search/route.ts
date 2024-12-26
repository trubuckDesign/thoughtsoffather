import { NextResponse } from 'next/server';
import prisma from '../../../../prisma/prismaClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const results = await prisma.$queryRaw<
      Array<{ thoughtId: number; title: string; content: string }>
    >`
      SELECT DISTINCT t."thoughtId", t.title, t.content
      FROM "Thoughts" t
      JOIN "ThoughtsChunks" tc 
      ON t."thoughtId" = tc."thoughtId"
      WHERE to_tsvector('english', tc."chunkContent") @@ plainto_tsquery('english', ${query});
    `;

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('Error performing search:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
