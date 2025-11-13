import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';
import type { SocialLink } from '@/lib/types';

export async function GET() {
  try {
    console.log('[API] /api/social-links called');
    const filePath = path.join(process.cwd(), 'src/lib/social-links.json');
    console.log('[API] Reading social-links.json from:', filePath);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const links = JSON.parse(fileContent) as SocialLink[];
    console.log('[API] Successfully loaded social links, count:', links.length);
    return NextResponse.json(links, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('[API] Error loading social links:', error);
    return NextResponse.json(
      { error: 'Failed to load social links', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
