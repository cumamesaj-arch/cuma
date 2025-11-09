import { NextResponse } from 'next/server';
import * as fs from 'fs/promises';
import path from 'path';
import { loadHomepageSections } from '@/lib/homepage-sections';

export async function GET() {
  try {
    // Try to load from JSON file first
    try {
      const filePath = path.join(process.cwd(), 'src/lib/homepage-sections.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const sections = JSON.parse(fileContent);
      // Add cache headers for better performance
      return NextResponse.json(sections, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      });
    } catch (fileError) {
      // If JSON file doesn't exist or can't be read, return default
      try {
        const defaultSections = await loadHomepageSections();
        return NextResponse.json(defaultSections);
      } catch (loadError) {
        console.error('Error loading default homepage sections:', loadError);
        // Return a minimal valid structure if everything fails
        const minimalSections = {
          hero: {
            title: 'Cuma Mesajları',
            description: 'İslami Mesajlar ve İçerik',
            backgroundImage: '',
            backgroundImageHint: '',
            button1: { text: 'Mesajlar', link: '/cuma-mesajlari', icon: 'BookOpen', visible: true },
            button2: { text: 'Yapay Zeka', link: '/admin/ai-capabilities', icon: 'Bot', visible: false },
            activePage: 1,
            page1Enabled: true,
            page1Images: [],
          },
          topSection: {
            title: 'Öne Çıkan Mesajlar',
            visible: true,
            buttons: [],
          },
          bottomSection: {
            title: 'Hakkımızda',
            visible: false,
          },
          branding: {
            siteName: 'Cuma Mesajları',
            useLogo: false,
            logoUrl: '',
            logoAlt: 'Cuma Mesajları Logo',
            textColor: '#697604',
            fontFamily: 'Times New Roman',
            fontSize: '2xl',
          },
          footer: {
            title: 'Sosyal Medya Linklerim',
            text: 'Tüm hakları saklıdır.',
            showYear: true,
            showSocials: true,
            links: [],
          },
        };
        return NextResponse.json(minimalSections);
      }
    }
  } catch (error) {
    console.error('Error loading homepage sections:', error);
    return NextResponse.json(
      { error: 'Failed to load homepage sections', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}






