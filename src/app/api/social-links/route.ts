import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';
import type { SocialLink } from '@/lib/types';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/social-links.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const links = JSON.parse(fileContent) as SocialLink[];
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error loading social links:', error);
    return NextResponse.json(
      { error: 'Failed to load social links' },
      { status: 500 }
    );
  }
}










