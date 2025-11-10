/**
 * Analytics utility functions
 * Google Analytics 4 (GA4) için yardımcı fonksiyonlar
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Google Analytics 4 Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Page view tracking
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * Event tracking
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

/**
 * Özel event'ler için kısayol fonksiyonlar
 */
export const trackPostView = (postId: string, postTitle: string, category: string) => {
  event({
    action: 'view_post',
    category: 'post',
    label: `${postTitle} (${postId})`,
  });
  
  if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', 'post_view', {
      post_id: postId,
      post_title: postTitle,
      post_category: category,
    });
  }
};

export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'click',
    category: 'button',
    label: `${buttonName} - ${location}`,
  });
};

export const trackFormSubmit = (formName: string) => {
  event({
    action: 'submit',
    category: 'form',
    label: formName,
  });
};

export const trackShare = (platform: string, postTitle: string) => {
  event({
    action: 'share',
    category: 'social',
    label: `${platform} - ${postTitle}`,
  });
};

export const trackCategoryView = (categoryName: string, postCount: number) => {
  event({
    action: 'view_category',
    category: 'navigation',
    label: categoryName,
    value: postCount,
  });
};

export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  });
};












