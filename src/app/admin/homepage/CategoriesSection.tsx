'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { CATEGORIES } from '@/lib/data';
import type { HomepageSections } from '@/lib/homepage-sections';
import type { CategorySettings, CustomMenu } from '@/lib/types';
import { getCategorySettingsAction, getCustomMenusAction } from '@/app/actions';

interface CategoriesSectionProps {
  sections: HomepageSections;
  setSections: React.Dispatch<React.SetStateAction<HomepageSections>>;
}

export function CategoriesSection({ sections, setSections }: CategoriesSectionProps) {
  const [categorySettings, setCategorySettings] = React.useState<CategorySettings[]>([]);
  const [customMenus, setCustomMenus] = React.useState<CustomMenu[]>([]);

  React.useEffect(() => {
    getCategorySettingsAction().then(setCategorySettings);
    getCustomMenusAction().then(setCustomMenus);
  }, []);

  const getCategorySetting = (categoryId: string): CategorySettings | undefined => {
    return categorySettings.find(s => s.categoryId === categoryId);
  };

  const visibleCategories = React.useMemo(() => {
    return CATEGORIES
      .map(cat => ({
        ...cat,
        visible: getCategorySetting(cat.id)?.visible ?? true,
        order: getCategorySetting(cat.id)?.order ?? 0,
      }))
      .filter(cat => cat.visible)
      .sort((a, b) => a.order - b.order);
  }, [categorySettings]);

  // Ana menüdeki (sabit menüler) görünür kategori sayısı
  const mainMenuCategoryCount = React.useMemo(() => {
    return CATEGORIES.filter(cat => (getCategorySetting(cat.id)?.visible ?? true)).length;
  }, [categorySettings]);

  const visibleCustomMenus = React.useMemo(() => {
    return customMenus
      .filter(m => m.visible)
      .sort((a, b) => a.order - b.order);
  }, [customMenus]);

  const selectedCategories = sections.categoriesSection?.selectedCategories || [];

  const toggleCategory = (categoryId: string) => {
    const current = selectedCategories;
    const updated = current.includes(categoryId)
      ? current.filter(id => id !== categoryId)
      : [...current, categoryId];
    
    setSections(prev => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection || {
          title: 'Kategoriler',
          visible: true,
          showSubcategories: true,
          selectedCategories: [],
        },
        selectedCategories: updated,
      }
    }));
  };

  const toggleSubcategory = (parentCategoryId: string, subcategoryId: string) => {
    const fullId = `${parentCategoryId}-${subcategoryId}`;
    const current = selectedCategories;
    const updated = current.includes(fullId)
      ? current.filter(id => id !== fullId)
      : [...current, fullId];
    
    setSections(prev => ({
      ...prev,
      categoriesSection: {
        ...prev.categoriesSection || {
          title: 'Kategoriler',
          visible: true,
          showSubcategories: true,
          selectedCategories: [],
        },
        selectedCategories: updated,
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategoriler Bölümü</CardTitle>
        <CardDescription>
          Ana sayfada gösterilecek kategorileri ve alt kategorileri seçin.
          <span className="block mt-1">
            Ana Menü Kategori Sayısı: <strong>{mainMenuCategoryCount}</strong> (Menü Ayarları → Kategoriler)
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="categories-title">Başlık</Label>
          <Input
            id="categories-title"
            value={sections.categoriesSection?.title || 'Kategoriler'}
            onChange={(e) => setSections(prev => ({
              ...prev,
              categoriesSection: {
                ...prev.categoriesSection || {
                  title: 'Kategoriler',
                  visible: true,
                  showSubcategories: true,
                  selectedCategories: [],
                },
                title: e.target.value,
              }
            }))}
            placeholder="Kategoriler"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={sections.categoriesSection?.visible ?? true}
            onCheckedChange={(checked) => setSections(prev => ({
              ...prev,
              categoriesSection: {
                ...prev.categoriesSection || {
                  title: 'Kategoriler',
                  visible: true,
                  showSubcategories: true,
                  selectedCategories: [],
                },
                visible: checked,
              }
            }))}
          />
          <Label>Bu Bölümü Göster</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={sections.categoriesSection?.showSubcategories ?? true}
            onCheckedChange={(checked) => setSections(prev => ({
              ...prev,
              categoriesSection: {
                ...prev.categoriesSection || {
                  title: 'Kategoriler',
                  visible: true,
                  showSubcategories: true,
                  selectedCategories: [],
                },
                showSubcategories: checked,
              }
            }))}
          />
          <Label>Alt Kategorileri Göster</Label>
        </div>

        <div className="space-y-6 pt-4 border-t">
          <div>
            <h3 className="text-sm font-semibold mb-4">Sabit Menüler (Kategoriler)</h3>
            <div className="space-y-4">
              {visibleCategories.map((category) => (
                <div key={category.id} className="border rounded-md p-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label 
                      htmlFor={`category-${category.id}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {category.title}
                    </Label>
                  </div>
                  
                  {sections.categoriesSection?.showSubcategories && category.subcategories && category.subcategories.length > 0 && (
                    <div className="pl-6 space-y-2 border-l-2 ml-2">
                      {category.subcategories.map((subcategory) => {
                        const fullId = `${category.id}-${subcategory.id}`;
                        return (
                          <div key={subcategory.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`subcategory-${fullId}`}
                              checked={selectedCategories.includes(fullId)}
                              onCheckedChange={() => toggleSubcategory(category.id, subcategory.id)}
                            />
                            <Label 
                              htmlFor={`subcategory-${fullId}`}
                              className="text-sm cursor-pointer"
                            >
                              {subcategory.title}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {visibleCustomMenus.length > 0 && (
                <>
                  {visibleCustomMenus.map((menu) => (
                    <div key={menu.id} className="border rounded-md p-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`menu-${menu.id}`}
                          checked={selectedCategories.includes(`menu-${menu.id}`)}
                          onCheckedChange={() => toggleCategory(`menu-${menu.id}`)}
                        />
                        <Label 
                          htmlFor={`menu-${menu.id}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {menu.label}
                        </Label>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

