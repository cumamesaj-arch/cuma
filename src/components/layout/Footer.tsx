'use client';

import { SocialIcons } from '../shared/SocialIcons';
import { useEffect, useState } from 'react';
import type { SiteBranding } from '@/lib/types';

export function Footer() {
  const [branding, setBranding] = useState<SiteBranding>({
    siteName: "Cuma Mesajları",
    useLogo: false,
    logoUrl: "",
    logoAlt: "Cuma Mesajları Logo",
    textColor: "#FFD700",
    fontFamily: "Playfair Display",
    fontSize: "2xl"
  });
  const [footerTitle, setFooterTitle] = useState<string>('Sosyal Medya Linklerim');
  const [footerText, setFooterText] = useState<string>('Tüm hakları saklıdır.');
  const [showYear, setShowYear] = useState<boolean>(true);
  const [showSocials, setShowSocials] = useState<boolean>(true);
  const [footerLinks, setFooterLinks] = useState<Array<{ label: string; url: string }>>([]);

  useEffect(() => {
    // Firebase'den branding ve footer bilgilerini yükle
    const loadBranding = async () => {
      try {
        const { getHomepageSectionsAction } = await import('@/app/actions');
        const data = await getHomepageSectionsAction();
        if (data.branding) {
          setBranding(data.branding);
        }
        if (data.footer) {
          setFooterTitle(data.footer.title || 'Sosyal Medya Linklerim');
          setFooterText(data.footer.text || 'Tüm hakları saklıdır.');
          setShowYear(typeof data.footer.showYear === 'boolean' ? data.footer.showYear : true);
          setShowSocials(typeof data.footer.showSocials === 'boolean' ? data.footer.showSocials : true);
          setFooterLinks(data.footer.links || []);
        }
      } catch (error) {
        console.error('Failed to load branding:', error);
      }
    };

    loadBranding();
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container grid grid-cols-1 gap-6 py-6 md:grid-cols-3 md:items-center">
        <div className="flex justify-center md:justify-start">
          <p className="text-sm text-muted-foreground">
            {showYear && <span>&copy; {new Date().getFullYear()} </span>}
            {branding.siteName}. {footerText}
          </p>
        </div>
        
        {/* Web Sayfaları - Orta Alan */}
        {footerLinks.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <div className="border rounded-md p-4 w-full max-w-md">
              <h3 className="text-sm font-semibold text-center mb-3">Sizin için önemli linkler</h3>
              <nav className="flex flex-wrap items-center justify-center gap-3">
                {footerLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
        
        {showSocials && (
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-semibold text-center">{footerTitle}</h3>
            <SocialIcons />
          </div>
        )}
      </div>
    </footer>
  );
}

  const [showYear, setShowYear] = useState<boolean>(true);
  const [showSocials, setShowSocials] = useState<boolean>(true);
  const [footerLinks, setFooterLinks] = useState<Array<{ label: string; url: string }>>([]);

  useEffect(() => {
    // Firebase'den branding ve footer bilgilerini yükle
    const loadBranding = async () => {
      try {
        const { getHomepageSectionsAction } = await import('@/app/actions');
        const data = await getHomepageSectionsAction();
        if (data.branding) {
          setBranding(data.branding);
        }
        if (data.footer) {
          setFooterTitle(data.footer.title || 'Sosyal Medya Linklerim');
          setFooterText(data.footer.text || 'Tüm hakları saklıdır.');
          setShowYear(typeof data.footer.showYear === 'boolean' ? data.footer.showYear : true);
          setShowSocials(typeof data.footer.showSocials === 'boolean' ? data.footer.showSocials : true);
          setFooterLinks(data.footer.links || []);
        }
      } catch (error) {
        console.error('Failed to load branding:', error);
      }
    };

    loadBranding();
  }, []);

  return (
    <footer className="border-t bg-card">
      <div className="container grid grid-cols-1 gap-6 py-6 md:grid-cols-3 md:items-center">
        <div className="flex justify-center md:justify-start">
          <p className="text-sm text-muted-foreground">
            {showYear && <span>&copy; {new Date().getFullYear()} </span>}
            {branding.siteName}. {footerText}
          </p>
        </div>
        
        {/* Web Sayfaları - Orta Alan */}
        {footerLinks.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <div className="border rounded-md p-4 w-full max-w-md">
              <h3 className="text-sm font-semibold text-center mb-3">Sizin için önemli linkler</h3>
              <nav className="flex flex-wrap items-center justify-center gap-3">
                {footerLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
        
        {showSocials && (
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-semibold text-center">{footerTitle}</h3>
            <SocialIcons />
          </div>
        )}
      </div>
    </footer>
  );
}
