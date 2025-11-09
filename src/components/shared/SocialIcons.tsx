'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, MessageCircle, Youtube } from 'lucide-react';
import type { SocialLink } from '@/lib/types';

const PinterestIcon = (props: { className?: string }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12.5 12c0-2.5-1.5-5-5-5-3.5 0-5 2.5-5 5 0 2.2 1.2 4.4 2.8 5.2.2.1.3.1.4-.1.1-.2.2-1 .3-1.2.1-.3.1-.4-.2-.7-1-1.2-1.5-2.8-1.5-4.3 0-3.3 2.5-6.5 7-6.5 4.1 0 6.5 2.8 6.5 6 0 4-2.2 7.5-5.5 7.5-1.7 0-3-1.4-2.6-3 .5-2 1.5-4 1.5-5.5 0-1-1.3-2-2.5-2s-2.5 1-2.5 2c0 1.2.7 2.2.7 2.2-.4 1.8-1.8 4-2.2 5.5-.3 1.2-.2 2.5.3 3.3.4.6 1.3.8 2 .8 2.5 0 4.5-2.5 4.5-5.5 0-1.5-1.2-2.5-2.5-2.5-1.5 0-2.5 1-2.5 2.5 0 .2.1.5.2.7l-1.3 4.5c0 .3.1.7.5.7.9 0 3-3.2 3-5.5z" />
  </svg>
);

// X (Twitter) logo component
const XIcon = (props: { className?: string }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// NextSosyal logo component
const NextSosyalIcon = (props: { className?: string }) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M7 3h10v18H7V3zm2 2v14h6V5H9zm2 2h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z"/>
    <path d="M9 5h6v14H9V5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11 7h2v10h-2V7z" fill="currentColor"/>
  </svg>
);

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Facebook: Facebook,
  Twitter: XIcon,
  Instagram: Instagram,
  YouTube: Youtube,
  Pinterest: PinterestIcon,
  WhatsApp: MessageCircle,
  nextsosyal: NextSosyalIcon,
  NextSosyal: NextSosyalIcon,
};

// Color mapping for social media platforms
const colorMap: { [key: string]: string } = {
  Facebook: 'text-blue-600',
  Twitter: 'text-black dark:text-white',
  Instagram: 'text-pink-500',
  YouTube: 'text-red-600',
  Pinterest: 'text-red-700',
  WhatsApp: 'text-green-500',
  nextsosyal: 'text-purple-600',
  NextSosyal: 'text-purple-600',
};

interface SocialIconsProps {
    className?: string;
    iconSize?: string;
}

export function SocialIcons({ className, iconSize = 'h-6 w-6' }: SocialIconsProps) {
  const [socialLinks, setSocialLinks] = React.useState<SocialLink[]>([]);

  React.useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const response = await fetch('/api/social-links');
        if (response.ok) {
          const links = await response.json();
          setSocialLinks(links);
        }
      } catch (error) {
        console.error('Failed to load social links:', error);
      }
    };

    loadSocialLinks();
  }, []);

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {socialLinks.filter(social => social.active).map((social: SocialLink) => {
        const Icon = iconMap[social.name];
        if (!Icon) return null;
        // Use color from socialLinks.json if available, otherwise use colorMap
        const iconColor = social.color || colorMap[social.name] || 'text-muted-foreground';
        return (
          <Button key={social.name} variant="ghost" size="icon" asChild className="hover:bg-transparent h-8 w-8 p-0">
            <Link href={social.url} target="_blank" rel="noopener noreferrer">
              <Icon className={cn(iconSize, iconColor, "transition-colors hover:opacity-80")} />
              <span className="sr-only">{social.name}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}

    