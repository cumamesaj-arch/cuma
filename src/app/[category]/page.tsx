import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoriesAction, getCustomMenusAction } from '@/app/actions';
import { getCategoriesData } from '@/lib/firestore';
import { CategoryContent } from './category-content';

// Enable dynamic params for runtime route generation
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const categories = await getCategoriesData();
    const customMenus = await getCustomMenusAction();
    
    const params: { category: string }[] = [];
    
    // Add all categories and subcategories
    categories.forEach(category => {
      params.push({ category: category.slug });
      if (category.subcategories) {
        category.subcategories.forEach(sub => {
          params.push({ category: sub.slug });
        });
      }
    });
    
    // Add custom menus
    customMenus.forEach(menu => {
      if (menu.href) {
        const href = menu.href.replace(/^\//, ''); // Remove leading slash
        if (href && !params.find(p => p.category === href)) {
          params.push({ category: href });
        }
      }
    });
    
    // Always include common routes
    if (!params.find(p => p.category === 'cuma-mesajlari')) {
      params.push({ category: 'cuma-mesajlari' });
    }
    
    return params;
  } catch (error) {
    console.error('Error generating static params for categories:', error);
    // Return at least common routes even if Firebase fails
    return [{ category: 'cuma-mesajlari' }];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: categorySlug } = await params;
  
  try {
    const categories = await getCategoriesData();
    const customMenus = await getCustomMenusAction();
    
    const normalize = (v?: string) => String(v || '').trim().replace(/^\//, '').toLowerCase();
    const catSlugNorm = normalize(categorySlug);
    
    // Check if it's a custom menu
    const customMenu = customMenus.find(menu => {
      const menuSlug = normalize(menu.href);
      const menuLabelNorm = normalize(menu.label);
      return menuSlug === catSlugNorm || menuLabelNorm === catSlugNorm;
    });
    
    // Find category
    const category = categories.find((c) => normalize(c.slug) === catSlugNorm) || 
                    categories.flatMap(c => c.subcategories || []).find(s => normalize(s.slug) === catSlugNorm) ||
                    (customMenu ? { title: customMenu.label, slug: categorySlug } : null);
    
    if (!category) {
      return {
        title: 'Kategori Bulunamadı',
      };
    }
    
    const categoryTitle = 'title' in category ? category.title : category.name || categorySlug;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cumamesaj.net';
    const categoryUrl = `${siteUrl}/${categorySlug}`;
    
    return {
      title: `${categoryTitle} - Cuma Mesajları`,
      description: `${categoryTitle} kategorisindeki tüm gönderiler`,
      alternates: {
        canonical: categoryUrl,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for category:', error);
    return {
      title: 'Kategori - Cuma Mesajları',
    };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categorySlug } = await params;
  
  try {
    const categories = await getCategoriesData();
    const customMenus = await getCustomMenusAction();
    
    const normalize = (v?: string) => String(v || '').trim().replace(/^\//, '').toLowerCase();
    const catSlugNorm = normalize(categorySlug);
    
    // Check if it's a custom menu
    const customMenu = customMenus.find(menu => {
      if (!menu.href) return false;
      const menuSlug = normalize(menu.href);
      const menuLabelNorm = normalize(menu.label);
      return menuSlug === catSlugNorm || menuLabelNorm === catSlugNorm;
    });
    
    // Find category
    const category = categories.find((c) => normalize(c.slug) === catSlugNorm) || 
                    categories.flatMap(c => c.subcategories || []).find(s => normalize(s.slug) === catSlugNorm) ||
                    (customMenu ? { title: customMenu.label, slug: categorySlug } : null);
    
    if (!category) {
      notFound();
    }
    
    const categoryTitle = 'title' in category ? category.title : ('name' in category ? category.name : categorySlug);
    const menuForContent = customMenu ? { label: customMenu.label, href: customMenu.href || `/${categorySlug}` } : null;
    
    return (
      <CategoryContent 
        categorySlug={categorySlug} 
        categoryTitle={categoryTitle}
        customMenu={menuForContent}
      />
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}
