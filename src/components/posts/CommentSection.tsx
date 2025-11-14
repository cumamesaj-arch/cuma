
'use client';

import { useState, useTransition, useEffect } from 'react';
import type { Comment } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { addCommentAction, deleteCommentAction, updateCommentAction, getCommentsAction } from '@/app/actions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

function FormattedDate({ dateString }: { dateString?: string }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (dateString) {
      try {
        setFormattedDate(new Date(dateString).toLocaleDateString('tr-TR'));
      } catch (error) {
        setFormattedDate('');
      }
    }
  }, [dateString]);

  if (!dateString) return null;
  return <time className="text-xs text-muted-foreground">{formattedDate}</time>;
}

export function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  
  // Firebase'den yorumları yükle
  useEffect(() => {
    async function loadComments() {
      const loadedComments = await getCommentsAction();
      setComments(loadedComments);
    }
    loadComments();
  }, []);
  const [editingText, setEditingText] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const author = formData.get('author') as string;
    const text = formData.get('text') as string;

    if (author.trim() && text.trim()) {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        author,
        text,
        createdAt: new Date().toISOString(),
      };
      
      const form = e.currentTarget;

      startTransition(async () => {
        const result = await addCommentAction(newComment);
        if (result.success && result.comment) {
          setComments(prevComments => [result.comment!, ...prevComments]);
          form.reset();
          toast({
            title: "Yorumunuz gönderildi!",
            description: "Değerli görüşleriniz için teşekkür ederiz.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Yorum Gönderilemedi!",
            description: result.error || "Bir hata oluştu.",
          });
        }
      });
    }
  };

  const handleDelete = (commentId: string) => {
    startTransition(async () => {
      const result = await deleteCommentAction(commentId);
      if (result.success) {
        setComments(prevComments => prevComments.filter(c => c.id !== commentId));
        toast({
          title: "Yorum Silindi!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Silme Başarısız!",
          description: result.error || "Bir hata oluştu.",
        });
      }
    });
  };
  
  const handleUpdate = (commentId: string) => {
    if (editingText.trim() === '') {
        toast({ variant: 'destructive', title: 'Yorum boş olamaz.' });
        return;
    }

    startTransition(async () => {
      const result = await updateCommentAction(commentId, editingText);
      if (result.success && result.comment) {
        setComments(prevComments => prevComments.map(c => c.id === commentId ? result.comment! : c));
        setEditingCommentId(null);
        setEditingText('');
        toast({
          title: "Yorum Güncellendi!",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Güncelleme Başarısız!",
          description: result.error || "Bir hata oluştu.",
        });
      }
    });
  };
  
  const startEditing = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text || '');
  };
  
  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingText('');
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <MessageSquare className="h-6 w-6 text-primary" />
          Ziyaretçi Notları
        </CardTitle>
        <CardDescription>Bu gönderi hakkındaki düşüncelerinizi paylaşın.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input name="author" placeholder="Adınız" required disabled={isPending} />
          <Textarea name="text" placeholder="Yorumunuzu buraya yazın..." required disabled={isPending} />
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
            {isPending ? 'Gönderiliyor...' : 'Yorum Yap'}
          </Button>
        </form>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Yorumlar ({comments.length})</h3>
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <Avatar>
                <AvatarFallback>{(comment.author || '?').charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className='w-full'>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{comment.author || 'İsimsiz'}</p>
                  <div className="flex items-center gap-2">
                     <FormattedDate dateString={comment.createdAt} />
                     <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditing(comment)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Düzenle</span>
                     </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Sil</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Bu yorum kalıcı olarak silinecektir. Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Vazgeç</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(comment.id)}>
                            Sil
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                 {editingCommentId === comment.id ? (
                  <div className="mt-2 space-y-2">
                    <Textarea
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="min-h-[60px]"
                      disabled={isPending}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdate(comment.id)} disabled={isPending}>
                        {isPending ? 'Kaydediliyor...': 'Kaydet'}
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing} disabled={isPending}>
                        İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-1">{comment.text || ''}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground mt-1">{comment.text || ''}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
