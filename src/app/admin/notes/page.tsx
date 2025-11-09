'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Save, X, Calendar, CheckCircle2, Circle, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { Note } from '@/lib/types';
import { getNotesAction, createNoteAction, updateNoteAction, deleteNoteAction } from '@/app/actions';

export default function NotesPage() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    isDone: false,
    isTodo: false,
    isImportant: false,
  });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setIsLoading(true);
      const result = await getNotesAction();
      if (result.success && result.notes) {
        setNotes(result.notes);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Notlar yüklenirken bir hata oluştu.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingNote(null);
    setFormData({
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      isDone: false,
      isTodo: false,
      isImportant: false,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
      date: note.date.split('T')[0],
      isDone: note.isDone,
      isTodo: note.isTodo,
      isImportant: note.isImportant,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Not başlığı gereklidir.',
      });
      return;
    }

    try {
      if (editingNote) {
        const result = await updateNoteAction({
          ...editingNote,
          ...formData,
          date: new Date(formData.date).toISOString(),
        });
        if (result.success) {
          toast({
            title: 'Başarılı',
            description: 'Not güncellendi.',
          });
          setIsDialogOpen(false);
          loadNotes();
        } else {
          toast({
            variant: 'destructive',
            title: 'Hata',
            description: result.error || 'Not güncellenirken bir hata oluştu.',
          });
        }
      } else {
        const result = await createNoteAction(formData);
        if (result.success) {
          toast({
            title: 'Başarılı',
            description: 'Not eklendi.',
          });
          setIsDialogOpen(false);
          loadNotes();
        } else {
          toast({
            variant: 'destructive',
            title: 'Hata',
            description: result.error || 'Not eklenirken bir hata oluştu.',
          });
        }
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Bir hata oluştu.',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu notu silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      const result = await deleteNoteAction(id);
      if (result.success) {
        toast({
          title: 'Başarılı',
          description: 'Not silindi.',
        });
        loadNotes();
      } else {
        toast({
          variant: 'destructive',
          title: 'Hata',
          description: result.error || 'Not silinirken bir hata oluştu.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Bir hata oluştu.',
      });
    }
  };

  const handleToggle = async (note: Note, field: 'isDone' | 'isTodo' | 'isImportant') => {
    try {
      const updatedNote = { ...note, [field]: !note[field] };
      const result = await updateNoteAction(updatedNote);
      if (result.success) {
        loadNotes();
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Güncelleme sırasında bir hata oluştu.',
      });
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    // Önemli notlar önce
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    // Tarihe göre sırala (yeni önce)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notlarım</h1>
          <p className="text-muted-foreground mt-1">Notlarınızı buradan yönetebilirsiniz.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Not
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Notu Düzenle' : 'Yeni Not Ekle'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Not Başlığı</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Not başlığını girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Tarih</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Yazılacak</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Not içeriğini girin"
                  rows={6}
                />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isDone"
                    checked={formData.isDone}
                    onCheckedChange={(checked) => setFormData({ ...formData, isDone: checked as boolean })}
                  />
                  <Label htmlFor="isDone" className="cursor-pointer">Yapıldı</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isTodo"
                    checked={formData.isTodo}
                    onCheckedChange={(checked) => setFormData({ ...formData, isTodo: checked as boolean })}
                  />
                  <Label htmlFor="isTodo" className="cursor-pointer">Yapılacak</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isImportant"
                    checked={formData.isImportant}
                    onCheckedChange={(checked) => setFormData({ ...formData, isImportant: checked as boolean })}
                  />
                  <Label htmlFor="isImportant" className="cursor-pointer">Önemli</Label>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  İptal
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Kaydet
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      ) : sortedNotes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Henüz not eklenmemiş.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedNotes.map((note) => (
            <Card key={note.id} className={note.isImportant ? 'border-primary border-2' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {note.isImportant && <Star className="h-4 w-4 fill-primary text-primary" />}
                      {note.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(note.date), 'dd MMMM yyyy', { locale: tr })}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                <div className="flex items-center gap-4 pt-2 border-t">
                  <button
                    onClick={() => handleToggle(note, 'isDone')}
                    className={`flex items-center gap-1 text-sm ${note.isDone ? 'text-green-600' : 'text-muted-foreground'}`}
                  >
                    {note.isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    Yapıldı
                  </button>
                  <button
                    onClick={() => handleToggle(note, 'isTodo')}
                    className={`flex items-center gap-1 text-sm ${note.isTodo ? 'text-blue-600' : 'text-muted-foreground'}`}
                  >
                    {note.isTodo ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                    Yapılacak
                  </button>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(note)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



