'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { diagnosePlant, type DiagnosePlantInput, type DiagnosePlantOutput } from '@/ai/flows/diagnose-plant-flow';
import { Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AiTestPage() {
  const [isPending, startTransition] = React.useTransition();
  const [result, setResult] = React.useState<DiagnosePlantOutput | null>(null);
  const [photo, setPhoto] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const description = formData.get("description") as string;

    if (!photo) {
      toast({
        variant: "destructive",
        title: "Fotoğraf eksik!",
        description: "Lütfen teşhis için bir bitki fotoğrafı yükleyin.",
      });
      return;
    }

    const input: DiagnosePlantInput = {
      photoDataUri: photo,
      description: description,
    };

    startTransition(async () => {
      try {
        const diagnosisResult = await diagnosePlant(input);
        setResult(diagnosisResult);
         toast({
          title: "Teşhis Tamamlandı!",
          description: "Bitkinizin durumu aşağıda gösterilmiştir.",
        });
      } catch (error) {
        console.error("Diagnosis error:", error);
        toast({
          variant: "destructive",
          title: "Bir hata oluştu!",
          description: "Teşhis sırasında bir sorunla karşılaşıldı. Lütfen tekrar deneyin.",
        });
      }
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            Yapay Zeka Bitki Teşhis Aracı
          </CardTitle>
          <CardDescription>
            Bitkinizin fotoğrafını ve bir açıklama ekleyerek sağlık durumunu öğrenin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="photo">Bitki Fotoğrafı</Label>
                <Input 
                  id="photo" 
                  name="photo" 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  required 
                />
                {photo && (
                  <div className="mt-4">
                    <img src={photo} alt="Yüklenen bitki" className="max-w-full h-auto rounded-md" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Açıklama (Opsiyonel)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Bitkinizin durumuyla ilgili gözlemlerinizi yazın (ör: yapraklar sararıyor, lekeler var...)"
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Teşhis Ediliyor..." : "Bitkiyi Teşhis Et"}
            </Button>
          </form>
        </CardContent>
      </Card>
      {isPending && (
        <Card>
            <CardHeader>
                <CardTitle>Teşhis Sonucu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Skeleton className="h-8 w-1/2" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
      )}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Teşhis Sonucu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.identification?.isPlant ? (
              <>
                <div>
                  <h3 className="font-semibold">Bitki Tanımı</h3>
                  <p><strong>Genel Adı:</strong> {result.identification.commonName}</p>
                  <p><strong>Latince Adı:</strong> <em>{result.identification.latinName}</em></p>
                </div>
                <div>
                  <h3 className="font-semibold">Sağlık Durumu</h3>
                  <p>
                    <strong>Durum:</strong> {result.diagnosis?.isHealthy ? 'Sağlıklı Görünüyor' : 'İyileştirme Gerekiyor'}
                  </p>
                  <p><strong>Teşhis:</strong> {result.diagnosis?.diagnosis}</p>
                </div>
              </>
            ) : (
              <p>Yüklenen görsel bir bitkiye benzemiyor. Lütfen farklı bir fotoğraf deneyin.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
