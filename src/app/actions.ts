
'use server';

import * as fs from 'fs/promises';
import path from 'path';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import type { Post, Comment, VisitorMessage, SocialLink, SharePlatform, HomepageSections, CustomMenu, CategorySettings, User, UserRole, SocialMediaAPI, MenuGlobalConfig, Note } from '@/lib/types';
import { generateImage } from '@/ai/flows/generate-image-flow';
import { generateImageEdit } from '@/ai/flows/generate-image-edit-flow';
import { generateImageCaption } from '@/ai/flows/generate-image-caption-flow';
import { revalidatePath } from 'next/cache';
import { generateSEOKeywords } from '@/ai/flows/generate-seo-keywords-flow';
import crypto from 'crypto';

export async function getPlaceholderImagesAction(): Promise<ImagePlaceholder[]> {
    try {
        const filePath = path.join(process.cwd(), 'src/lib/placeholder-images.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        // Validate that placeholderImages array exists
        if (!data.placeholderImages || !Array.isArray(data.placeholderImages)) {
            return [];
        }

        return data.placeholderImages;
    } catch (error) {
        console.error('Error reading placeholder images:', error);
        return [];
    }
}

export async function uploadPlaceholderFilesAction(formData: FormData): Promise<{ success: boolean; images?: ImagePlaceholder[]; error?: string }>{
  try {
    const files = formData.getAll('files') as unknown as File[];
    if (!files || files.length === 0) {
      return { success: false, error: 'Dosya bulunamadı' };
    }

    const publicDir = path.join(process.cwd(), 'public');
    const uploadsDir = path.join(publicDir, 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const placeholderPath = path.join(process.cwd(), 'src/lib/placeholder-images.json');
    const raw = await fs.readFile(placeholderPath, 'utf-8');
    const json = JSON.parse(raw);
    if (!Array.isArray(json.placeholderImages)) json.placeholderImages = [];

    const saved: ImagePlaceholder[] = [];
    // Process all files in parallel for better performance
    const filePromises = files.map(async (f) => {
      // @ts-ignore - File in server action supports arrayBuffer
      const arrayBuf = await f.arrayBuffer();
      const buf = Buffer.from(arrayBuf);
      const ext = (f.name && f.name.includes('.')) ? ('.' + f.name.split('.').pop()) : '.jpg';
      const timestamp = Date.now();
      const random = Math.floor(Math.random()*1e6);
      const fileName = `upload_${timestamp}_${random}${ext}`;
      const abs = path.join(uploadsDir, fileName);
      await fs.writeFile(abs, buf);
      const imageUrl = `/uploads/${fileName}`;
      const image: ImagePlaceholder = {
        id: `upload-${timestamp}-${random}`,
        imageUrl,
        description: f.name.substring(0, 100),
        imageHint: 'uploaded',
      };
      return image;
    });
    
    const processedImages = await Promise.all(filePromises);
    processedImages.forEach(image => {
      json.placeholderImages.unshift(image);
      saved.push(image);
    });

    await fs.writeFile(placeholderPath, JSON.stringify(json, null, 2), 'utf-8');
    revalidatePath('/admin/posts/new');
    revalidatePath('/admin/media');
    return { success: true, images: saved };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Yükleme hatası' };
  }
}

export async function uploadImageAction(newImage: ImagePlaceholder) {
    try {
        // Use placeholder-images.json (original file still exists for server actions)
        const filePath = path.join(process.cwd(), 'src/lib/placeholder-images.json');
        let fileContent: string;
        let data: { placeholderImages: ImagePlaceholder[] };
        
        try {
            fileContent = await fs.readFile(filePath, 'utf-8');
            data = JSON.parse(fileContent);
        } catch (readError) {
            // If file doesn't exist, create it
            data = { placeholderImages: [] };
        }

        // Validate that placeholderImages array exists
        if (!data.placeholderImages || !Array.isArray(data.placeholderImages)) {
            data.placeholderImages = [];
        }

        // Add the new image to the start of the array
        data.placeholderImages.unshift(newImage);

        // Write the updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        
        // Also update placeholder-images-data.ts if it exists
        try {
            const tsFilePath = path.join(process.cwd(), 'src/lib/placeholder-images-data.ts');
            const tsContent = `export const placeholderImagesData = ${JSON.stringify(data, null, 2)};`;
            await fs.writeFile(tsFilePath, tsContent, 'utf-8');
        } catch (tsError) {
            // Ignore TS file update errors
            console.warn('Could not update placeholder-images-data.ts:', tsError);
        }

        // Revalidate pages that use images
        revalidatePath('/admin/media');
        revalidatePath('/admin/posts/new');

        return { success: true, image: newImage };
    } catch (error) {
        console.error('Error updating placeholder images:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

export async function deleteImageAction(imageId: string) {
    try {
        const filePath = path.join(process.cwd(), 'src/lib/placeholder-images.json');
        let fileContent: string;
        let data: { placeholderImages: ImagePlaceholder[] };
        
        try {
            fileContent = await fs.readFile(filePath, 'utf-8');
            data = JSON.parse(fileContent);
        } catch (readError) {
            return { success: false, error: 'Images file not found' };
        }

        // Validate that placeholderImages array exists
        if (!data.placeholderImages || !Array.isArray(data.placeholderImages)) {
            return { success: false, error: 'Images array not found' };
        }

        // Find the image to delete
        const imageToDelete = data.placeholderImages.find(
            (img: any) => img.id === imageId
        );

        if (!imageToDelete) {
            return { success: false, error: 'Görsel bulunamadı' };
        }

        // Move to trash (deleted-images.json)
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-images.json');
        let deletedImages: any[] = [];
        
        try {
            const deletedContent = await fs.readFile(deletedFilePath, 'utf-8');
            deletedImages = JSON.parse(deletedContent);
        } catch {
            // File doesn't exist, create empty array
        }

        // Add deletion timestamp
        const deletedImage = {
            ...imageToDelete,
            deletedAt: new Date().toISOString()
        };

        deletedImages.push(deletedImage);
        await fs.writeFile(deletedFilePath, JSON.stringify(deletedImages, null, 2), 'utf-8');

        // Remove from active images
        data.placeholderImages = data.placeholderImages.filter(
            (img: any) => img.id !== imageId
        );

        // Write the updated data back to the file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
        
        // Also update placeholder-images-data.ts if it exists
        try {
            const tsFilePath = path.join(process.cwd(), 'src/lib/placeholder-images-data.ts');
            const tsContent = `export const placeholderImagesData = ${JSON.stringify(data, null, 2)};`;
            await fs.writeFile(tsFilePath, tsContent, 'utf-8');
        } catch (tsError) {
            // Ignore TS file update errors
            console.warn('Could not update placeholder-images-data.ts:', tsError);
        }

        // Revalidate pages that use images
        revalidatePath('/admin/media');
        revalidatePath('/admin/posts/new');

        return { success: true };
    } catch (error) {
        console.error('Error deleting image:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}


// Helper function to escape strings for TypeScript/JavaScript code (for template literals)
function escapeForTemplateLiteral(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/`/g, '\\`')    // Escape backticks
    .replace(/\$/g, '\\$')   // Escape dollar signs (for template literals)
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r')   // Escape carriage returns
    .replace(/\t/g, '\\t');  // Escape tabs
}

// Helper function to escape strings for single quotes (URLs and simple strings)
function escapeForSingleQuote(str: string): string {
  return str
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/'/g, "\\'")    // Escape single quotes
    .replace(/\n/g, '\\n')   // Escape newlines
    .replace(/\r/g, '\\r')   // Escape carriage returns
    .replace(/\t/g, '\\t');  // Escape tabs
}

export async function createPostAction(postData: Post) {
    try {
        // Log incoming post data
        console.log('[CREATE POST ACTION] Received postData:', {
            id: postData.id,
            title: postData.title,
            imageIds: postData.imageIds,
            imageId: postData.imageId,
            hasImageIds: !!postData.imageIds,
            hasImageId: !!postData.imageId,
            imageIdsLength: postData.imageIds?.length || 0,
        });

        const filePath = path.join(process.cwd(), 'src/lib/data.ts');
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // Find the POSTS array in the file content
        const postsRegex = /export const POSTS: Post\[] = \[/;
        const match = fileContent.match(postsRegex);

        if (!match) {
            throw new Error("Could not find the POSTS array in data.ts");
        }
        
        // Escape all string content properly
        // meal uses template literal (may contain multi-line text)
        const escapedMeal = escapeForTemplateLiteral(postData.content.meal);
        
        // URLs use single quotes (need different escaping)
        const escapedMealleri = escapeForSingleQuote(postData.content.mealleri || '');
        const escapedTefsir = escapeForSingleQuote(postData.content.tefsir || '');
        const escapedKisaTefsir = escapeForSingleQuote(postData.content.kisaTefsir || '');
        
        // Title and slug use single quotes
        const escapedTitle = escapeForSingleQuote(postData.title);
        const escapedSlug = escapeForSingleQuote(postData.slug);
        const escapedCreatedAt = escapeForSingleQuote(postData.createdAt);
        const escapedCategory = escapeForSingleQuote(postData.category);
        const escapedPostId = escapeForSingleQuote(postData.id);
        
        // Handle image IDs (support both legacy single imageId and new imageIds array)
        let imageIdPart = '';
        console.log('[CREATE POST ACTION] Processing images - imageIds:', postData.imageIds, 'imageId:', postData.imageId);
        
        if (postData.imageIds && postData.imageIds.length > 0) {
          console.log('[CREATE POST ACTION] Using imageIds array, length:', postData.imageIds.length);
          const escapedImageIds = postData.imageIds.map(id => `'${escapeForSingleQuote(id)}'`).join(', ');
          imageIdPart = `\n    imageIds: [${escapedImageIds}],`;
          // Also add legacy imageId for backward compatibility if only one image
          if (postData.imageIds.length === 1) {
            imageIdPart += `\n    imageId: '${escapeForSingleQuote(postData.imageIds[0])}',`;
          }
          console.log('[CREATE POST ACTION] Generated imageIdPart:', imageIdPart);
        } else if (postData.imageId) {
          console.log('[CREATE POST ACTION] Using legacy imageId:', postData.imageId);
          imageIdPart = `\n    imageId: '${escapeForSingleQuote(postData.imageId)}',`;
          console.log('[CREATE POST ACTION] Generated imageIdPart:', imageIdPart);
        } else {
          console.warn('[CREATE POST ACTION] WARNING: No images found in postData! imageIds:', postData.imageIds, 'imageId:', postData.imageId);
        }
        
        // Handle YouTube video IDs (support both legacy single youtubeVideoId and new youtubeVideoIds array)
        let youtubeVideoIdPart = '';
        if (postData.youtubeVideoIds && postData.youtubeVideoIds.length > 0) {
          const escapedYoutubeVideoIds = postData.youtubeVideoIds.map(id => `'${escapeForSingleQuote(id)}'`).join(', ');
          youtubeVideoIdPart = `\n    youtubeVideoIds: [${escapedYoutubeVideoIds}],`;
          // Also add legacy youtubeVideoId for backward compatibility if only one video
          if (postData.youtubeVideoIds.length === 1) {
            youtubeVideoIdPart += `\n    youtubeVideoId: '${escapeForSingleQuote(postData.youtubeVideoIds[0])}',`;
          }
        } else if (postData.youtubeVideoId) {
          youtubeVideoIdPart = `\n    youtubeVideoId: '${escapeForSingleQuote(postData.youtubeVideoId)}',`;
        }
        
        const customMessagePart = postData.customMessage 
          ? `,\n    customMessage: "${postData.customMessage.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
          : '';

        const statusPart = postData.status 
          ? `,\n    status: '${postData.status}'`
          : '';

        // SEO alanları
        let seoPart = '';
        if (postData.seo) {
          const metaTitlePart = postData.seo.metaTitle 
            ? `metaTitle: '${escapeForSingleQuote(postData.seo.metaTitle)}',`
            : '';
          const metaDescriptionPart = postData.seo.metaDescription 
            ? `metaDescription: '${escapeForSingleQuote(postData.seo.metaDescription)}',`
            : '';
          const keywordsPart = postData.seo.keywords && postData.seo.keywords.length > 0
            ? `keywords: [${postData.seo.keywords.map(k => `'${escapeForSingleQuote(k)}'`).join(', ')}],`
            : '';
          const ogImagePart = postData.seo.ogImage
            ? `ogImage: '${escapeForSingleQuote(postData.seo.ogImage)}',`
            : '';
          
          if (metaTitlePart || metaDescriptionPart || keywordsPart || ogImagePart) {
            seoPart = `,\n    seo: {\n      ${metaTitlePart ? metaTitlePart + '\n      ' : ''}${metaDescriptionPart ? metaDescriptionPart + '\n      ' : ''}${keywordsPart ? keywordsPart + '\n      ' : ''}${ogImagePart ? ogImagePart + '\n      ' : ''}\n    }`.replace(/,\n    \n    /g, ',\n    ').replace(/,\n    \}$/, '\n    }');
          }
        }
        
        const newPostString = `
  {
    id: '${escapedPostId}',
    title: '${escapedTitle}',
    slug: '${escapedSlug}',
    category: '${escapedCategory}',${imageIdPart}
    content: {
      meal: \`${escapedMeal}\`,
      mealleri: '${escapedMealleri}',
      tefsir: '${escapedTefsir}',
      kisaTefsir: '${escapedKisaTefsir}',
    },${youtubeVideoIdPart}
    createdAt: '${escapedCreatedAt}'${customMessagePart}${statusPart}${seoPart}
  },`;

        console.log('[CREATE POST ACTION] Generated newPostString (first 500 chars):', newPostString.substring(0, 500));
        console.log('[CREATE POST ACTION] ImageIdPart in string:', imageIdPart ? 'PRESENT' : 'MISSING');

        const newFileContent = fileContent.replace(postsRegex, `export const POSTS: Post[] = [${newPostString}`);

        // Log final content to verify images are included
        const imageCheckInFinal = newFileContent.includes('imageIds:') || newFileContent.includes('imageId:');
        console.log('[CREATE POST ACTION] Final content includes image fields:', imageCheckInFinal);
        if (!imageCheckInFinal && (postData.imageIds?.length > 0 || postData.imageId)) {
          console.error('[CREATE POST ACTION] ERROR: Images were in postData but not in final content!');
          console.log('[CREATE POST ACTION] Final content snippet around new post:', newFileContent.substring(match.index! + match[0].length, match.index! + match[0].length + 1000));
        }

        await fs.writeFile(filePath, newFileContent, 'utf-8');
        console.log('[CREATE POST ACTION] File written successfully');

        revalidatePath('/');
        revalidatePath('/[category]', 'layout');
        revalidatePath('/[category]/[slug]', 'layout');
        revalidatePath('/admin/posts');


        return { success: true, post: postData };
    } catch (error) {
        console.error('Error creating post:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Update existing post by id (in-place replace)
export async function updatePostAction(postData: Post) {
  try {
    // Log incoming post data
    console.log('[UPDATE POST ACTION] Received postData:', {
      id: postData.id,
      title: postData.title,
      imageIds: postData.imageIds,
      imageId: postData.imageId,
      hasImageIds: !!postData.imageIds,
      hasImageId: !!postData.imageId,
      imageIdsLength: postData.imageIds?.length || 0,
    });

    const filePath = path.join(process.cwd(), 'src/lib/data.ts');
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const postsRegex = /export const POSTS: Post\[] = \[/;
    const match = fileContent.match(postsRegex);
    if (!match) throw new Error('Could not find the POSTS array in data.ts');

    const beforePosts = fileContent.substring(0, match.index! + match[0].length);
    const afterPosts = fileContent.substring(match.index! + match[0].length);

    // Build updated post string (same builder as create)
    const escapedMeal = escapeForTemplateLiteral(postData.content.meal);
    const escapedMealleri = escapeForSingleQuote(postData.content.mealleri || '');
    const escapedTefsir = escapeForSingleQuote(postData.content.tefsir || '');
    const escapedKisaTefsir = escapeForSingleQuote(postData.content.kisaTefsir || '');
    const escapedTitle = escapeForSingleQuote(postData.title);
    const escapedSlug = escapeForSingleQuote(postData.slug);
    const escapedCreatedAt = escapeForSingleQuote(postData.createdAt);
    const escapedCategory = escapeForSingleQuote(postData.category);
    const escapedPostId = escapeForSingleQuote(postData.id);

    let imageIdPart = '';
    console.log('[UPDATE POST ACTION] Processing images - imageIds:', postData.imageIds, 'imageId:', postData.imageId);
    
    if (postData.imageIds && postData.imageIds.length > 0) {
      console.log('[UPDATE POST ACTION] Using imageIds array, length:', postData.imageIds.length);
      const escapedImageIds = postData.imageIds.map(id => `'${escapeForSingleQuote(id)}'`).join(', ');
      imageIdPart = `\n    imageIds: [${escapedImageIds}],`;
      if (postData.imageIds.length === 1) {
        imageIdPart += `\n    imageId: '${escapeForSingleQuote(postData.imageIds[0])}',`;
      }
      console.log('[UPDATE POST ACTION] Generated imageIdPart:', imageIdPart);
    } else if (postData.imageId) {
      console.log('[UPDATE POST ACTION] Using legacy imageId:', postData.imageId);
      imageIdPart = `\n    imageId: '${escapeForSingleQuote(postData.imageId)}',`;
      console.log('[UPDATE POST ACTION] Generated imageIdPart:', imageIdPart);
    } else {
      console.warn('[UPDATE POST ACTION] WARNING: No images found in postData! imageIds:', postData.imageIds, 'imageId:', postData.imageId);
    }

    let youtubeVideoIdPart = '';
    if (postData.youtubeVideoIds && postData.youtubeVideoIds.length > 0) {
      const escapedYoutubeVideoIds = postData.youtubeVideoIds.map(id => `'${escapeForSingleQuote(id)}'`).join(', ');
      youtubeVideoIdPart = `\n    youtubeVideoIds: [${escapedYoutubeVideoIds}],`;
      if (postData.youtubeVideoIds.length === 1) {
        youtubeVideoIdPart += `\n    youtubeVideoId: '${escapeForSingleQuote(postData.youtubeVideoIds[0])}',`;
      }
    } else if (postData.youtubeVideoId) {
      youtubeVideoIdPart = `\n    youtubeVideoId: '${escapeForSingleQuote(postData.youtubeVideoId)}',`;
    }

    const customMessagePart = postData.customMessage
      ? `,\n    customMessage: "${postData.customMessage.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
      : '';
    const statusPart = postData.status ? `,\n    status: '${postData.status}'` : '';

    let seoPart = '';
    if (postData.seo) {
      const metaTitlePart = postData.seo.metaTitle ? `metaTitle: '${escapeForSingleQuote(postData.seo.metaTitle)}',` : '';
      const metaDescriptionPart = postData.seo.metaDescription ? `metaDescription: '${escapeForSingleQuote(postData.seo.metaDescription)}',` : '';
      const keywordsPart = postData.seo.keywords && postData.seo.keywords.length > 0 ? `keywords: [${postData.seo.keywords.map(k => `'${escapeForSingleQuote(k)}'`).join(', ')}],` : '';
      const ogImagePart = postData.seo.ogImage ? `ogImage: '${escapeForSingleQuote(postData.seo.ogImage)}',` : '';
      if (metaTitlePart || metaDescriptionPart || keywordsPart || ogImagePart) {
        seoPart = `,\n    seo: {\n      ${metaTitlePart ? metaTitlePart + '\n      ' : ''}${metaDescriptionPart ? metaDescriptionPart + '\n      ' : ''}${keywordsPart ? keywordsPart + '\n      ' : ''}${ogImagePart ? ogImagePart + '\n      ' : ''}\n    }`.replace(/,\n    \n    /g, ',\n    ').replace(/,\n    \}$/,'\n    }');
      }
    }

    const updatedPostString = `\n  {\n    id: '${escapedPostId}',\n    title: '${escapedTitle}',\n    slug: '${escapedSlug}',\n    category: '${escapedCategory}',${imageIdPart}\n    content: {\n      meal: \`${escapedMeal}\`,\n      mealleri: '${escapedMealleri}',\n      tefsir: '${escapedTefsir}',\n      kisaTefsir: '${escapedKisaTefsir}',\n    },${youtubeVideoIdPart}\n    createdAt: '${escapedCreatedAt}'${customMessagePart}${statusPart}${seoPart}\n  },`;

    console.log('[UPDATE POST ACTION] Generated updatedPostString (first 500 chars):', updatedPostString.substring(0, 500));
    console.log('[UPDATE POST ACTION] ImageIdPart in string:', imageIdPart ? 'PRESENT' : 'MISSING');

    // Find existing post by id and replace
    const idRegex = new RegExp(`id:\\s*['"]${escapedPostId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
    const idMatch = afterPosts.match(idRegex);
    if (!idMatch) return { success: false, error: 'Güncellenecek gönderi bulunamadı.' };

    const idIndex = afterPosts.indexOf(idMatch[0]);
    // Find opening brace
    let start = idIndex;
    while (start > 0 && afterPosts[start] !== '{') start--;
    if (afterPosts[start] !== '{') return { success: false, error: 'Gönderi bloğu tespit edilemedi.' };
    // Find end of object with brace counting
    let end = start + 1, depth = 1, inString = false, quote = '' as string;
    for (let i = start + 1; i < afterPosts.length; i++) {
      const ch = afterPosts[i];
      if ((ch === '"' || ch === "'" || ch === '`') && afterPosts[i - 1] !== '\\') {
        if (!inString) { inString = true; quote = ch; }
        else if (ch === quote) { inString = false; quote = ''; }
      } else if (!inString) {
        if (ch === '{') depth++;
        if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
      }
    }
    // Include trailing comma if present
    let endWithComma = end;
    let j = endWithComma;
    while (j < afterPosts.length && /\s/.test(afterPosts[j])) j++;
    if (afterPosts[j] === ',') endWithComma = j + 1;

    const newAfter = afterPosts.substring(0, start) + updatedPostString + afterPosts.substring(endWithComma);
    const finalContent = beforePosts + newAfter;

    // Log final content to verify images are included
    const imageCheckInFinal = finalContent.includes('imageIds:') || finalContent.includes('imageId:');
    console.log('[UPDATE POST ACTION] Final content includes image fields:', imageCheckInFinal);
    if (!imageCheckInFinal && (postData.imageIds?.length > 0 || postData.imageId)) {
      console.error('[UPDATE POST ACTION] ERROR: Images were in postData but not in final content!');
      console.log('[UPDATE POST ACTION] Final content snippet around post:', finalContent.substring(match.index! + match[0].length, match.index! + match[0].length + 1000));
    }

    await fs.writeFile(filePath, finalContent, 'utf-8');
    console.log('[UPDATE POST ACTION] File written successfully');

    revalidatePath('/');
    revalidatePath('/[category]', 'layout');
    revalidatePath('/[category]/[slug]', 'layout');
    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating post:', error);
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updatePostOrderAction(postId: string, newOrder: number) {
  try {
    // Import POSTS to get current state
    const { POSTS } = await import('@/lib/data');
    
    // Find the post being updated
    const postToUpdate = POSTS.find(p => p.id === postId);
    if (!postToUpdate) {
      throw new Error(`Post with id ${postId} not found`);
    }
    
    const oldOrder = postToUpdate.order ?? POSTS.findIndex(p => p.id === postId) + 1;
    
    // Update all posts' orders based on the change
    const updatedPosts = POSTS.map(post => {
      const currentOrder = post.order ?? POSTS.findIndex(p => p.id === post.id) + 1;
      
      if (post.id === postId) {
        // Update the target post's order
        return { ...post, order: newOrder };
      } else if (oldOrder < newOrder) {
        // Moving down: shift posts between oldOrder and newOrder up
        if (currentOrder > oldOrder && currentOrder <= newOrder) {
          return { ...post, order: currentOrder - 1 };
        }
      } else if (oldOrder > newOrder) {
        // Moving up: shift posts between newOrder and oldOrder down
        if (currentOrder >= newOrder && currentOrder < oldOrder) {
          return { ...post, order: currentOrder + 1 };
        }
      }
      return post;
    });
    
    // Preserve createdAt sequence by reassigning timestamps to new positions
    const byCurrentOrder = POSTS
      .map((p, index) => ({ ...p, _order: p.order ?? index + 1 }))
      .sort((a, b) => (a._order as number) - (b._order as number));
    const originalTimes = byCurrentOrder.map(p => p.createdAt || new Date(0).toISOString());

    const newOrdered = [...updatedPosts]
      .map((p, index) => ({ ...p, _order: p.order ?? index + 1 }))
      .sort((a, b) => (a._order as number) - (b._order as number));
    const reassigned = newOrdered.map((p, i) => ({ ...p, createdAt: originalTimes[i] }));
    
    // Update data.ts file
    const filePath = path.join(process.cwd(), 'src/lib/data.ts');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const postsRegex = /export const POSTS: Post\[] = \[/;
    const match = fileContent.match(postsRegex);
    if (!match) throw new Error('Could not find the POSTS array in data.ts');
    
    const beforePosts = fileContent.substring(0, match.index! + match[0].length);
    const afterPosts = fileContent.substring(match.index! + match[0].length);
    
    // Update each post's order and createdAt fields
    let updatedAfterPosts = afterPosts;
    for (const post of reassigned) {
      const postIdRegex = new RegExp(`id:\\s*['"]${post.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'i');
      const postMatch = updatedAfterPosts.match(postIdRegex);
      if (!postMatch) continue;
      
      let postStart = postMatch.index!;
      let braceCount = 0;
      let inString = false;
      let stringChar = '';
      let i = postStart;
      
      // Find the opening brace
      while (i > 0 && updatedAfterPosts[i] !== '{') i--;
      postStart = i;
      braceCount = 1;
      i++;
      
      // Find the closing brace
      while (i < updatedAfterPosts.length && braceCount > 0) {
        const char = updatedAfterPosts[i];
        if ((char === '"' || char === "'") && (i === 0 || updatedAfterPosts[i-1] !== '\\')) {
          if (!inString) {
            inString = true;
            stringChar = char;
          } else if (char === stringChar) {
            inString = false;
          }
        } else if (!inString) {
          if (char === '{') braceCount++;
          else if (char === '}') braceCount--;
        }
        i++;
      }
      const postEnd = i;
      const postBlock = updatedAfterPosts.substring(postStart, postEnd);
      
      // Update or add order field
      let updatedPostBlock = postBlock;
      const orderRegex = /order:\s*\d+/;
      if (orderRegex.test(postBlock)) {
        updatedPostBlock = postBlock.replace(orderRegex, `order: ${post.order}`);
      } else {
        // Find the last property before closing brace
        const lastPropMatch = postBlock.match(/([^,}]+)(\s*)(\})/);
        if (lastPropMatch) {
          const insertPos = lastPropMatch.index! + lastPropMatch[1].length;
          const needsComma = !postBlock.substring(0, insertPos).trim().endsWith(',');
          updatedPostBlock = postBlock.substring(0, insertPos) + 
            (needsComma ? ',' : '') + 
            `\n    order: ${post.order}` + 
            postBlock.substring(insertPos);
        }
      }

      // Update createdAt to keep chronological order consistent with new positions
      const createdAtRegex = /createdAt:\s*['"][^'"]+['"]/;
      const safeCreatedAt = (post.createdAt || '').replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/\n/g, '');
      if (createdAtRegex.test(updatedPostBlock)) {
        updatedPostBlock = updatedPostBlock.replace(createdAtRegex, `createdAt: '${safeCreatedAt}'`);
      } else {
        // Insert createdAt if missing (rare)
        const insertAfterTitle = updatedPostBlock.indexOf("slug:") > -1 ? updatedPostBlock.indexOf("slug:") : updatedPostBlock.indexOf("title:");
        if (insertAfterTitle > -1) {
          const bracePos = updatedPostBlock.indexOf(',', insertAfterTitle);
          if (bracePos > -1) {
            updatedPostBlock = updatedPostBlock.slice(0, bracePos + 1) + `\n    createdAt: '${safeCreatedAt}',` + updatedPostBlock.slice(bracePos + 1);
          }
        }
      }
      
      updatedAfterPosts = updatedAfterPosts.substring(0, postStart) + updatedPostBlock + updatedAfterPosts.substring(postEnd);
    }
    
    const finalContent = beforePosts + updatedAfterPosts;
    await fs.writeFile(filePath, finalContent, 'utf-8');
    
    revalidatePath('/');
    revalidatePath('/[category]', 'layout');
    revalidatePath('/[category]/[slug]', 'layout');
    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error updating post order:', error);
    if (error instanceof Error) return { success: false, error: error.message };
    return { success: false, error: 'An unknown error occurred' };
  }
}

// Swap createdAt between two posts (simpler ordering by date)
export async function swapPostDatesAction(postIdA: string, postIdB: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/data.ts');
    const fileContent = await fs.readFile(filePath, 'utf-8');

    const postsRegex = /export const POSTS: Post\[] = \[/;
    const match = fileContent.match(postsRegex);
    if (!match) throw new Error('Could not find the POSTS array in data.ts');

    const beforePosts = fileContent.substring(0, match.index! + match[0].length);
    let afterPosts = fileContent.substring(match.index! + match[0].length);

    const getPostBlock = (source: string, postId: string) => {
      const idRegex = new RegExp(`id:\\s*['"]${postId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'i');
      const m = source.match(idRegex);
      if (!m) return null;
      let i = m.index!;
      while (i > 0 && source[i] !== '{') i--;
      let start = i, depth = 1; i++;
      let inStr = false; let sc = '';
      while (i < source.length && depth > 0) {
        const ch = source[i];
        if ((ch === '"' || ch === "'") && source[i - 1] !== '\\') {
          if (!inStr) { inStr = true; sc = ch; } else if (sc === ch) { inStr = false; }
        } else if (!inStr) {
          if (ch === '{') depth++; else if (ch === '}') depth--;
        }
        i++;
      }
      const end = i;
      const block = source.substring(start, end);
      return { start, end, block };
    };

    const A = getPostBlock(afterPosts, postIdA);
    const B = getPostBlock(afterPosts, postIdB);
    if (!A || !B) throw new Error('Post blocks not found for swap');

    const readDate = (block: string) => {
      const m = block.match(/createdAt:\s*['"]([^'"]+)['"]/);
      return m ? m[1] : '';
    };
    const dateA = readDate(A.block);
    const dateB = readDate(B.block);
    if (!dateA || !dateB) throw new Error('createdAt not found on one of the posts');

    const replaceDate = (block: string, newIso: string) => {
      if (block.match(/createdAt:\s*['"]/)) {
        return block.replace(/createdAt:\s*['"][^'"]+['"]/, `createdAt: '${newIso}'`);
      }
      // insert after slug if missing
      const slugIdx = block.indexOf('slug:');
      if (slugIdx > -1) {
        const comma = block.indexOf(',', slugIdx);
        if (comma > -1) {
          return block.slice(0, comma + 1) + `\n    createdAt: '${newIso}',` + block.slice(comma + 1);
        }
      }
      return block; // fallback no-op
    };

    // Ensure valid ISO strings
    const isoA = new Date(dateA).toISOString();
    const isoB = new Date(dateB).toISOString();

    // Replace blocks (do later index-safe rebuild)
    const firstStart = Math.min(A.start, B.start);
    const firstEnd = Math.max(A.end, B.end);
    const firstBlock = afterPosts.substring(firstStart, firstEnd);

    const newSub = (() => {
      // We need to operate on subrange to avoid index shifts
      const aLocalStart = A.start - firstStart;
      const aLocalEnd = A.end - firstStart;
      const bLocalStart = B.start - firstStart;
      const bLocalEnd = B.end - firstStart;
      let sub = firstBlock;
      // Replace larger index first
      if (aLocalStart > bLocalStart) {
        const newABlock = replaceDate(sub.substring(aLocalStart, aLocalEnd), isoB);
        sub = sub.substring(0, aLocalStart) + newABlock + sub.substring(aLocalEnd);
        const newBBlock = replaceDate(sub.substring(bLocalStart, bLocalEnd), isoA);
        sub = sub.substring(0, bLocalStart) + newBBlock + sub.substring(bLocalEnd);
      } else {
        const newBBlock = replaceDate(sub.substring(bLocalStart, bLocalEnd), isoA);
        sub = sub.substring(0, bLocalStart) + newBBlock + sub.substring(bLocalEnd);
        const newABlock = replaceDate(sub.substring(aLocalStart, aLocalEnd), isoB);
        sub = sub.substring(0, aLocalStart) + newABlock + sub.substring(aLocalEnd);
      }
      return sub;
    })();

    afterPosts = afterPosts.substring(0, firstStart) + newSub + afterPosts.substring(firstEnd);
    const finalContent = beforePosts + afterPosts;

    await fs.writeFile(filePath, finalContent, 'utf-8');
    revalidatePath('/');
    revalidatePath('/admin/posts');
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    console.error('Error swapping post dates:', e);
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' };
  }
}

// ===== Menu Global Config =====
export async function getMenuGlobalConfigAction(): Promise<MenuGlobalConfig> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/menu-config.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(content);
    return {
      categoryPagePostCount: Number(json.categoryPagePostCount || 12),
    };
  } catch {
    return { categoryPagePostCount: 12 };
  }
}

export async function updateMenuGlobalConfigAction(config: Partial<MenuGlobalConfig>): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/menu-config.json');
    let current: MenuGlobalConfig = { categoryPagePostCount: 12 };
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      current = JSON.parse(content);
    } catch {}
    const next: MenuGlobalConfig = {
      categoryPagePostCount: typeof config.categoryPagePostCount === 'number' && config.categoryPagePostCount > 0
        ? Math.floor(config.categoryPagePostCount)
        : current.categoryPagePostCount,
    };
    await fs.writeFile(filePath, JSON.stringify(next, null, 2), 'utf-8');
    revalidatePath('/[category]');
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Config yazılamadı' };
  }
}

export async function deletePostAction(postId: string) {
    try {
        // First, find the post in POSTS array to save it to trash
        const { POSTS } = await import('@/lib/data');
        const postToDelete = POSTS.find(p => p.id === postId);
        
        if (!postToDelete) {
            return { success: false, error: 'Gönderi bulunamadı' };
        }

        // Move to trash (deleted-posts.json)
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-posts.json');
        let deletedPosts: Post[] = [];
        
        try {
            const deletedContent = await fs.readFile(deletedFilePath, 'utf-8');
            deletedPosts = JSON.parse(deletedContent);
        } catch {
            // File doesn't exist, create empty array
        }

        // Add deletion timestamp
        const deletedPost: Post & { deletedAt: string } = {
            ...postToDelete,
            deletedAt: new Date().toISOString()
        } as Post & { deletedAt: string };

        deletedPosts.push(deletedPost);
        await fs.writeFile(deletedFilePath, JSON.stringify(deletedPosts, null, 2), 'utf-8');

        // Now remove from data.ts
        const filePath = path.join(process.cwd(), 'src/lib/data.ts');
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // Find and remove the post from the array
        // Pattern to match a complete post object
        const postPattern = new RegExp(
            `\\{[^}]*id:\\s*['"]${postId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][\\s\\S]*?\\},?`,
            'g'
        );

        // More robust pattern: find post by ID and remove the entire post object
        const postsRegex = /export const POSTS: Post\[] = \[/;
        const match = fileContent.match(postsRegex);

        if (!match) {
            throw new Error("Could not find the POSTS array in data.ts");
        }

        // Split content after POSTS declaration
        const beforePosts = fileContent.substring(0, match.index! + match[0].length);
        const afterPosts = fileContent.substring(match.index! + match[0].length);

        // Find the post with matching ID
        const postIdRegex = new RegExp(
            `id:\\s*['"]${postId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
            'g'
        );

        // Find the start of this post (look backwards from the ID match)
        let newContent = afterPosts;
        const idMatch = afterPosts.match(postIdRegex);
        
        if (!idMatch) {
            return { success: false, error: 'Gönderi bulunamadı' };
        }

        // Find the start of the post object (look for the opening brace before the ID)
        const idIndex = afterPosts.indexOf(idMatch[0]);
        let postStart = idIndex;
        
        // Go backwards to find the opening brace
        while (postStart > 0 && afterPosts[postStart] !== '{') {
            postStart--;
        }
        
        if (postStart === 0 && afterPosts[postStart] !== '{') {
            // Fallback: remove from id to next closing brace and comma
            const fromId = afterPosts.indexOf(idMatch[0]);
            let postEnd = fromId;
            let braceCount = 0;
            let inString = false;
            let stringChar = '';

            // Find the end of this post object
            for (let i = fromId; i < afterPosts.length; i++) {
                const char = afterPosts[i];
                
                if ((char === '"' || char === "'" || char === '`') && afterPosts[i - 1] !== '\\') {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                    } else if (char === stringChar) {
                        inString = false;
                        stringChar = '';
                    }
                }
                
                if (!inString) {
                    if (char === '{') braceCount++;
                    if (char === '}') {
                        braceCount--;
                        if (braceCount === 0) {
                            // Check if next character is comma
                            let nextIndex = i + 1;
                            while (nextIndex < afterPosts.length && /\s/.test(afterPosts[nextIndex])) {
                                nextIndex++;
                            }
                            if (afterPosts[nextIndex] === ',') {
                                postEnd = nextIndex + 1;
                            } else {
                                postEnd = i + 1;
                            }
                            break;
                        }
                    }
                }
            }

            // Remove the post (including leading/trailing whitespace)
            let removeStart = postStart;
            while (removeStart > 0 && /\s/.test(afterPosts[removeStart - 1])) {
                removeStart--;
            }
            
            newContent = afterPosts.substring(0, removeStart) + 
                        afterPosts.substring(postEnd).replace(/^\s+/, '');
        } else {
            // Remove from opening brace to closing brace + comma
            let postEnd = postStart + 1;
            let braceCount = 1;
            let inString = false;
            let stringChar = '';

            for (let i = postStart + 1; i < afterPosts.length; i++) {
                const char = afterPosts[i];
                
                if ((char === '"' || char === "'" || char === '`') && afterPosts[i - 1] !== '\\') {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                    } else if (char === stringChar) {
                        inString = false;
                        stringChar = '';
                    }
                }
                
                if (!inString) {
                    if (char === '{') braceCount++;
                    if (char === '}') {
                        braceCount--;
                        if (braceCount === 0) {
                            // Check for comma after closing brace
                            let nextIndex = i + 1;
                            while (nextIndex < afterPosts.length && /\s/.test(afterPosts[nextIndex])) {
                                nextIndex++;
                            }
                            if (afterPosts[nextIndex] === ',') {
                                postEnd = nextIndex + 1;
                            } else {
                                postEnd = i + 1;
                            }
                            break;
                        }
                    }
                }
            }

            // Remove leading whitespace/newlines before this post
            let removeStart = postStart;
            while (removeStart > 0 && /\s/.test(afterPosts[removeStart - 1])) {
                removeStart--;
            }
            
            newContent = afterPosts.substring(0, removeStart) + 
                        afterPosts.substring(postEnd).replace(/^\s+/, '');
        }

        const finalContent = beforePosts + newContent;

        await fs.writeFile(filePath, finalContent, 'utf-8');

        // Revalidate all relevant paths
        revalidatePath('/');
        revalidatePath('/[category]', 'layout');
        revalidatePath('/[category]/[slug]', 'layout');
        revalidatePath('/admin/posts');
        revalidatePath('/admin');

        return { success: true, message: 'Gönderi çöp kutusuna taşındı' };
    } catch (error) {
        console.error('Error deleting post:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Restore post from trash
export async function restorePostAction(postId: string) {
    try {
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-posts.json');
        const deletedContent = await fs.readFile(deletedFilePath, 'utf-8');
        const deletedPosts = JSON.parse(deletedContent) as (Post & { deletedAt: string })[];
        
        const postToRestore = deletedPosts.find(p => p.id === postId);
        if (!postToRestore) {
            return { success: false, error: 'Gönderi çöp kutusunda bulunamadı' };
        }

        // Remove deletedAt property
        const { deletedAt, ...postData } = postToRestore;

        // Add back to data.ts using createPostAction logic
        const filePath = path.join(process.cwd(), 'src/lib/data.ts');
        const fileContent = await fs.readFile(filePath, 'utf-8');

        const postsRegex = /export const POSTS: Post\[] = \[/;
        const match = fileContent.match(postsRegex);

        if (!match) {
            throw new Error("Could not find the POSTS array in data.ts");
        }

        // Escape content
        const escapedMeal = escapeForTemplateLiteral(postData.content.meal);
        const escapedMealleri = escapeForSingleQuote(postData.content.mealleri || '');
        const escapedTefsir = escapeForSingleQuote(postData.content.tefsir || '');
        const escapedKisaTefsir = escapeForSingleQuote(postData.content.kisaTefsir || '');
        const escapedTitle = escapeForSingleQuote(postData.title);
        const escapedSlug = escapeForSingleQuote(postData.slug);
        const escapedCreatedAt = escapeForSingleQuote(postData.createdAt);
        const escapedCategory = escapeForSingleQuote(postData.category);
        const escapedPostId = escapeForSingleQuote(postData.id);

        // Handle image IDs
        let imageIdPart = '';
        if (postData.imageIds && postData.imageIds.length > 0) {
            const escapedImageIds = postData.imageIds.map(id => `'${escapeForSingleQuote(id)}'`).join(', ');
            imageIdPart = `\n    imageIds: [${escapedImageIds}],`;
            if (postData.imageIds.length === 1) {
                imageIdPart += `\n    imageId: '${escapeForSingleQuote(postData.imageIds[0])}',`;
            }
        } else if (postData.imageId) {
            imageIdPart = `\n    imageId: '${escapeForSingleQuote(postData.imageId)}',`;
        }

        // Handle YouTube video IDs
        let youtubeVideoIdPart = '';
        if (postData.youtubeVideoIds && postData.youtubeVideoIds.length > 0) {
            const escapedYoutubeVideoIds = postData.youtubeVideoIds.map(id => `'${escapeForSingleQuote(id)}'`).join(', ');
            youtubeVideoIdPart = `\n    youtubeVideoIds: [${escapedYoutubeVideoIds}],`;
            if (postData.youtubeVideoIds.length === 1) {
                youtubeVideoIdPart += `\n    youtubeVideoId: '${escapeForSingleQuote(postData.youtubeVideoIds[0])}',`;
            }
        } else if (postData.youtubeVideoId) {
            youtubeVideoIdPart = `\n    youtubeVideoId: '${escapeForSingleQuote(postData.youtubeVideoId)}',`;
        }

        const customMessagePart = postData.customMessage 
            ? `,\n    customMessage: "${postData.customMessage.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`
            : '';

        const statusPart = postData.status 
            ? `,\n    status: '${postData.status}'`
            : '';

        // SEO alanları
        let seoPart = '';
        if (postData.seo) {
          const metaTitlePart = postData.seo.metaTitle 
            ? `metaTitle: '${escapeForSingleQuote(postData.seo.metaTitle)}',`
            : '';
          const metaDescriptionPart = postData.seo.metaDescription 
            ? `metaDescription: '${escapeForSingleQuote(postData.seo.metaDescription)}',`
            : '';
          const keywordsPart = postData.seo.keywords && postData.seo.keywords.length > 0
            ? `keywords: [${postData.seo.keywords.map(k => `'${escapeForSingleQuote(k)}'`).join(', ')}],`
            : '';
          const ogImagePart = postData.seo.ogImage
            ? `ogImage: '${escapeForSingleQuote(postData.seo.ogImage)}',`
            : '';
          
          if (metaTitlePart || metaDescriptionPart || keywordsPart || ogImagePart) {
            seoPart = `,\n    seo: {\n      ${metaTitlePart ? metaTitlePart + '\n      ' : ''}${metaDescriptionPart ? metaDescriptionPart + '\n      ' : ''}${keywordsPart ? keywordsPart + '\n      ' : ''}${ogImagePart ? ogImagePart + '\n      ' : ''}\n    }`.replace(/,\n    \n    /g, ',\n    ').replace(/,\n    \}$/, '\n    }');
          }
        }

        const newPostString = `
  {
    id: '${escapedPostId}',
    title: '${escapedTitle}',
    slug: '${escapedSlug}',
    category: '${escapedCategory}',${imageIdPart}
    content: {
      meal: \`${escapedMeal}\`,
      mealleri: '${escapedMealleri}',
      tefsir: '${escapedTefsir}',
      kisaTefsir: '${escapedKisaTefsir}',
    },${youtubeVideoIdPart}
    createdAt: '${escapedCreatedAt}'${customMessagePart}${statusPart}${seoPart}
  },`;

        const newFileContent = fileContent.replace(postsRegex, `export const POSTS: Post[] = [${newPostString}`);
        await fs.writeFile(filePath, newFileContent, 'utf-8');

        // Remove from deleted posts
        const updatedDeletedPosts = deletedPosts.filter(p => p.id !== postId);
        await fs.writeFile(deletedFilePath, JSON.stringify(updatedDeletedPosts, null, 2), 'utf-8');

        revalidatePath('/');
        revalidatePath('/[category]', 'layout');
        revalidatePath('/[category]/[slug]', 'layout');
        revalidatePath('/admin/posts');

        return { success: true, post: postData };
    } catch (error) {
        console.error('Error restoring post:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Permanently delete post from trash
export async function permanentlyDeletePostAction(postId: string) {
    try {
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-posts.json');
        const deletedContent = await fs.readFile(deletedFilePath, 'utf-8');
        const deletedPosts = JSON.parse(deletedContent) as (Post & { deletedAt: string })[];
        
        const updatedDeletedPosts = deletedPosts.filter(p => p.id !== postId);
        await fs.writeFile(deletedFilePath, JSON.stringify(updatedDeletedPosts, null, 2), 'utf-8');

        revalidatePath('/admin/posts');

        return { success: true };
    } catch (error) {
        console.error('Error permanently deleting post:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Get deleted posts
export async function getDeletedPostsAction(): Promise<(Post & { deletedAt: string })[]> {
    try {
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-posts.json');
        const deletedContent = await fs.readFile(deletedFilePath, 'utf-8');
        return JSON.parse(deletedContent);
    } catch {
        return [];
    }
}

// Empty all deleted posts (admin)
export async function emptyDeletedPostsAction(): Promise<{ success: boolean; error?: string }> {
    try {
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-posts.json');
        await fs.writeFile(deletedFilePath, JSON.stringify([], null, 2), 'utf-8');
        revalidatePath('/admin/posts');
        return { success: true };
    } catch (error) {
        console.error('Error emptying deleted posts:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Restore image from trash
export async function restoreImageAction(imageId: string) {
    try {
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-images.json');
        const deletedContent = await fs.readFile(deletedFilePath, 'utf-8');
        const deletedImages = JSON.parse(deletedContent) as (ImagePlaceholder & { deletedAt: string })[];
        
        const imageToRestore = deletedImages.find(img => img.id === imageId);
        if (!imageToRestore) {
            return { success: false, error: 'Görsel çöp kutusunda bulunamadı' };
        }

        // Remove deletedAt property
        const { deletedAt, ...imageData } = imageToRestore;

        // Add back to placeholder-images.json
        const filePath = path.join(process.cwd(), 'src/lib/placeholder-images.json');
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        if (!data.placeholderImages || !Array.isArray(data.placeholderImages)) {
            data.placeholderImages = [];
        }

        data.placeholderImages.unshift(imageData);

        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

        // Remove from deleted images
        const updatedDeletedImages = deletedImages.filter(img => img.id !== imageId);
        await fs.writeFile(deletedFilePath, JSON.stringify(updatedDeletedImages, null, 2), 'utf-8');

        revalidatePath('/admin/media');
        revalidatePath('/admin/posts/new');

        return { success: true, image: imageData };
    } catch (error) {
        console.error('Error restoring image:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Permanently delete image from trash
export async function permanentlyDeleteImageAction(imageId: string) {
    try {
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-images.json');
        const deletedContent = await fs.readFile(deletedFilePath, 'utf-8');
        const deletedImages = JSON.parse(deletedContent) as (ImagePlaceholder & { deletedAt: string })[];
        
        const updatedDeletedImages = deletedImages.filter(img => img.id !== imageId);
        await fs.writeFile(deletedFilePath, JSON.stringify(updatedDeletedImages, null, 2), 'utf-8');

        revalidatePath('/admin/media');

        return { success: true };
    } catch (error) {
        console.error('Error permanently deleting image:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Get deleted images
export async function getDeletedImagesAction(): Promise<(ImagePlaceholder & { deletedAt: string })[]> {
    try {
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-images.json');
        const deletedContent = await fs.readFile(deletedFilePath, 'utf-8');
        return JSON.parse(deletedContent);
    } catch {
        return [];
    }
}

// Empty all deleted images (admin)
export async function emptyDeletedImagesAction(): Promise<{ success: boolean; error?: string }> {
    try {
        const deletedFilePath = path.join(process.cwd(), 'src/lib/deleted-images.json');
        await fs.writeFile(deletedFilePath, JSON.stringify([], null, 2), 'utf-8');
        revalidatePath('/admin/media');
        return { success: true };
    } catch (error) {
        console.error('Error emptying deleted images:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Update post status
export async function updatePostStatusAction(postId: string, status: 'published' | 'draft') {
    try {
        const filePath = path.join(process.cwd(), 'src/lib/data.ts');
        const fileContent = await fs.readFile(filePath, 'utf-8');

        // Find the post with matching ID
        const postIdRegex = new RegExp(
            `id:\\s*['"]${postId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
            'g'
        );

        const idMatch = fileContent.match(postIdRegex);
        
        if (!idMatch) {
            return { success: false, error: 'Gönderi bulunamadı' };
        }

        // Find the post object boundaries
        const idIndex = fileContent.indexOf(idMatch[0]);
        
        // Look for the end of the post object (closing brace)
        let postEnd = idIndex;
        let braceCount = 0;
        let inString = false;
        let stringChar = '';
        let postStart = idIndex;

        // Find the start of the post object (opening brace before the ID)
        for (let i = idIndex; i >= 0; i--) {
            if (fileContent[i] === '{' && !inString) {
                postStart = i;
                braceCount = 1;
                break;
            }
            if ((fileContent[i] === '"' || fileContent[i] === "'" || fileContent[i] === '`') && (i === 0 || fileContent[i - 1] !== '\\')) {
                if (!inString) {
                    inString = true;
                    stringChar = fileContent[i];
                } else if (fileContent[i] === stringChar) {
                    inString = false;
                    stringChar = '';
                }
            }
        }

        // Find the end of the post object
        for (let i = postStart + 1; i < fileContent.length; i++) {
            const char = fileContent[i];
            
            if ((char === '"' || char === "'" || char === '`') && (i === 0 || fileContent[i - 1] !== '\\')) {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
            }
            
            if (!inString) {
                if (char === '{') braceCount++;
                if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                        // Check for comma after closing brace
                        let nextIndex = i + 1;
                        while (nextIndex < fileContent.length && /\s/.test(fileContent[nextIndex])) {
                            nextIndex++;
                        }
                        if (fileContent[nextIndex] === ',') {
                            postEnd = nextIndex + 1;
                        } else {
                            postEnd = i + 1;
                        }
                        break;
                    }
                }
            }
        }

        // Extract the post object
        const postObjectString = fileContent.substring(postStart, postEnd);
        
        // Check if status already exists in the post
        const statusRegex = /status:\s*['"](published|draft)['"]/;
        const hasStatus = statusRegex.test(postObjectString);
        
        let updatedPostString;
        if (hasStatus) {
            // Replace existing status
            updatedPostString = postObjectString.replace(statusRegex, `status: '${status}'`);
        } else {
            // Add status before the closing brace (but after the last property)
            // Find the last property before closing brace
            const beforeClosing = postObjectString.match(/(.+)\s*}\s*,?$/);
            if (beforeClosing) {
                const content = beforeClosing[1].trim();
                // Add status after the last comma or newline
                updatedPostString = content + `,\n    status: '${status}'\n  },`;
            } else {
                updatedPostString = postObjectString.replace(/\s*}\s*$/, `,\n    status: '${status}'\n  },`);
            }
        }

        // Replace the post object in the file
        const newFileContent = fileContent.substring(0, postStart) + updatedPostString + fileContent.substring(postEnd);

        await fs.writeFile(filePath, newFileContent, 'utf-8');

        revalidatePath('/');
        revalidatePath('/[category]', 'layout');
        revalidatePath('/[category]/[slug]', 'layout');
        revalidatePath('/admin/posts');

        return { success: true };
    } catch (error) {
        console.error('Error updating post status:', error);
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: 'An unknown error occurred' };
    }
}

// Generate SEO keywords using AI
export async function generateSEOKeywordsAction(title: string, content: string, category: string) {
    try {
        const result = await generateSEOKeywords({
            title,
            content,
            category,
        });
        // Fallback kullanıldıysa bile başarılı say (fallback her zaman sonuç döner)
        return { success: true, ...result };
    } catch (error) {
        console.error('Error generating SEO keywords:', error);
        
        // Daha açıklayıcı hata mesajları
        if (error instanceof Error) {
            let errorMessage = error.message;
            
            // API hatalarını Türkçe'ye çevir
            if (error.message.includes('503') || error.message.includes('overloaded') || error.message.includes('Service Unavailable')) {
                errorMessage = 'AI servisi şu anda yoğun. Otomatik SEO önerileri oluşturuldu.';
            } else if (error.message.includes('rate limit') || error.message.includes('429')) {
                errorMessage = 'Çok fazla istek gönderildi. Otomatik SEO önerileri oluşturuldu.';
            } else if (error.message.includes('401') || error.message.includes('403')) {
                errorMessage = 'API anahtarı geçersiz veya yetki yok. Otomatik SEO önerileri oluşturuldu.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'İnternet bağlantısı hatası. Otomatik SEO önerileri oluşturuldu.';
            }
            
            // Fallback SEO oluştur (basit bir versiyonu)
            const fallbackTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
            const fallbackDescription = content.substring(0, 130).replace(/\n/g, ' ').trim() + '...';
            const fallbackKeywords = [
                ...title.split(/\s+/).filter(w => w.length > 3).map(w => w.toLowerCase()),
                category.toLowerCase(),
                'cuma mesajları',
                'islami içerik'
            ].slice(0, 15);
            
            return { 
                success: true, 
                metaTitle: fallbackTitle,
                metaDescription: fallbackDescription,
                keywords: fallbackKeywords,
                suggestions: [],
                error: errorMessage 
            };
        }
        
        // Genel hata durumu için de fallback
        const fallbackTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
        const fallbackDescription = content.substring(0, 130).replace(/\n/g, ' ').trim() + '...';
        const fallbackKeywords = [
            ...title.split(/\s+/).filter(w => w.length > 3).map(w => w.toLowerCase()),
            category.toLowerCase(),
            'cuma mesajları',
            'islami içerik'
        ].slice(0, 15);
        
        return { 
            success: true, 
            metaTitle: fallbackTitle,
            metaDescription: fallbackDescription,
            keywords: fallbackKeywords,
            suggestions: [],
            error: 'Anahtar kelime üretilirken bir hata oluştu. Otomatik SEO önerileri oluşturuldu.' 
        };
    }
}

export async function addCommentAction(newComment: Comment) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/comments.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const comments: Comment[] = JSON.parse(fileContent);

    comments.unshift(newComment);

    await fs.writeFile(filePath, JSON.stringify(comments, null, 2));

    revalidatePath('/[category]/[slug]');

    return { success: true, comment: newComment };
  } catch (error) {
    console.error('Error adding comment:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteCommentAction(commentId: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/comments.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    let comments: Comment[] = JSON.parse(fileContent);

    comments = comments.filter(comment => comment.id !== commentId);

    await fs.writeFile(filePath, JSON.stringify(comments, null, 2));

    revalidatePath('/[category]/[slug]');

    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updateCommentAction(commentId: string, newText: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/comments.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    let comments: Comment[] = JSON.parse(fileContent);

    const commentIndex = comments.findIndex(comment => comment.id === commentId);

    if (commentIndex === -1) {
      return { success: false, error: 'Yorum bulunamadı.' };
    }

    comments[commentIndex].text = newText;

    await fs.writeFile(filePath, JSON.stringify(comments, null, 2));

    revalidatePath('/[category]/[slug]');

    return { success: true, comment: comments[commentIndex] };
  } catch (error) {
    console.error('Error updating comment:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}


export async function updateSocialLinksAction(newLinks: SocialLink[]) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/social-links.json');
    
    await fs.writeFile(filePath, JSON.stringify(newLinks, null, 2));

    revalidatePath('/', 'layout');

    return { success: true, links: newLinks };
  } catch (error) {
    console.error('Error updating social links:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function addVisitorMessageAction(newMessage: VisitorMessage) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/visitor-messages.json');
    
    let messages: VisitorMessage[] = [];
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      messages = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist, create new array
      messages = [];
    }

    messages.unshift(newMessage);

    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));

    revalidatePath('/');
    revalidatePath('/admin/messages');

    return { success: true, message: newMessage };
  } catch (error) {
    console.error('Error adding visitor message:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getVisitorMessagesAction(): Promise<VisitorMessage[]> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/visitor-messages.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // File doesn't exist, return empty array
    return [];
  }
}

export async function deleteVisitorMessageAction(messageId: string) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/visitor-messages.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    let messages: VisitorMessage[] = JSON.parse(fileContent);

    messages = messages.filter(message => message.id !== messageId);

    await fs.writeFile(filePath, JSON.stringify(messages, null, 2));

    revalidatePath('/admin/messages');

    return { success: true };
  } catch (error) {
    console.error('Error deleting visitor message:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getCommentsAction(): Promise<Comment[]> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/comments.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // File doesn't exist, return empty array
    return [];
  }
}

export async function updateShareLinksAction(newLinks: SharePlatform[]) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/share-links.json');
    await fs.writeFile(filePath, JSON.stringify(newLinks, null, 2));
    revalidatePath('/[category]/[slug]');
    return { success: true };
  } catch (error) {
    console.error('Error updating share links:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updateHomepageSectionsAction(sections: HomepageSections) {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/homepage-sections.json');
    await fs.writeFile(filePath, JSON.stringify(sections, null, 2), 'utf-8');
    
    revalidatePath('/');
    revalidatePath('/admin/homepage');
    
    return { success: true, sections };
  } catch (error) {
    console.error('Error updating homepage sections:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getCustomMenusAction(): Promise<CustomMenu[]> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/custom-menus.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const menus = JSON.parse(fileContent) as CustomMenu[];
    return menus.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error reading custom menus:', error);
    return [];
  }
}

export async function createCustomMenuAction(menu: Omit<CustomMenu, 'id'>): Promise<{ success: boolean; error?: string; menu?: CustomMenu }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/custom-menus.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const menus = JSON.parse(fileContent) as CustomMenu[];
    
    const newMenu: CustomMenu = {
      ...menu,
      id: `menu-${Date.now()}`
    };
    
    menus.push(newMenu);
    await fs.writeFile(filePath, JSON.stringify(menus, null, 2), 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true, menu: newMenu };
  } catch (error) {
    console.error('Error creating custom menu:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updateCustomMenuAction(menuId: string, updates: Partial<Omit<CustomMenu, 'id'>>): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/custom-menus.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const menus = JSON.parse(fileContent) as CustomMenu[];
    
    const index = menus.findIndex(m => m.id === menuId);
    if (index === -1) {
      return { success: false, error: 'Menü bulunamadı' };
    }
    
    menus[index] = { ...menus[index], ...updates };
    await fs.writeFile(filePath, JSON.stringify(menus, null, 2), 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating custom menu:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteCustomMenuAction(menuId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/custom-menus.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const menus = JSON.parse(fileContent) as CustomMenu[];
    
    const filteredMenus = menus.filter(m => m.id !== menuId);
    await fs.writeFile(filePath, JSON.stringify(filteredMenus, null, 2), 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting custom menu:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function getCategorySettingsAction(): Promise<CategorySettings[]> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/category-settings.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const settings = JSON.parse(fileContent) as CategorySettings[];
    return settings.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error reading category settings:', error);
    return [];
  }
}

export async function updateCategorySettingsAction(categoryId: string, updates: Partial<Omit<CategorySettings, 'categoryId'>>): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/category-settings.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const settings = JSON.parse(fileContent) as CategorySettings[];
    
    // Sanitize and coerce order to a valid non-negative integer
    let nextOrder: number | undefined = undefined;
    if (typeof updates.order !== 'undefined') {
      const coerced = typeof updates.order === 'string' ? parseInt(updates.order as unknown as string, 10) : updates.order as number;
      nextOrder = Number.isFinite(coerced) && coerced >= 0 ? coerced : 0;
    }

    const index = settings.findIndex(s => s.categoryId === categoryId);
    if (index === -1) {
      // Create new setting
      settings.push({
        categoryId,
        visible: updates.visible ?? true,
        order: typeof nextOrder === 'number' ? nextOrder : settings.length,
        // persist optional fields if provided on first save
        ...(typeof (updates as any).customTitle !== 'undefined' ? { customTitle: (updates as any).customTitle } : {}),
        ...(typeof (updates as any).customSlug !== 'undefined' ? { customSlug: (updates as any).customSlug } : {}),
      });
    } else {
      // Update existing setting
      settings[index] = {
        ...settings[index],
        ...updates,
        ...(typeof nextOrder === 'number' ? { order: nextOrder } : {}),
      } as CategorySettings;
    }
    
    await fs.writeFile(filePath, JSON.stringify(settings, null, 2), 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating category settings:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function createSocialLinkAction(newLink: Omit<SocialLink, 'active'> & { active?: boolean }): Promise<{ success: boolean; error?: string; link?: SocialLink }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/social-links.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const links = JSON.parse(fileContent) as SocialLink[];
    
    // Check if link with same name already exists
    if (links.some(l => l.name === newLink.name)) {
      return { success: false, error: 'Bu isimde bir sosyal medya linki zaten mevcut.' };
    }
    
    const socialLink: SocialLink = {
      name: newLink.name,
      url: newLink.url || '',
      color: newLink.color,
      active: newLink.active ?? true
    };
    
    links.push(socialLink);
    await fs.writeFile(filePath, JSON.stringify(links, null, 2), 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true, link: socialLink };
  } catch (error) {
    console.error('Error creating social link:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteSocialLinkAction(linkName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/social-links.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const links = JSON.parse(fileContent) as SocialLink[];
    
    const filteredLinks = links.filter(l => l.name !== linkName);
    await fs.writeFile(filePath, JSON.stringify(filteredLinks, null, 2), 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting social link:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function createSharePlatformAction(newPlatform: Omit<SharePlatform, 'active'> & { active?: boolean }): Promise<{ success: boolean; error?: string; platform?: SharePlatform }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/share-links.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const platforms = JSON.parse(fileContent) as SharePlatform[];
    
    // Check if platform with same name already exists
    if (platforms.some(p => p.name === newPlatform.name)) {
      return { success: false, error: 'Bu isimde bir paylaşım platformu zaten mevcut.' };
    }
    
    const sharePlatform: SharePlatform = {
      name: newPlatform.name,
      active: newPlatform.active ?? true
    };
    
    platforms.push(sharePlatform);
    await fs.writeFile(filePath, JSON.stringify(platforms, null, 2), 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true, platform: sharePlatform };
  } catch (error) {
    console.error('Error creating share platform:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteSharePlatformAction(platformName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/share-links.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const platforms = JSON.parse(fileContent) as SharePlatform[];
    
    const filteredPlatforms = platforms.filter(p => p.name !== platformName);
    await fs.writeFile(filePath, JSON.stringify(filteredPlatforms, null, 2), 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting share platform:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

// Helper function to slugify text
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function createSubcategoryAction(parentCategoryId: string, subcategory: { title: string; slug?: string; icon?: string }): Promise<{ success: boolean; error?: string; subcategory?: any }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/data.ts');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Find the parent category with subcategories
    const categoryMatch = fileContent.match(new RegExp(`id:\\s*['"]${parentCategoryId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][\\s\\S]*?subcategories:\\s*\\[`, 's'));
    
    if (!categoryMatch) {
      return { success: false, error: 'Kategori bulunamadı veya alt klasör desteği yok' };
    }
    
    const slug = subcategory.slug || slugify(subcategory.title);
    const icon = subcategory.icon || 'Hand';
    
    // Find existing subcategory IDs to avoid duplicates
    const existingSubIds = (fileContent.match(new RegExp(`id:\\s*['"]${parentCategoryId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[a-z]+['"]`, 'g')) || [])
      .map(m => m.match(/['"]([^'"]+)['"]/)?.[1])
      .filter(Boolean) as string[];
    
    // Generate unique subcategory ID
    let subcategoryId = '';
    let suffix = 'a';
    let attempts = 0;
    while (attempts < 26) {
      const candidate = `${parentCategoryId}${suffix}`;
      if (!existingSubIds.includes(candidate)) {
        subcategoryId = candidate;
        break;
      }
      suffix = String.fromCharCode(suffix.charCodeAt(0) + 1);
      attempts++;
    }
    
    if (!subcategoryId) {
      return { success: false, error: 'Alt klasör ID\'si oluşturulamadı. Tüm harfler kullanılmış olabilir.' };
    }
    
    // Generate subcategory entry
    const escapedTitle = escapeForSingleQuote(subcategory.title);
    const escapedSlug = escapeForSingleQuote(slug);
    const newSubcategoryString = `\n      { id: '${subcategoryId}', title: '${escapedTitle}', slug: '${escapedSlug}', icon: ${icon} },`;
    
    // Find the subcategories array end
    const categoryStartIndex = categoryMatch.index! + categoryMatch[0].length;
    let subcategoriesEnd = categoryStartIndex;
    let braceCount = 0;
    let inString = false;
    let stringChar = '';
    
    for (let i = categoryStartIndex; i < fileContent.length; i++) {
      const char = fileContent[i];
      
      if ((char === '"' || char === "'" || char === '`') && fileContent[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
          stringChar = '';
        }
      }
      
      if (!inString) {
        if (char === '[') braceCount++;
        if (char === ']') {
          braceCount--;
          if (braceCount === 0) {
            subcategoriesEnd = i;
            break;
          }
        }
      }
    }
    
    // Insert new subcategory before closing bracket
    const beforeSubcategories = fileContent.substring(0, subcategoriesEnd);
    const afterSubcategories = fileContent.substring(subcategoriesEnd);
    const newContent = beforeSubcategories + newSubcategoryString + afterSubcategories;
    
    await fs.writeFile(filePath, newContent, 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { 
      success: true, 
      subcategory: { 
        id: subcategoryId, 
        title: subcategory.title, 
        slug: slug, 
        icon: icon 
      } 
    };
  } catch (error) {
    console.error('Error creating subcategory:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function updateSubcategoryAction(parentCategoryId: string, subcategoryId: string, updates: { title?: string; slug?: string; icon?: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/data.ts');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Find the subcategory entry
    const subcategoryPattern = new RegExp(`\\{\\s*id:\\s*['"]${subcategoryId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][\\s\\S]*?\\}`, 's');
    const match = fileContent.match(subcategoryPattern);
    
    if (!match) {
      return { success: false, error: 'Alt klasör bulunamadı' };
    }
    
    // Parse existing subcategory
    const subcategoryString = match[0];
    const titleMatch = subcategoryString.match(/title:\s*['"]([^'"]+)['"]/);
    const slugMatch = subcategoryString.match(/slug:\s*['"]([^'"]+)['"]/);
    const iconMatch = subcategoryString.match(/icon:\s*(\w+)/);
    
    const currentTitle = titleMatch ? titleMatch[1] : '';
    const currentSlug = slugMatch ? slugMatch[1] : '';
    const currentIcon = iconMatch ? iconMatch[1] : 'Hand';
    
    const newTitle = updates.title || currentTitle;
    const newSlug = updates.slug || slugify(newTitle);
    const newIcon = updates.icon || currentIcon;
    
    const escapedTitle = escapeForSingleQuote(newTitle);
    const escapedSlug = escapeForSingleQuote(newSlug);
    const newSubcategoryString = `{ id: '${subcategoryId}', title: '${escapedTitle}', slug: '${escapedSlug}', icon: ${newIcon} }`;
    
    const newContent = fileContent.replace(subcategoryPattern, newSubcategoryString);
    await fs.writeFile(filePath, newContent, 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating subcategory:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteCategoryAction(categoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/data.ts');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Find the category entry in CATEGORIES array
    const escapedCategoryId = categoryId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const categoryPattern = new RegExp(`\\{\\s*id:\\s*['"]${escapedCategoryId}['"][\\s\\S]*?\\}`, 's');
    const match = fileContent.match(categoryPattern);
    
    if (!match) {
      return { success: false, error: 'Kategori bulunamadı' };
    }
    
    const matchIndex = match.index!;
    const matchEnd = matchIndex + match[0].length;
    const afterMatch = fileContent.substring(matchEnd);
    
    // Find start of category (look for newline and spaces before it)
    let catStart = matchIndex;
    while (catStart > 0 && /\s/.test(fileContent[catStart - 1])) {
      catStart--;
    }
    
    // Find end (including comma if exists)
    let catEnd = matchEnd;
    const trimmedAfter = afterMatch.trim();
    if (trimmedAfter.startsWith(',')) {
      // Find the comma and any whitespace after
      let commaEnd = matchEnd + 1;
      while (commaEnd < fileContent.length && /\s/.test(fileContent[commaEnd])) {
        commaEnd++;
      }
      // Also check for newline
      if (fileContent[commaEnd] === '\n') {
        commaEnd++;
      }
      catEnd = commaEnd;
    } else if (trimmedAfter.startsWith('\n')) {
      // Include the newline
      catEnd = matchEnd + 1;
    }
    
    // Remove the category
    const beforeCat = fileContent.substring(0, catStart);
    const afterCat = fileContent.substring(catEnd);
    
    // Clean up any double commas or trailing commas before closing bracket
    let newContent = beforeCat + afterCat;
    newContent = newContent.replace(/,\s*,/g, ','); // Remove double commas
    newContent = newContent.replace(/,\s*\]/g, ']'); // Remove comma before closing bracket
    
    await fs.writeFile(filePath, newContent, 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting category:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

export async function deleteSubcategoryAction(parentCategoryId: string, subcategoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/data.ts');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // Find the subcategory entry within subcategories array
    const escapedSubId = subcategoryId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const subcategoryPattern = new RegExp(`\\{\\s*id:\\s*['"]${escapedSubId}['"][\\s\\S]*?\\}`, 's');
    const match = fileContent.match(subcategoryPattern);
    
    if (!match) {
      return { success: false, error: 'Alt klasör bulunamadı' };
    }
    
    const matchIndex = match.index!;
    const matchEnd = matchIndex + match[0].length;
    const afterMatch = fileContent.substring(matchEnd);
    
    // Find start of subcategory (look for newline and spaces before it)
    let subStart = matchIndex;
    while (subStart > 0 && /\s/.test(fileContent[subStart - 1])) {
      subStart--;
    }
    
    // Find end (including comma if exists)
    let subEnd = matchEnd;
    const trimmedAfter = afterMatch.trim();
    if (trimmedAfter.startsWith(',')) {
      // Find the comma and any whitespace after
      let commaEnd = matchEnd + 1;
      while (commaEnd < fileContent.length && /\s/.test(fileContent[commaEnd])) {
        commaEnd++;
      }
      // Also check for newline
      if (fileContent[commaEnd] === '\n') {
        commaEnd++;
      }
      subEnd = commaEnd;
    } else if (trimmedAfter.startsWith('\n')) {
      // Include the newline
      subEnd = matchEnd + 1;
    }
    
    // Remove the subcategory
    const beforeSub = fileContent.substring(0, subStart);
    const afterSub = fileContent.substring(subEnd);
    
    // Clean up any double commas or trailing commas before closing bracket
    let newContent = beforeSub + afterSub;
    newContent = newContent.replace(/,\s*,/g, ','); // Remove double commas
    newContent = newContent.replace(/,\s*\]/g, ']'); // Remove comma before closing bracket
    
    await fs.writeFile(filePath, newContent, 'utf-8');
    
    revalidatePath('/admin/menus');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

// User Management Actions

// Hash password function
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify password function
function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

// Get all users
export async function getUsersAction(): Promise<User[]> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/users.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const users: User[] = JSON.parse(fileContent);
    // Don't return passwords
    return users.map(({ password, ...user }) => user);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

// Create new user
export async function createUserAction(userData: {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  active?: boolean;
}): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/users.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const users: User[] = JSON.parse(fileContent);

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, error: 'Bu email adresi zaten kullanılıyor.' };
    }

    // Hash password
    const hashedPassword = hashPassword(userData.password);

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      role: userData.role,
      password: hashedPassword,
      active: userData.active ?? true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

    revalidatePath('/admin/users');
    return { success: true, userId: newUser.id };
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Kullanıcı oluşturulurken bir hata oluştu.' };
  }
}

// Update user
export async function updateUserAction(
  userId: string,
  updates: {
    name?: string;
    email?: string;
    role?: UserRole;
    password?: string;
    active?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/users.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const users: User[] = JSON.parse(fileContent);

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return { success: false, error: 'Kullanıcı bulunamadı.' };
    }

    const user = users[userIndex];

    // Check if email already exists (if changed)
    if (updates.email && updates.email.toLowerCase() !== user.email.toLowerCase()) {
      if (users.some(u => u.id !== userId && u.email.toLowerCase() === updates.email!.toLowerCase())) {
        return { success: false, error: 'Bu email adresi zaten kullanılıyor.' };
      }
    }

    // Update user
    if (updates.name) user.name = updates.name;
    if (updates.email) user.email = updates.email.toLowerCase();
    if (updates.role) user.role = updates.role;
    if (updates.password) {
      user.password = hashPassword(updates.password);
    }
    if (updates.active !== undefined) user.active = updates.active;

    await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf-8');

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Kullanıcı güncellenirken bir hata oluştu.' };
  }
}

// Delete user
export async function deleteUserAction(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/users.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const users: User[] = JSON.parse(fileContent);

    const user = users.find(u => u.id === userId);
    if (!user) {
      return { success: false, error: 'Kullanıcı bulunamadı.' };
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = users.filter(u => u.role === 'admin' && u.active).length;
      if (adminCount === 1) {
        return { success: false, error: 'Son admin kullanıcı silinemez.' };
      }
    }

    const filteredUsers = users.filter(u => u.id !== userId);
    await fs.writeFile(filePath, JSON.stringify(filteredUsers, null, 2), 'utf-8');

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Kullanıcı silinirken bir hata oluştu.' };
  }
}

// ==================== Social Media API Actions ====================

export async function getSocialMediaAPIsAction(): Promise<SocialMediaAPI[]> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/social-media-apis.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error reading social media APIs:', error);
    return [];
  }
}

export async function createSocialMediaAPIAction(apiData: Omit<SocialMediaAPI, 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; error?: string; api?: SocialMediaAPI }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/social-media-apis.json');
    let apis: SocialMediaAPI[] = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      apis = JSON.parse(fileContent);
      if (!Array.isArray(apis)) {
        apis = [];
      }
    } catch {
      apis = [];
    }

    // Check if platform already exists
    if (apis.some(api => api.platform.toLowerCase() === apiData.platform.toLowerCase())) {
      return { success: false, error: 'Bu platform için zaten bir API ayarı mevcut.' };
    }

    const newAPI: SocialMediaAPI = {
      ...apiData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    apis.push(newAPI);
    await fs.writeFile(filePath, JSON.stringify(apis, null, 2), 'utf-8');

    revalidatePath('/admin/social-media-apis');
    return { success: true, api: newAPI };
  } catch (error) {
    console.error('Error creating social media API:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'API oluşturulurken bir hata oluştu.' };
  }
}

export async function updateSocialMediaAPIAction(platform: string, updates: Partial<Omit<SocialMediaAPI, 'platform' | 'createdAt'>>): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/social-media-apis.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const apis: SocialMediaAPI[] = JSON.parse(fileContent);

    const apiIndex = apis.findIndex(api => api.platform.toLowerCase() === platform.toLowerCase());
    if (apiIndex === -1) {
      return { success: false, error: 'API bulunamadı.' };
    }

    apis[apiIndex] = {
      ...apis[apiIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await fs.writeFile(filePath, JSON.stringify(apis, null, 2), 'utf-8');

    revalidatePath('/admin/social-media-apis');
    return { success: true };
  } catch (error) {
    console.error('Error updating social media API:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'API güncellenirken bir hata oluştu.' };
  }
}

export async function deleteSocialMediaAPIAction(platform: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/social-media-apis.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const apis: SocialMediaAPI[] = JSON.parse(fileContent);

    const filteredAPIs = apis.filter(api => api.platform.toLowerCase() !== platform.toLowerCase());
    
    if (filteredAPIs.length === apis.length) {
      return { success: false, error: 'API bulunamadı.' };
    }

    await fs.writeFile(filePath, JSON.stringify(filteredAPIs, null, 2), 'utf-8');

    revalidatePath('/admin/social-media-apis');
    return { success: true };
  } catch (error) {
    console.error('Error deleting social media API:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'API silinirken bir hata oluştu.' };
  }
}

// ==================== AI Image Generation Actions ====================

export async function generateAIImageAction(input: {
  prompt: string;
  style?: 'realistic' | 'artistic' | 'minimalist' | 'islamic' | 'modern' | 'classic';
  aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  quality?: 'standard' | 'high';
}): Promise<{ success: boolean; error?: string; imageUrl?: string; imageData?: ImagePlaceholder }> {
  try {
    const result = await generateImage({
      prompt: input.prompt,
      style: input.style,
      aspectRatio: input.aspectRatio || '16:9',
      quality: input.quality || 'standard',
    });

    if (!result.success || !result.imageUrl) {
      return { success: false, error: result.error || 'Görsel oluşturulamadı.' };
    }

    // Create ImagePlaceholder object from generated image
    const imageId = `ai-${Date.now()}`;
    const newImage: ImagePlaceholder = {
      id: imageId,
      imageUrl: result.imageUrl,
      description: input.prompt.substring(0, 100), // First 100 chars as description
      imageHint: `AI-generated image: ${input.prompt}`,
    };

    // Save to media repository
    const uploadResult = await uploadImageAction(newImage);

    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error || 'Görsel kaydedilemedi.' };
    }

    revalidatePath('/admin/media');
    return { 
      success: true, 
      imageUrl: result.imageUrl,
      imageData: newImage,
    };
  } catch (error) {
    console.error('Error generating AI image:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Görsel oluşturulurken bir hata oluştu.' };
  }
}

export async function generateAIImageEditAction(input: {
  sourceDataUri: string;
  prompt: string;
  quality?: 'standard' | 'high';
}): Promise<{ success: boolean; error?: string; imageUrl?: string; imageData?: ImagePlaceholder }> {
  try {
    const result = await generateImageEdit({
      sourceDataUri: input.sourceDataUri,
      prompt: input.prompt,
      quality: input.quality || 'standard',
    });

    if (!result.success || !result.imageUrl) {
      return { success: false, error: result.error || 'Görsel düzenlenemedi.' };
    }

    const imageId = `ai-edit-${Date.now()}`;
    const newImage: ImagePlaceholder = {
      id: imageId,
      imageUrl: result.imageUrl,
      description: input.prompt.substring(0, 100),
      imageHint: `AI-edited image: ${input.prompt}`,
    };

    const uploadResult = await uploadImageAction(newImage);
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error || 'Görsel kaydedilemedi.' };
    }

    revalidatePath('/admin/media');
    return { success: true, imageUrl: result.imageUrl, imageData: newImage };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Bilinmeyen hata' };
  }
}

export async function generateImageCaptionAction(imageId: string): Promise<{ success: boolean; error?: string; image?: ImagePlaceholder }> {
  try {
    const filePath = path.join(process.cwd(), 'src/lib/placeholder-images.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    if (!Array.isArray(data.placeholderImages)) return { success: false, error: 'placeholderImages bulunamadı' };
    const idx = data.placeholderImages.findIndex((img: ImagePlaceholder) => img.id === imageId);
    if (idx === -1) return { success: false, error: 'Görsel bulunamadı' };
    const img = data.placeholderImages[idx] as ImagePlaceholder;
    const res = await generateImageCaption({ imageDataUri: img.imageUrl });
    if (!res.success || !res.description) return { success: false, error: res.error || 'Açıklama üretilemedi' };
    data.placeholderImages[idx] = {
      ...img,
      description: res.description,
      imageHint: res.imageHint || img.imageHint,
    };
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    revalidatePath('/admin/media');
    return { success: true, image: data.placeholderImages[idx] };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Bilinmeyen hata' };
  }
}

// Notes Actions
const NOTES_FILE_PATH = path.join(process.cwd(), 'src/lib/notes.json');

export async function getNotesAction(): Promise<{ success: boolean; notes?: Note[]; error?: string }> {
  try {
    const filePath = NOTES_FILE_PATH;
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      const notes = Array.isArray(data.notes) ? data.notes : [];
      return { success: true, notes };
    } catch (readError) {
      // Dosya yoksa boş array döndür
      return { success: true, notes: [] };
    }
  } catch (error) {
    console.error('Error reading notes:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Notlar okunurken hata oluştu' };
  }
}

export async function createNoteAction(noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    const filePath = NOTES_FILE_PATH;
    let notes: Note[] = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(fileContent);
      notes = Array.isArray(data.notes) ? data.notes : [];
    } catch {
      // Dosya yoksa boş array
    }

    const newNote: Note = {
      id: crypto.randomUUID(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    await fs.writeFile(filePath, JSON.stringify({ notes }, null, 2), 'utf-8');
    revalidatePath('/admin/notes');
    
    return { success: true, note: newNote };
  } catch (error) {
    console.error('Error creating note:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Not oluşturulurken hata oluştu' };
  }
}

export async function updateNoteAction(note: Note): Promise<{ success: boolean; note?: Note; error?: string }> {
  try {
    const filePath = NOTES_FILE_PATH;
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const notes: Note[] = Array.isArray(data.notes) ? data.notes : [];

    const index = notes.findIndex(n => n.id === note.id);
    if (index === -1) {
      return { success: false, error: 'Not bulunamadı' };
    }

    const updatedNote: Note = {
      ...note,
      updatedAt: new Date().toISOString(),
    };

    notes[index] = updatedNote;
    await fs.writeFile(filePath, JSON.stringify({ notes }, null, 2), 'utf-8');
    revalidatePath('/admin/notes');
    
    return { success: true, note: updatedNote };
  } catch (error) {
    console.error('Error updating note:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Not güncellenirken hata oluştu' };
  }
}

export async function deleteNoteAction(noteId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = NOTES_FILE_PATH;
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    const notes: Note[] = Array.isArray(data.notes) ? data.notes : [];

    const filteredNotes = notes.filter(n => n.id !== noteId);
    await fs.writeFile(filePath, JSON.stringify({ notes: filteredNotes }, null, 2), 'utf-8');
    revalidatePath('/admin/notes');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Not silinirken hata oluştu' };
  }
}
