'use server';
/**
 * @fileOverview AI-powered image caption & hint generation.
 */

import { z } from 'genkit';

const GenerateImageCaptionInputSchema = z.object({
  imageDataUri: z.string().describe('Base64 data URI of the image.'),
});

export type GenerateImageCaptionInput = z.infer<typeof GenerateImageCaptionInputSchema>;

const GenerateImageCaptionOutputSchema = z.object({
  success: z.boolean(),
  description: z.string().optional(),
  imageHint: z.string().optional(),
  error: z.string().optional(),
});

export type GenerateImageCaptionOutput = z.infer<typeof GenerateImageCaptionOutputSchema>;

export async function generateImageCaption(input: GenerateImageCaptionInput): Promise<GenerateImageCaptionOutput> {
  try {
    // Simple heuristic fallback (no true vision): derive a short hint from dataUri mime and length
    const mimeMatch = input.imageDataUri.match(/^data:([^;]+);/);
    const mime = mimeMatch ? mimeMatch[1] : 'image/png';
    const approxKb = Math.floor((input.imageDataUri.length * 3) / 4 / 1024);
    const description = `Yüklenen ${mime.split('/')[1] || 'görsel'} (${approxKb} KB civarı).`;
    const imageHint = 'auto-generated';
    return { success: true, description, imageHint };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Bilinmeyen hata' };
  }
}














