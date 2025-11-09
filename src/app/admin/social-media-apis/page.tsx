'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
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
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, Edit, Trash2, Eye, EyeOff, MoreVertical, Key, Settings } from 'lucide-react';
import {
  getSocialMediaAPIsAction,
  createSocialMediaAPIAction,
  updateSocialMediaAPIAction,
  deleteSocialMediaAPIAction,
} from '@/app/actions';
import type { SocialMediaAPI } from '@/lib/types';

const AVAILABLE_PLATFORMS = [
  'Facebook',
  'Twitter',
  'X',
  'LinkedIn',
  'Instagram',
  'Pinterest',
  'TikTok',
  'Telegram',
  'WhatsApp',
  'Threads',
  'Bluesky',
];

export default function SocialMediaAPIsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [apis, setAPIs] = React.useState<SocialMediaAPI[]>([]);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingPlatform, setEditingPlatform] = React.useState<string | null>(null);
  
  // Form states
  const [platform, setPlatform] = React.useState('');
  const [enabled, setEnabled] = React.useState(true);
  const [showSecrets, setShowSecrets] = React.useState<{ [key: string]: boolean }>({});
  
  // Facebook fields
  const [facebookAppId, setFacebookAppId] = React.useState('');
  const [facebookAppSecret, setFacebookAppSecret] = React.useState('');
  const [facebookAccessToken, setFacebookAccessToken] = React.useState('');
  const [facebookPageId, setFacebookPageId] = React.useState('');
  
  // Twitter/X fields
  const [twitterApiKey, setTwitterApiKey] = React.useState('');
  const [twitterApiSecret, setTwitterApiSecret] = React.useState('');
  const [twitterBearerToken, setTwitterBearerToken] = React.useState('');
  const [twitterAccessToken, setTwitterAccessToken] = React.useState('');
  const [twitterAccessTokenSecret, setTwitterAccessTokenSecret] = React.useState('');
  
  // LinkedIn fields
  const [linkedinClientId, setLinkedinClientId] = React.useState('');
  const [linkedinClientSecret, setLinkedinClientSecret] = React.useState('');
  const [linkedinAccessToken, setLinkedinAccessToken] = React.useState('');
  
  // Instagram fields
  const [instagramAccessToken, setInstagramAccessToken] = React.useState('');
  const [instagramUserId, setInstagramUserId] = React.useState('');
  
  // Pinterest fields
  const [pinterestAccessToken, setPinterestAccessToken] = React.useState('');
  const [pinterestBoardId, setPinterestBoardId] = React.useState('');
  
  // Generic fields
  const [apiKey, setApiKey] = React.useState('');
  const [apiSecret, setApiSecret] = React.useState('');
  const [accessToken, setAccessToken] = React.useState('');
  const [refreshToken, setRefreshToken] = React.useState('');
  const [expiresAt, setExpiresAt] = React.useState('');
  const [notes, setNotes] = React.useState('');

  React.useEffect(() => {
    loadAPIs();
  }, []);

  const loadAPIs = async () => {
    const data = await getSocialMediaAPIsAction();
    setAPIs(data);
  };

  const handleOpenDialog = (api?: SocialMediaAPI) => {
    if (api) {
      setEditingPlatform(api.platform);
      setPlatform(api.platform);
      setEnabled(api.enabled);
      setFacebookAppId(api.facebookAppId || '');
      setFacebookAppSecret(api.facebookAppSecret || '');
      setFacebookAccessToken(api.facebookAccessToken || '');
      setFacebookPageId(api.facebookPageId || '');
      setTwitterApiKey(api.twitterApiKey || '');
      setTwitterApiSecret(api.twitterApiSecret || '');
      setTwitterBearerToken(api.twitterBearerToken || '');
      setTwitterAccessToken(api.twitterAccessToken || '');
      setTwitterAccessTokenSecret(api.twitterAccessTokenSecret || '');
      setLinkedinClientId(api.linkedinClientId || '');
      setLinkedinClientSecret(api.linkedinClientSecret || '');
      setLinkedinAccessToken(api.linkedinAccessToken || '');
      setInstagramAccessToken(api.instagramAccessToken || '');
      setInstagramUserId(api.instagramUserId || '');
      setPinterestAccessToken(api.pinterestAccessToken || '');
      setPinterestBoardId(api.pinterestBoardId || '');
      setApiKey(api.apiKey || '');
      setApiSecret(api.apiSecret || '');
      setAccessToken(api.accessToken || '');
      setRefreshToken(api.refreshToken || '');
      setExpiresAt(api.expiresAt || '');
      setNotes(api.notes || '');
    } else {
      resetForm();
      setEditingPlatform(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
    setEditingPlatform(null);
  };

  const resetForm = () => {
    setPlatform('');
    setEnabled(true);
    setFacebookAppId('');
    setFacebookAppSecret('');
    setFacebookAccessToken('');
    setFacebookPageId('');
    setTwitterApiKey('');
    setTwitterApiSecret('');
    setTwitterBearerToken('');
    setTwitterAccessToken('');
    setTwitterAccessTokenSecret('');
    setLinkedinClientId('');
    setLinkedinClientSecret('');
    setLinkedinAccessToken('');
    setInstagramAccessToken('');
    setInstagramUserId('');
    setPinterestAccessToken('');
    setPinterestBoardId('');
    setApiKey('');
    setApiSecret('');
    setAccessToken('');
    setRefreshToken('');
    setExpiresAt('');
    setNotes('');
  };

  const handleSave = () => {
    if (!platform) {
      toast({
        variant: 'destructive',
        title: 'Eksik Bilgi!',
        description: 'Lütfen platform adını girin.',
      });
      return;
    }

    startTransition(async () => {
      const apiData: Omit<SocialMediaAPI, 'createdAt' | 'updatedAt'> = {
        platform,
        enabled,
        ...(facebookAppId && { facebookAppId }),
        ...(facebookAppSecret && { facebookAppSecret }),
        ...(facebookAccessToken && { facebookAccessToken }),
        ...(facebookPageId && { facebookPageId }),
        ...(twitterApiKey && { twitterApiKey }),
        ...(twitterApiSecret && { twitterApiSecret }),
        ...(twitterBearerToken && { twitterBearerToken }),
        ...(twitterAccessToken && { twitterAccessToken }),
        ...(twitterAccessTokenSecret && { twitterAccessTokenSecret }),
        ...(linkedinClientId && { linkedinClientId }),
        ...(linkedinClientSecret && { linkedinClientSecret }),
        ...(linkedinAccessToken && { linkedinAccessToken }),
        ...(instagramAccessToken && { instagramAccessToken }),
        ...(instagramUserId && { instagramUserId }),
        ...(pinterestAccessToken && { pinterestAccessToken }),
        ...(pinterestBoardId && { pinterestBoardId }),
        ...(apiKey && { apiKey }),
        ...(apiSecret && { apiSecret }),
        ...(accessToken && { accessToken }),
        ...(refreshToken && { refreshToken }),
        ...(expiresAt && { expiresAt }),
        ...(notes && { notes }),
      };

      let result;
      if (editingPlatform) {
        result = await updateSocialMediaAPIAction(editingPlatform, apiData);
      } else {
        result = await createSocialMediaAPIAction(apiData);
      }

      if (result.success) {
        toast({
          title: editingPlatform ? 'API Güncellendi!' : 'API Eklendi!',
          description: editingPlatform 
            ? 'Sosyal medya API ayarları başarıyla güncellendi.'
            : 'Yeni sosyal medya API ayarı başarıyla eklendi.',
        });
        handleCloseDialog();
        loadAPIs();
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Hata!',
          description: result.error || 'Bir hata oluştu.',
        });
      }
    });
  };

  const handleDelete = (platformName: string) => {
    startTransition(async () => {
      const result = await deleteSocialMediaAPIAction(platformName);
      if (result.success) {
        toast({
          title: 'API Silindi!',
          description: 'Sosyal medya API ayarı başarıyla silindi.',
        });
        loadAPIs();
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

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getFieldValue = (api: SocialMediaAPI, field: string): string => {
    const value = (api as any)[field];
    if (!value) return '';
    return showSecrets[`${api.platform}-${field}`] ? value : '••••••••••••';
  };

  const renderFieldsForPlatform = (selectedPlatform: string) => {
    const lowerPlatform = selectedPlatform.toLowerCase();
    
    if (lowerPlatform === 'facebook') {
      return (
        <>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="facebook-app-id">Facebook App ID</Label>
              <div className="relative">
                <Input
                  id="facebook-app-id"
                  type={showSecrets['facebook-app-id'] ? 'text' : 'password'}
                  value={facebookAppId}
                  onChange={(e) => setFacebookAppId(e.target.value)}
                  placeholder="App ID"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('facebook-app-id')}
                >
                  {showSecrets['facebook-app-id'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facebook-app-secret">Facebook App Secret</Label>
              <div className="relative">
                <Input
                  id="facebook-app-secret"
                  type={showSecrets['facebook-app-secret'] ? 'text' : 'password'}
                  value={facebookAppSecret}
                  onChange={(e) => setFacebookAppSecret(e.target.value)}
                  placeholder="App Secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('facebook-app-secret')}
                >
                  {showSecrets['facebook-app-secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facebook-access-token">Access Token</Label>
              <div className="relative">
                <Input
                  id="facebook-access-token"
                  type={showSecrets['facebook-access-token'] ? 'text' : 'password'}
                  value={facebookAccessToken}
                  onChange={(e) => setFacebookAccessToken(e.target.value)}
                  placeholder="Access Token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('facebook-access-token')}
                >
                  {showSecrets['facebook-access-token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="facebook-page-id">Page ID (Opsiyonel)</Label>
              <Input
                id="facebook-page-id"
                value={facebookPageId}
                onChange={(e) => setFacebookPageId(e.target.value)}
                placeholder="Page ID"
              />
            </div>
          </div>
        </>
      );
    }

    if (lowerPlatform === 'twitter' || lowerPlatform === 'x') {
      return (
        <>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="twitter-api-key">API Key</Label>
              <div className="relative">
                <Input
                  id="twitter-api-key"
                  type={showSecrets['twitter-api-key'] ? 'text' : 'password'}
                  value={twitterApiKey}
                  onChange={(e) => setTwitterApiKey(e.target.value)}
                  placeholder="API Key"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('twitter-api-key')}
                >
                  {showSecrets['twitter-api-key'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="twitter-api-secret">API Secret</Label>
              <div className="relative">
                <Input
                  id="twitter-api-secret"
                  type={showSecrets['twitter-api-secret'] ? 'text' : 'password'}
                  value={twitterApiSecret}
                  onChange={(e) => setTwitterApiSecret(e.target.value)}
                  placeholder="API Secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('twitter-api-secret')}
                >
                  {showSecrets['twitter-api-secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="twitter-bearer-token">Bearer Token</Label>
              <div className="relative">
                <Input
                  id="twitter-bearer-token"
                  type={showSecrets['twitter-bearer-token'] ? 'text' : 'password'}
                  value={twitterBearerToken}
                  onChange={(e) => setTwitterBearerToken(e.target.value)}
                  placeholder="Bearer Token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('twitter-bearer-token')}
                >
                  {showSecrets['twitter-bearer-token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="twitter-access-token">Access Token</Label>
              <div className="relative">
                <Input
                  id="twitter-access-token"
                  type={showSecrets['twitter-access-token'] ? 'text' : 'password'}
                  value={twitterAccessToken}
                  onChange={(e) => setTwitterAccessToken(e.target.value)}
                  placeholder="Access Token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('twitter-access-token')}
                >
                  {showSecrets['twitter-access-token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="twitter-access-token-secret">Access Token Secret</Label>
              <div className="relative">
                <Input
                  id="twitter-access-token-secret"
                  type={showSecrets['twitter-access-token-secret'] ? 'text' : 'password'}
                  value={twitterAccessTokenSecret}
                  onChange={(e) => setTwitterAccessTokenSecret(e.target.value)}
                  placeholder="Access Token Secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('twitter-access-token-secret')}
                >
                  {showSecrets['twitter-access-token-secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (lowerPlatform === 'linkedin') {
      return (
        <>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="linkedin-client-id">Client ID</Label>
              <div className="relative">
                <Input
                  id="linkedin-client-id"
                  type={showSecrets['linkedin-client-id'] ? 'text' : 'password'}
                  value={linkedinClientId}
                  onChange={(e) => setLinkedinClientId(e.target.value)}
                  placeholder="Client ID"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('linkedin-client-id')}
                >
                  {showSecrets['linkedin-client-id'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkedin-client-secret">Client Secret</Label>
              <div className="relative">
                <Input
                  id="linkedin-client-secret"
                  type={showSecrets['linkedin-client-secret'] ? 'text' : 'password'}
                  value={linkedinClientSecret}
                  onChange={(e) => setLinkedinClientSecret(e.target.value)}
                  placeholder="Client Secret"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('linkedin-client-secret')}
                >
                  {showSecrets['linkedin-client-secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="linkedin-access-token">Access Token</Label>
              <div className="relative">
                <Input
                  id="linkedin-access-token"
                  type={showSecrets['linkedin-access-token'] ? 'text' : 'password'}
                  value={linkedinAccessToken}
                  onChange={(e) => setLinkedinAccessToken(e.target.value)}
                  placeholder="Access Token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('linkedin-access-token')}
                >
                  {showSecrets['linkedin-access-token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (lowerPlatform === 'instagram') {
      return (
        <>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="instagram-access-token">Access Token</Label>
              <div className="relative">
                <Input
                  id="instagram-access-token"
                  type={showSecrets['instagram-access-token'] ? 'text' : 'password'}
                  value={instagramAccessToken}
                  onChange={(e) => setInstagramAccessToken(e.target.value)}
                  placeholder="Access Token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('instagram-access-token')}
                >
                  {showSecrets['instagram-access-token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instagram-user-id">User ID (Opsiyonel)</Label>
              <Input
                id="instagram-user-id"
                value={instagramUserId}
                onChange={(e) => setInstagramUserId(e.target.value)}
                placeholder="User ID"
              />
            </div>
          </div>
        </>
      );
    }

    if (lowerPlatform === 'pinterest') {
      return (
        <>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="pinterest-access-token">Access Token</Label>
              <div className="relative">
                <Input
                  id="pinterest-access-token"
                  type={showSecrets['pinterest-access-token'] ? 'text' : 'password'}
                  value={pinterestAccessToken}
                  onChange={(e) => setPinterestAccessToken(e.target.value)}
                  placeholder="Access Token"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => toggleSecretVisibility('pinterest-access-token')}
                >
                  {showSecrets['pinterest-access-token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pinterest-board-id">Board ID (Opsiyonel)</Label>
              <Input
                id="pinterest-board-id"
                value={pinterestBoardId}
                onChange={(e) => setPinterestBoardId(e.target.value)}
                placeholder="Board ID"
              />
            </div>
          </div>
        </>
      );
    }

    // Generic fields for other platforms
    return (
      <>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showSecrets['api-key'] ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="API Key"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => toggleSecretVisibility('api-key')}
              >
                {showSecrets['api-key'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="api-secret">API Secret</Label>
            <div className="relative">
              <Input
                id="api-secret"
                type={showSecrets['api-secret'] ? 'text' : 'password'}
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="API Secret"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => toggleSecretVisibility('api-secret')}
              >
                {showSecrets['api-secret'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="access-token">Access Token</Label>
            <div className="relative">
              <Input
                id="access-token"
                type={showSecrets['access-token'] ? 'text' : 'password'}
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Access Token"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => toggleSecretVisibility('access-token')}
              >
                {showSecrets['access-token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="refresh-token">Refresh Token (Opsiyonel)</Label>
            <div className="relative">
              <Input
                id="refresh-token"
                type={showSecrets['refresh-token'] ? 'text' : 'password'}
                value={refreshToken}
                onChange={(e) => setRefreshToken(e.target.value)}
                placeholder="Refresh Token"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => toggleSecretVisibility('refresh-token')}
              >
                {showSecrets['refresh-token'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expires-at">Token Expires At (Opsiyonel)</Label>
            <Input
              id="expires-at"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sosyal Medya API Ayarları</h1>
          <p className="text-muted-foreground">
            Sosyal medya platformları için API kimlik bilgilerinizi yönetin ve paylaşımlarınızı otomatikleştirin.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni API Ekle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPlatform ? `${editingPlatform} API Ayarlarını Düzenle` : 'Yeni Sosyal Medya API Ekle'}
              </DialogTitle>
              <DialogDescription>
                {editingPlatform 
                  ? 'API kimlik bilgilerinizi güncelleyin.'
                  : 'Sosyal medya platformu için API kimlik bilgilerinizi ekleyin.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="platform">Platform *</Label>
                <Select
                  value={platform}
                  onValueChange={setPlatform}
                  disabled={!!editingPlatform}
                >
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Platform seçin..." />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_PLATFORMS.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Aktif</Label>
                <Switch
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={setEnabled}
                />
              </div>

              {platform && (
                <>
                  {renderFieldsForPlatform(platform)}
                  
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notlar (Opsiyonel)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="API ile ilgili notlarınızı buraya yazabilirsiniz..."
                      rows={3}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCloseDialog}>İptal</Button>
              </DialogClose>
              <Button onClick={handleSave} disabled={isPending}>
                {isPending ? 'Kaydediliyor...' : editingPlatform ? 'Güncelle' : 'Kaydet'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Ayarları</CardTitle>
          <CardDescription>
            Yapılandırılmış sosyal medya API'leri. Toplam {apis.length} API ayarı.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {apis.length === 0 ? (
            <div className="text-center py-12">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Henüz API ayarı eklenmemiş.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Sosyal medya paylaşımlarınızı otomatikleştirmek için API kimlik bilgilerinizi ekleyin.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>API Key/ID</TableHead>
                  <TableHead>Access Token</TableHead>
                  <TableHead>Notlar</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apis.map((api) => (
                  <TableRow key={api.platform}>
                    <TableCell className="font-medium">{api.platform}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        api.enabled 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                      }`}>
                        {api.enabled ? 'Aktif' : 'Pasif'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">
                          {getFieldValue(api, api.facebookAppId ? 'facebookAppId' : api.twitterApiKey ? 'twitterApiKey' : api.linkedinClientId ? 'linkedinClientId' : api.apiKey ? 'apiKey' : '-')}
                        </span>
                        {(api.facebookAppId || api.twitterApiKey || api.linkedinClientId || api.apiKey) && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleSecretVisibility(`${api.platform}-${api.facebookAppId ? 'facebookAppId' : api.twitterApiKey ? 'twitterApiKey' : api.linkedinClientId ? 'linkedinClientId' : 'apiKey'}`)}
                          >
                            {showSecrets[`${api.platform}-${api.facebookAppId ? 'facebookAppId' : api.twitterApiKey ? 'twitterApiKey' : api.linkedinClientId ? 'linkedinClientId' : 'apiKey'}`] ? 
                              <EyeOff className="h-3 w-3" /> : 
                              <Eye className="h-3 w-3" />
                            }
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono">
                          {getFieldValue(api, api.facebookAccessToken ? 'facebookAccessToken' : api.twitterAccessToken ? 'twitterAccessToken' : api.linkedinAccessToken ? 'linkedinAccessToken' : api.instagramAccessToken ? 'instagramAccessToken' : api.pinterestAccessToken ? 'pinterestAccessToken' : api.accessToken ? 'accessToken' : '-')}
                        </span>
                        {(api.facebookAccessToken || api.twitterAccessToken || api.linkedinAccessToken || api.instagramAccessToken || api.pinterestAccessToken || api.accessToken) && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleSecretVisibility(`${api.platform}-${api.facebookAccessToken ? 'facebookAccessToken' : api.twitterAccessToken ? 'twitterAccessToken' : api.linkedinAccessToken ? 'linkedinAccessToken' : api.instagramAccessToken ? 'instagramAccessToken' : api.pinterestAccessToken ? 'pinterestAccessToken' : 'accessToken'}`)}
                          >
                            {showSecrets[`${api.platform}-${api.facebookAccessToken ? 'facebookAccessToken' : api.twitterAccessToken ? 'twitterAccessToken' : api.linkedinAccessToken ? 'linkedinAccessToken' : api.instagramAccessToken ? 'instagramAccessToken' : api.pinterestAccessToken ? 'pinterestAccessToken' : 'accessToken'}`] ? 
                              <EyeOff className="h-3 w-3" /> : 
                              <Eye className="h-3 w-3" />
                            }
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
                        {api.notes || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(api)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Sil
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>API Ayarlarını Silmek İstediğinizden Emin misiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu işlem geri alınamaz. {api.platform} platformu için API ayarları kalıcı olarak silinecektir.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(api.platform)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

