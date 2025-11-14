'use client';

import { YandexMetrica } from './YandexMetrica';
import { useEffect, useState } from 'react';
import Script from 'next/script';

interface AnalyticsConfig {
  googleAnalytics?: {
    enabled: boolean;
    measurementId: string;
  };
  yandexMetrica?: {
    enabled: boolean;
    counterId: string;
  };
}

export function DynamicAnalytics() {
  const [analyticsConfig, setAnalyticsConfig] = useState<AnalyticsConfig | null>(null);

  useEffect(() => {
    // Firebase'den analytics config'i yükle
    (async () => {
      try {
        const { getHomepageSectionsAction } = await import('@/app/actions');
        const data = await getHomepageSectionsAction();
        if (data?.analytics) {
          setAnalyticsConfig({
            googleAnalytics: data.analytics.googleAnalytics,
            yandexMetrica: data.analytics.yandexMetrica,
          });
        }
      } catch (e) {
        console.error('[DynamicAnalytics] Error fetching homepage sections:', e);
      }
    })();
  }, []);

  if (!analyticsConfig) {
    return null;
  }

  return (
    <>
      {analyticsConfig.googleAnalytics?.enabled && 
       analyticsConfig.googleAnalytics?.measurementId && (
        <GoogleAnalyticsWithId measurementId={analyticsConfig.googleAnalytics.measurementId} />
      )}
      {analyticsConfig.yandexMetrica?.enabled && 
       analyticsConfig.yandexMetrica?.counterId && (
        <YandexMetrica counterId={analyticsConfig.yandexMetrica.counterId} />
      )}
    </>
  );
}

function GoogleAnalyticsWithId({ measurementId }: { measurementId: string }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics-dynamic"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}

