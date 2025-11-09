'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  getVisitorMessagesAction, 
  deleteVisitorMessageAction,
  getCommentsAction,
  deleteCommentAction
} from '@/app/actions';
import type { VisitorMessage, Comment } from '@/lib/types';
import { Trash2, Mail, MessageSquare } from 'lucide-react';
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
} from '@/components/ui/alert-dialog';

function formatDate(dateString: string): string {
  if (!dateString) return 'Tarih bilgisi yok';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Geçersiz tarih';
  }
  
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (error) {
    // Fallback to simple date format
    return date.toLocaleDateString('tr-TR');
  }
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [visitorMessages, setVisitorMessages] = React.useState<VisitorMessage[]>([]);
  const [comments, setComments] = React.useState<Comment[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const [messages, commentData] = await Promise.all([
        getVisitorMessagesAction(),
        getCommentsAction(),
      ]);
      setVisitorMessages(messages);
      setComments(commentData);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        variant: 'destructive',
        title: 'Yükleme Hatası!',
        description: 'Mesajlar yüklenirken bir hata oluştu.',
      });
    }
  };

  const handleDeleteVisitorMessage = (messageId: string) => {
    startTransition(async () => {
      const result = await deleteVisitorMessageAction(messageId);
      if (result.success) {
        setVisitorMessages(prev => prev.filter(m => m.id !== messageId));
        toast({
          title: 'Mesaj Silindi!',
          description: 'Ziyaretçi mesajı başarıyla silindi.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Silme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    startTransition(async () => {
      const result = await deleteCommentAction(commentId);
      if (result.success) {
        setComments(prev => prev.filter(c => c.id !== commentId));
        toast({
          title: 'Yorum Silindi!',
          description: 'Ziyaretçi yorumu başarıyla silindi.',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Silme Başarısız!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ziyaretçi Mesajları</h1>
          <p className="text-muted-foreground">Ziyaretçilerin gönderdiği mesajları ve yorumları görüntüleyin.</p>
        </div>
      </div>

      <Tabs defaultValue="visitor-messages" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visitor-messages">
            <Mail className="h-4 w-4 mr-2" />
            Ziyaretçi Not Mesaj Kutusu ({visitorMessages.length})
          </TabsTrigger>
          <TabsTrigger value="comments">
            <MessageSquare className="h-4 w-4 mr-2" />
            Ziyaretçi Notları ({comments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visitor-messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ziyaretçi Not Mesaj Kutusu</CardTitle>
              <CardDescription>
                Ana sayfadaki "Ziyaretçi Not Mesaj Kutusu" formundan gönderilen mesajlar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {visitorMessages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Henüz mesaj bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {visitorMessages.map((message) => (
                    <Card key={message.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base font-semibold">{message.name}</CardTitle>
                            <CardDescription className="mt-1">{message.email}</CardDescription>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mesajı Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteVisitorMessage(message.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-line">{message.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ziyaretçi Notları</CardTitle>
              <CardDescription>
                Gönderiler altındaki "Ziyaretçi Notları" bölümünden gönderilen yorumlar.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Henüz yorum bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <Card key={comment.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-base font-semibold">{comment.author}</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(comment.createdAt)}
                            </p>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                disabled={isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Yorumu Sil</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu yorumu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm whitespace-pre-line">{comment.text}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

