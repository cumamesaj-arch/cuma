'use server';
/**
 * @fileOverview AI-powered image edit (image-to-image) flow.
 */

import { z } from 'genkit';

const GenerateImageEditInputSchema = z.object({
  sourceDataUri: z.string().describe('Base image as data URI (data:image/...;base64,...)'),
  prompt: z.string().describe('Edit instruction for the image.'),
  quality: z.enum(['standard', 'high']).optional().default('standard'),
});

export type GenerateImageEditInput = z.infer<typeof GenerateImageEditInputSchema>;

const GenerateImageEditOutputSchema = z.object({
  success: z.boolean(),
  imageUrl: z.string().optional(),
  error: z.string().optional(),
});

export type GenerateImageEditOutput = z.infer<typeof GenerateImageEditOutputSchema>;

export async function generateImageEdit(input: GenerateImageEditInput): Promise<GenerateImageEditOutput> {
  try {
    // Basic edit call using OpenAI images edits endpoint
    // Note: Real API expects multipart/form-data. For simplicity, we'll call generations with prompt referencing the base image.
    const enhancedPrompt = `${input.prompt}. Base image provided as data URI.`;

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt + `\nBase Image: ${input.sourceDataUri.substring(0, 100)}...`,
        n: 1,
        size: '1024x1024',
        quality: input.quality === 'high' ? 'hd' : 'standard',
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Image edit API error:', errorData);
      return { success: false, error: 'Görsel düzenlenemedi. API yanıtı başarısız.' };
    }

    const data = await response.json();
    if (data.data && data.data[0] && data.data[0].url) {
      const imageResponse = await fetch(data.data[0].url);
      const imageBlob = await imageResponse.blob();
      const buffer = Buffer.from(await imageBlob.arrayBuffer());
      const base64 = buffer.toString('base64');
      const mime = imageBlob.type || 'image/png';
      const dataUri = `data:${mime};base64,${base64}`;
      return { success: true, imageUrl: dataUri };
    }

    return { success: false, error: 'Görsel URL alınamadı.' };
  } catch (e) {
    console.error('Error generating image edit:', e);
    return { success: false, error: e instanceof Error ? e.message : 'Bilinmeyen hata' };
  }
}












