import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Firebase App Hosting kullanıyoruz (Server Actions destekler)
  // output: 'export', // Static export kaldırıldı
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Firebase Admin SDK'yı sadece server-side'da kullan
    if (!isServer) {
      // Client-side'da Firebase Admin SDK'yı external yap
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false,
        'firebase-admin/firestore': false,
        'firebase-admin/app': false,
        'firebase-admin/auth': false,
      };
      
      // Node.js modüllerini client-side'da external yap
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        http2: false,
        child_process: false,
        'agent-base': false,
        'https-proxy-agent': false,
      };
    }
    return config;
  },
  images: {
    // App Hosting için image optimization aktif
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      // YouTube thumbnails
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      // Firebase Storage için
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Firebase Studio için optimize edilmiş yapılandırma
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
};

export default nextConfig;

        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/**',
      },
      // Firebase Storage için
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Firebase Studio için optimize edilmiş yapılandırma
  experimental: {
    serverActions: {
      bodySizeLimit: '25mb',
    },
  },
};

export default nextConfig;
