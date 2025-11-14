'use client';

import Image from "next/image"
import React, { useRef, useState, useTransition, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ImagePlaceholder } from "@/lib/placeholder-images";
import { useImages } from "@/contexts/ImagesContext";
import { Button } from "@/components/ui/button"
import { Upload, Trash2, RotateCcw, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast";
import { 
  uploadImageAction, 
  deleteImageAction,
  getDeletedImagesAction,
  restoreImageAction,
  permanentlyDeleteImageAction,
  emptyDeletedImagesAction,
  generateAIImageAction,
  generateAIImageEditAction,
  getPlaceholderImagesAction
} from "@/app/actions";
import { useRouter } from "next/navigation";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { matchesSearch } from "@/lib/search-utils";

function MediaPageContent() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { images: contextImages } = useImages();
    const [images, setImages] = useState<ImagePlaceholder[]>(contextImages);
    const [deletedImages, setDeletedImages] = useState<(ImagePlaceholder & { deletedAt: string })[]>([]);
    const [isPending, startTransition] = useTransition();
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Filter images by search query
    const filteredImages = images.filter(image => 
      searchQuery === '' || matchesSearch(image.description, searchQuery)
    );
    
    // AI Image Generation states
    const [isAIDialogOpen, setIsAIDialogOpen] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [aiStyle, setAiStyle] = useState<'realistic' | 'artistic' | 'minimalist' | 'islamic' | 'modern' | 'classic'>('islamic');
    const [aiAspectRatio, setAiAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('16:9');
    const [aiQuality, setAiQuality] = useState<'standard' | 'high'>('standard');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiMode, setAiMode] = useState<'text' | 'edit'>('text');
    const [aiSourceImageId, setAiSourceImageId] = useState<string>('');

    useEffect(() => {
        getDeletedImagesAction().then(setDeletedImages);
        // Load images from action to ensure we have the latest data
        getPlaceholderImagesAction().then(setImages);
    }, []);

    // Update images when context images change (for real-time updates)
    useEffect(() => {
        if (contextImages.length > 0) {
            setImages(contextImages);
        }
    }, [contextImages]);

    // Open AI dialog if requested via query param (?ai=1)
    useEffect(() => {
        const ai = searchParams?.get('ai');
        if (ai === '1' || ai === 'true') {
            setIsAIDialogOpen(true);
        }
    }, [searchParams]);


    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log('handleFileChange called', { files: event.target.files });
        const files = Array.from(event.target.files || []);
        if (files.length === 0) {
            console.log('No files selected');
            return;
        }
        console.log(`Processing ${files.length} file(s)`);
        
        // Show initial toast for multiple files
        if (files.length > 1) {
            toast({
                title: "Dosyalar İşleniyor...",
                description: `${files.length} görsel seçildi. Yükleme başlıyor...`,
            });
        }

        // Validate all files
        const invalidFiles: string[] = [];
        const validFiles: File[] = [];

        files.forEach(file => {
            // Validate file size (max 20MB)
            if (file.size > 20 * 1024 * 1024) {
                invalidFiles.push(`${file.name} (Çok büyük - max 20MB)`);
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                invalidFiles.push(`${file.name} (Geçersiz dosya tipi)`);
                return;
            }

            validFiles.push(file);
        });

        // Show errors for invalid files
        if (invalidFiles.length > 0) {
            toast({
                variant: "destructive",
                title: "Bazı Dosyalar Geçersiz!",
                description: invalidFiles.join(', '),
            });
        }

        if (validFiles.length === 0) {
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Process valid files
        let processedCount = 0;
        let successCount = 0;
        let errorCount = 0;

        const processFile = (file: File, index: number): Promise<void> => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                
                reader.onerror = (error) => {
                    console.error('FileReader error:', error);
                    errorCount++;
                    processedCount++;
                    if (processedCount === validFiles.length) {
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        toast({
                            variant: "destructive",
                            title: "Yükleme Hatası!",
                            description: `Dosya okunurken hata oluştu: ${file.name}`,
                        });
                    }
                    resolve();
                };
                
                reader.onloadend = () => {
                    console.log('FileReader onloadend', { file: file.name, result: reader.result ? 'has result' : 'no result' });
                    const timestamp = Date.now();
                    const newImage: ImagePlaceholder = {
                        id: `new-${timestamp}-${index}`,
                        description: file.name,
                        imageUrl: reader.result as string,
                        imageHint: 'uploaded image'
                    };

                    startTransition(async () => {
                        const result = await uploadImageAction(newImage);

                        if (result.success && result.image) {
                            setImages(prevImages => [result.image!, ...prevImages]);
                            successCount++;
                        } else {
                            errorCount++;
                        }

                        processedCount++;
                        
                        // All files processed
                        if (processedCount === validFiles.length) {
                            // Reset file input
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }

                            // Show final toast
                            if (successCount > 0 && errorCount === 0) {
                                toast({
                                    title: successCount === 1 ? "Medya Yüklendi!" : "Medyalar Yüklendi!",
                                    description: successCount === 1 
                                        ? "1 görsel başarıyla galeriye eklendi." 
                                        : `${successCount} görsel başarıyla galeriye eklendi.`,
                                });
                            } else if (successCount > 0 && errorCount > 0) {
                                toast({
                                    variant: successCount > errorCount ? "default" : "destructive",
                                    title: "Kısmen Başarılı!",
                                    description: `${successCount} görsel yüklendi, ${errorCount} görsel yüklenirken hata oluştu.`,
                                });
                            } else {
                                toast({
                                    variant: "destructive",
                                    title: "Yükleme Başarısız!",
                                    description: `${errorCount} görsel yüklenirken hata oluştu.`,
                                });
                            }
                        }

                        resolve();
                    });
                };
                
                try {
                    console.log('Reading file:', file.name, file.size, file.type);
                    reader.readAsDataURL(file);
                } catch (error) {
                    console.error('Error reading file:', error);
                    errorCount++;
                    processedCount++;
                    if (processedCount === validFiles.length) {
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }
                        toast({
                            variant: "destructive",
                            title: "Yükleme Hatası!",
                            description: `Dosya okunurken hata oluştu: ${file.name}`,
                        });
                    }
                    resolve();
                }
            });
        };

        // Process all files in parallel batches for better performance
        // Process in batches of 5 to avoid overwhelming the server
        const batchSize = 5;
        for (let i = 0; i < validFiles.length; i += batchSize) {
            const batch = validFiles.slice(i, i + batchSize);
            await Promise.all(batch.map((file, batchIndex) => processFile(file, i + batchIndex)));
        }
    };

    const handleDelete = (imageId: string) => {
        setDeletingId(imageId);
        startTransition(async () => {
            const result = await deleteImageAction(imageId);

            if (result.success) {
                setImages(prevImages => prevImages.filter(img => img.id !== imageId));
                // Reload deleted images
                getDeletedImagesAction().then(setDeletedImages);
                toast({
                    title: "Görsel Silindi!",
                    description: "Görsel çöp kutusuna taşındı.",
                });
                router.refresh();
            } else {
                toast({
                    variant: "destructive",
                    title: "Silme Başarısız!",
                    description: result.error || "Görsel silinirken bir hata oluştu.",
                });
            }
            setDeletingId(null);
        });
    };

    const handleRestore = (imageId: string) => {
        startTransition(async () => {
            const result = await restoreImageAction(imageId);
            if (result.success && result.image) {
                setDeletedImages(deletedImages.filter(img => img.id !== imageId));
                setImages(prevImages => [result.image!, ...prevImages]);
                toast({
                    title: 'Görsel Geri Yüklendi!',
                    description: 'Görsel başarıyla geri yüklendi.',
                });
                router.refresh();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Geri Yükleme Başarısız!',
                    description: result.error || 'Bir hata oluştu.',
                });
            }
        });
    };

    const handlePermanentlyDelete = (imageId: string) => {
        startTransition(async () => {
            const result = await permanentlyDeleteImageAction(imageId);
            if (result.success) {
                setDeletedImages(deletedImages.filter(img => img.id !== imageId));
                toast({
                    title: 'Görsel Kalıcı Olarak Silindi!',
                    description: 'Görsel kalıcı olarak silindi.',
                });
                router.refresh();
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Silme Başarısız!',
                    description: result.error || 'Bir hata oluştu.',
                });
            }
        });
    };

    const handleAIGenerate = () => {
        if (!aiPrompt.trim()) {
            toast({
                variant: "destructive",
                title: "Eksik Bilgi!",
                description: "Lütfen görsel açıklaması girin.",
            });
            return;
        }
        if (aiMode === 'edit' && !aiSourceImageId) {
            toast({
                variant: "destructive",
                title: "Eksik Bilgi!",
                description: "Lütfen düzenlenecek kaynak görseli seçin.",
            });
            return;
        }
        setIsGenerating(true);
        startTransition(async () => {
            let result;
            if (aiMode === 'text') {
              result = await generateAIImageAction({
                  prompt: aiPrompt,
                  style: aiStyle,
                  aspectRatio: aiAspectRatio,
                  quality: aiQuality,
              });
            } else {
              const src = images.find(img => img.id === aiSourceImageId);
              if (!src) {
                toast({ variant: 'destructive', title: 'Kaynak Görsel Bulunamadı' });
                setIsGenerating(false);
                return;
              }
              result = await generateAIImageEditAction({
                sourceDataUri: src.imageUrl,
                prompt: aiPrompt,
                quality: aiQuality,
              });
            }

            if (result.success && result.imageData) {
                setImages(prevImages => [result.imageData!, ...prevImages]);
                toast({
                    title: "Görsel Oluşturuldu!",
                    description: "AI tarafından oluşturulan görsel medya deposuna eklendi.",
                });
                setIsAIDialogOpen(false);
                setAiPrompt('');
                router.refresh();
            } else {
                toast({
                    variant: "destructive",
                    title: "Oluşturma Başarısız!",
                    description: result.error || "Görsel oluşturulurken bir hata oluştu.",
                });
            }
            setIsGenerating(false);
        });
    };

  return (
    <Tabs defaultValue="all">
        <TabsList>
            <TabsTrigger value="all">Tüm Görseller ({images.length})</TabsTrigger>
            <TabsTrigger value="trash">
                <Trash2 className="h-4 w-4 mr-2" />
                Çöp Kutusu ({deletedImages.length})
            </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Medya Deposu</CardTitle>
                            <CardDescription>
                                Yüklenmiş resimleri yönetin. {searchQuery ? `${filteredImages.length} / ` : ''}Toplam {images.length} görsel.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                id="file-upload"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept="image/*"
                                multiple
                                disabled={isPending}
                            />
                            <label 
                                htmlFor="file-upload" 
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                {isPending ? 'Yükleniyor...' : 'Ekle'}
                            </label>
                            <Dialog open={isAIDialogOpen} onOpenChange={setIsAIDialogOpen} modal={true}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" disabled={isGenerating}>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        {isGenerating ? 'Oluşturuluyor...' : 'AI ile Görsel Oluştur'}
                                    </Button>
                                </DialogTrigger>
                                <DialogContent 
                                    className="max-w-5xl w-[95vw] sm:w-[90vw] lg:w-[80vw] max-h-[85vh] overflow-y-auto"
                                    onEscapeKeyDown={(e) => {
                                        if (!isGenerating) {
                                            setIsAIDialogOpen(false);
                                        } else {
                                            e.preventDefault();
                                        }
                                    }}
                                    onInteractOutside={(e) => {
                                        if (isGenerating) {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    <DialogHeader>
                                        <DialogTitle>AI ile Görsel {aiMode === 'text' ? 'Oluştur' : 'Düzenle'}</DialogTitle>
                                        <DialogDescription>
                                            {aiMode === 'text' ? 'Açıklama girerek yapay zeka ile özgün görseller oluşturun.' : 'Bir kaynak görsel seçin ve düzenleme talimatını yazın.'}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-3 py-2">
                                        <div className="flex items-center gap-3">
                                            <Button type="button" variant={aiMode === 'text' ? 'default' : 'outline'} size="sm" onClick={() => setAiMode('text')} disabled={isGenerating}>Text-to-Image</Button>
                                            <Button type="button" variant={aiMode === 'edit' ? 'default' : 'outline'} size="sm" onClick={() => setAiMode('edit')} disabled={isGenerating}>Image-to-Image</Button>
                                        </div>
                                    </div>
                                    <div className="grid gap-4 py-2">
                                        {aiMode === 'edit' && (
                                          <div className="grid gap-2">
                                            <Label>Kaynak Görsel</Label>
                                            <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                                              {images.map(img => (
                                                <button
                                                  key={img.id}
                                                  type="button"
                                                  className={`relative border rounded-md overflow-hidden ${aiSourceImageId === img.id ? 'ring-2 ring-primary' : ''}`}
                                                  onClick={() => setAiSourceImageId(img.id)}
                                                  disabled={isGenerating}
                                                >
                                                  <img src={img.imageUrl} alt={img.description} className="h-20 w-full object-cover" />
                                                </button>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        <div className="grid gap-2">
                                            <Label htmlFor="ai-prompt">Görsel Açıklaması *</Label>
                                            <Textarea
                                                id="ai-prompt"
                                                value={aiPrompt}
                                                onChange={(e) => setAiPrompt(e.target.value)}
                                                placeholder="Örn: Gün batımında cami silüeti, İstanbul'dan Boğaz manzarası, İslami geometrik desenler..."
                                                rows={4}
                                                disabled={isGenerating}
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Detaylı açıklama daha iyi sonuçlar verir. Renkler, stil, konum gibi bilgiler ekleyin.
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="ai-style">Stil</Label>
                                                <Select
                                                    value={aiStyle}
                                                    onValueChange={(value) => setAiStyle(value as typeof aiStyle)}
                                                    disabled={isGenerating}
                                                >
                                                    <SelectTrigger id="ai-style">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent 
                                                        onCloseAutoFocus={(e) => {
                                                            // Prevent focus from being trapped in portal
                                                            const target = e.currentTarget as HTMLElement;
                                                            const dialog = target?.closest('[role="dialog"]');
                                                            if (dialog) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <SelectItem value="realistic">Gerçekçi</SelectItem>
                                                        <SelectItem value="artistic">Sanatsal</SelectItem>
                                                        <SelectItem value="minimalist">Minimalist</SelectItem>
                                                        <SelectItem value="islamic">İslami</SelectItem>
                                                        <SelectItem value="modern">Modern</SelectItem>
                                                        <SelectItem value="classic">Klasik</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="ai-aspect-ratio">En Boy Oranı</Label>
                                                <Select
                                                    value={aiAspectRatio}
                                                    onValueChange={(value) => setAiAspectRatio(value as typeof aiAspectRatio)}
                                                    disabled={isGenerating}
                                                >
                                                    <SelectTrigger id="ai-aspect-ratio">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        onCloseAutoFocus={(e) => {
                                                            // Prevent focus from being trapped in portal
                                                            const target = e.currentTarget as HTMLElement;
                                                            const dialog = target?.closest('[role="dialog"]');
                                                            if (dialog) {
                                                                e.preventDefault();
                                                            }
                                                        }}
                                                    >
                                                        <SelectItem value="1:1">Kare (1:1)</SelectItem>
                                                        <SelectItem value="16:9">Yatay (16:9)</SelectItem>
                                                        <SelectItem value="9:16">Dikey (9:16)</SelectItem>
                                                        <SelectItem value="4:3">Klasik (4:3)</SelectItem>
                                                        <SelectItem value="3:4">Portre (3:4)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ai-quality">Kalite</Label>
                                            <Select
                                                value={aiQuality}
                                                onValueChange={(value) => setAiQuality(value as typeof aiQuality)}
                                                disabled={isGenerating}
                                            >
                                                <SelectTrigger id="ai-quality">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent
                                                    onCloseAutoFocus={(e) => {
                                                        // Prevent focus from being trapped in portal
                                                        const dialog = e.currentTarget.closest('[role="dialog"]');
                                                        if (dialog) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <SelectItem value="standard">Standart</SelectItem>
                                                    <SelectItem value="high">Yüksek</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsAIDialogOpen(false)}
                                            disabled={isGenerating}
                                        >
                                            İptal
                                        </Button>
                                        <Button
                                            onClick={handleAIGenerate}
                                            disabled={isGenerating || !aiPrompt.trim()}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                                                    Oluşturuluyor...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="mr-2 h-4 w-4" />
                                                    Görsel Oluştur
                                                </>
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Görsellerde ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            {filteredImages.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Henüz görsel yüklenmemiş.</p>
                    <label htmlFor="file-upload" className="cursor-pointer inline-block mt-4">
                        <Button 
                            type="button"
                            className="mt-4" 
                            disabled={isPending}
                        >
                            <Upload className="mr-2 h-4 w-4" />
                            İlk Görseli Yükle
                        </Button>
                    </label>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {isPending && deletingId === null && (
                        <Skeleton className="aspect-square w-full rounded-md" />
                    )}
                    {filteredImages.map(image => (
                        <div key={image.id} className="group relative">
                            <Image
                                src={image.imageUrl}
                                alt={image.description}
                                width={200}
                                height={200}
                                className="aspect-square w-full rounded-md object-cover transition-transform group-hover:scale-105"
                                data-ai-hint={image.imageHint}
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button 
                                            variant="destructive" 
                                            size="sm"
                                            disabled={isPending && deletingId === image.id}
                                        >
                                            {isPending && deletingId === image.id ? (
                                                <>Siliniyor...</>
                                            ) : (
                                                <>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Sil
                                                </>
                                            )}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Görseli Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Görsel çöp kutusuna taşınacaktır. Daha sonra geri yükleyebilir veya kalıcı olarak silebilirsiniz.
                                                {image.description && (
                                                    <span className="block mt-2 font-semibold">
                                                        Dosya: {image.description}
                                                    </span>
                                                )}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>İptal</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDelete(image.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                disabled={isPending}
                                            >
                                                Sil
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity truncate px-2">
                                {image.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="trash">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Çöp Kutusu</CardTitle>
                        <CardDescription>
                        Silinen görselleri buradan geri yükleyebilir veya kalıcı olarak silebilirsiniz. Toplam {deletedImages.length} görsel.
                        </CardDescription>
                      </div>
                      {deletedImages.length > 0 && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" /> Tümünü Boşalt
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Tüm görselleri kalıcı olarak silmek istediğinize emin misiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu işlem geri alınamaz. Çöp kutusundaki tüm görseller kalıcı olarak silinecek.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  startTransition(async () => {
                                    const res = await emptyDeletedImagesAction();
                                    if (res.success) {
                                      setDeletedImages([]);
                                      toast({ title: 'Çöp Kutusu Boşaltıldı', description: 'Tüm görseller kalıcı olarak silindi.' });
                                      router.refresh();
                                    } else {
                                      toast({ variant: 'destructive', title: 'İşlem Başarısız', description: res.error || 'Bir hata oluştu.' });
                                    }
                                  })
                                }}
                              >
                                Evet, Boşalt
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                </CardHeader>
                <CardContent>
                    {deletedImages.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Trash2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                            <p>Çöp kutusu boş</p>
                            <p className="text-sm">Silinen görsel yok</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {deletedImages.map(image => (
                                <div key={image.id} className="group relative">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={200}
                                        height={200}
                                        className="aspect-square w-full rounded-md object-cover transition-transform group-hover:scale-105 opacity-60"
                                        data-ai-hint={image.imageHint}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-md">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleRestore(image.id)}
                                            disabled={isPending}
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Geri Yükle
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={isPending}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Kalıcı Sil
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Görseli Kalıcı Olarak Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bu işlem geri alınamaz. Görsel kalıcı olarak silinecektir.
                                                        {image.description && (
                                                            <span className="block mt-2 font-semibold">
                                                                Dosya: {image.description}
                                                            </span>
                                                        )}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel disabled={isPending}>İptal</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handlePermanentlyDelete(image.id)}
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        disabled={isPending}
                                                    >
                                                        {isPending ? 'Siliniyor...' : 'Kalıcı Olarak Sil'}
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 rounded-b-md opacity-0 group-hover:opacity-100 transition-opacity truncate px-2">
                                        {image.description}
                                    </div>
                                    <div className="absolute top-0 right-0 bg-black/60 text-white text-xs p-1 rounded-tl-md">
                                        {new Date(image.deletedAt).toLocaleDateString('tr-TR')}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
  )
}

export default function MediaPage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <MediaPageContent />
    </Suspense>
  );
}
