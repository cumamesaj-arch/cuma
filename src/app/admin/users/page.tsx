'use client';

import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
} from "@/components/ui/alert-dialog"
import {
  getUsersAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
} from "@/app/actions"
import type { User, UserRole } from "@/lib/types"
import { useRouter } from "next/navigation"

const roleLabels: Record<UserRole, string> = {
  admin: 'Yönetici',
  editor: 'Editör',
  viewer: 'Görüntüleyici',
};

export default function UsersPage() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingUserId, setEditingUserId] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // Form states
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState<UserRole>('viewer');
  const [password, setPassword] = React.useState('');
  const [active, setActive] = React.useState(true);

  // Load users
  React.useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const usersList = await getUsersAction();
      setUsers(usersList);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata!',
        description: 'Kullanıcılar yüklenirken bir hata oluştu.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open dialog for new user
  const handleOpenNewDialog = () => {
    setEditingUserId(null);
    setName('');
    setEmail('');
    setRole('viewer');
    setPassword('');
    setActive(true);
    setShowPassword(false);
    setIsDialogOpen(true);
  };

  // Open dialog for editing user
  const handleOpenEditDialog = (user: User) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword(''); // Don't show password
    setActive(user.active);
    setShowPassword(false);
    setIsDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUserId(null);
    setName('');
    setEmail('');
    setRole('viewer');
    setPassword('');
    setActive(true);
    setShowPassword(false);
  };

  // Save user
  const handleSaveUser = () => {
    if (!name.trim() || !email.trim()) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi!',
        description: 'Lütfen isim ve email alanlarını doldurun.',
      });
      return;
    }

    if (!editingUserId && !password.trim()) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi!',
        description: 'Yeni kullanıcı için şifre gereklidir.',
      });
      return;
    }

    startTransition(async () => {
      if (editingUserId) {
        // Update user
        const updates: {
          name?: string;
          email?: string;
          role?: UserRole;
          password?: string;
          active?: boolean;
        } = {
          name,
          email,
          role,
          active,
        };
        
        if (password.trim()) {
          updates.password = password;
        }

        const result = await updateUserAction(editingUserId, updates);
        if (result.success) {
          toast({
            title: 'Başarılı!',
            description: 'Kullanıcı başarıyla güncellendi.',
          });
          handleCloseDialog();
          loadUsers();
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: 'Hata!',
            description: result.error || 'Kullanıcı güncellenirken bir hata oluştu.',
          });
        }
      } else {
        // Create user
        const result = await createUserAction({
          name,
          email,
          role,
          password,
          active,
        });
        if (result.success) {
          toast({
            title: 'Başarılı!',
            description: 'Kullanıcı başarıyla oluşturuldu.',
          });
          handleCloseDialog();
          loadUsers();
          router.refresh();
        } else {
          toast({
            variant: 'destructive',
            title: 'Hata!',
            description: result.error || 'Kullanıcı oluşturulurken bir hata oluştu.',
          });
        }
      }
    });
  };

  // Delete user
  const handleDeleteUser = (userId: string) => {
    startTransition(async () => {
      const result = await deleteUserAction(userId);
      if (result.success) {
        toast({
          title: 'Başarılı!',
          description: 'Kullanıcı başarıyla silindi.',
        });
        loadUsers();
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Hata!',
          description: result.error || 'Kullanıcı silinirken bir hata oluştu.',
        });
      }
    });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kullanıcı Ayarları</h2>
          <p className="text-muted-foreground">
            Kullanıcıları ve yetkilerini yönetin.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenNewDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kullanıcı
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingUserId ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
              </DialogTitle>
              <DialogDescription>
                {editingUserId
                  ? 'Kullanıcı bilgilerini güncelleyin. Şifre alanını boş bırakırsanız şifre değişmez.'
                  : 'Yeni kullanıcı ekleyin. Şifre zorunludur.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">İsim</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kullanıcı adı"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Yönetici</SelectItem>
                    <SelectItem value="editor">Editör</SelectItem>
                    <SelectItem value="viewer">Görüntüleyici</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">
                  Şifre {!editingUserId && <span className="text-red-500">*</span>}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={editingUserId ? 'Değiştirmek için yeni şifre girin' : 'Şifre'}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Aktif</Label>
                <Switch
                  id="active"
                  checked={active}
                  onCheckedChange={setActive}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>
                İptal
              </Button>
              <Button onClick={handleSaveUser} disabled={isPending}>
                {isPending ? 'Kaydediliyor...' : editingUserId ? 'Güncelle' : 'Oluştur'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kullanıcılar</CardTitle>
          <CardDescription>
            Tüm kullanıcıları görüntüleyin ve yönetin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Henüz kullanıcı bulunmuyor.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>İsim</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Oluşturulma</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === 'admin'
                            ? 'destructive'
                            : user.role === 'editor'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? 'default' : 'outline'}>
                        {user.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEditDialog(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
                              <AlertDialogDescription>
                                {user.name} ({user.email}) kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteUser(user.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
