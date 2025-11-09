import type { Category, Post, ShareLink } from '@/lib/types';
import { Facebook, Instagram, MessageCircle, Moon, Rss, Star, Twitter, Video, Hand, Heart, CalendarDays, Camera } from 'lucide-react';

export const CATEGORIES: Category[] = [
  { id: '1', title: 'Cuma Mesajları', slug: 'cuma-mesajlari', icon: Star },
  { id: '2', title: 'Kandil Mesajları', slug: 'kandil-mesajlari', icon: Moon },
  { id: '3', title: 'Bayram Mesajları', slug: 'bayram-mesajlari', icon: Heart },
  {
    id: '4',
    title: 'Diğer',
    slug: 'diger',
    icon: Rss,
    subcategories: [
      { id: '4a', title: 'Çeşitli Kartlar', slug: 'kutlama-kartlar', icon: Hand },],
  },
  {
    id: '5',
    title: 'Videolar',
    slug: 'videolar',
    icon: Video,
    subcategories: [
      { id: '5a', title: 'Gusül (Boy Abdesti)', slug: 'gusul-abdesti', icon: Hand },
      { id: '5b', title: 'Abdest Videoları', slug: 'abdest-videolari', icon: Hand },
      { id: '5c', title: 'Namaz Videoları', slug: 'namaz-videolari', icon: Hand },
      { id: '5d', title: 'Diğer Videolar', slug: 'diger-videolar', icon: Video },
    ],
  },
  { id: '6', title: 'Fotograflar', slug: 'fotograflar', icon: Camera }
];

export const POSTS: Post[] = [
  {
    id: 'post-1762468743704',
    title: 'Hafız Yunus Balcıoğlu Enfal 20-28',
    slug: 'hafz-yunus-balcolu-enfal-20-28',
    category: 'diger-videolar',
    content: {
      meal: ``,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    youtubeVideoIds: ['ZWzBJ88PnlA'],
    youtubeVideoId: 'ZWzBJ88PnlA',
    createdAt: '2025-11-06T22:39:03.704Z'
  },
  {
    id: 'post-1762452178870-357092',
    title: '1913290388795074.jpg',
    slug: '1913290388795074jpg',
    category: 'fotograflar',
    imageIds: ['new-1762252979453-20'],
    imageId: 'new-1762252979453-20',
    content: {
      meal: ``,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z'
  },
  
  
  {
    id: 'post-1762452178870-545851',
    title: '1913290385461741.jpg',
    slug: '1913290385461741jpg',
    category: 'fotograflar',
    imageIds: ['new-1762252925363-19'],
    imageId: 'new-1762252925363-19',
    content: {
      meal: ``,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z'
  },
  
  
  {
    id: 'post-1762452178870-443291',
    title: '1913290382128408.jpg',
    slug: '1913290382128408jpg',
    category: 'fotograflar',
    imageIds: ['new-1762252915988-18'],
    imageId: 'new-1762252915988-18',
    content: {
      meal: ``,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z'
  },
  
  
  {
    id: 'post-1762452178870-521125',
    title: '1908485855942194.jpg',
    slug: '1908485855942194jpg',
    category: 'fotograflar',
    imageIds: ['new-1762252907025-17'],
    imageId: 'new-1762252907025-17',
    content: {
      meal: ``,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z'
  },
  
  
  {
    id: 'post-1762452178870-724302',
    title: '1908485782608868.jpg',
    slug: '1908485782608868jpg',
    category: 'fotograflar',
    imageIds: ['new-1762252894655-16'],
    imageId: 'new-1762252894655-16',
    content: {
      meal: ``,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z'
  },
  
  
  {
    id: 'post-1762452178870-865610',
    title: '1908485695942210.jpg',
    slug: '1908485695942210jpg',
    category: 'fotograflar',
    imageIds: ['new-1762252881552-15'],
    imageId: 'new-1762252881552-15',
    content: {
      meal: ``,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z'
  },
  
  
  {
    id: 'post-1762452178870-949690',
    title: '1908485639275549.jpg',
    slug: '1908485639275549jpg',
    category: 'fotograflar',
    imageId: 'new-1762252872655-14',
    content: {
      meal: `Paylaşılan görsel: 1908485639275549.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-677637',
    title: '1908485579275555.jpg',
    slug: '1908485579275555jpg',
    category: 'fotograflar',
    imageId: 'new-1762252863352-13',
    content: {
      meal: `Paylaşılan görsel: 1908485579275555.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-479594',
    title: '1908485465942233.jpg',
    slug: '1908485465942233jpg',
    category: 'fotograflar',
    imageId: 'new-1762252854547-12',
    content: {
      meal: `Paylaşılan görsel: 1908485465942233.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-341740',
    title: '1908485349275578.jpg',
    slug: '1908485349275578jpg',
    category: 'fotograflar',
    imageId: 'new-1762252843741-11',
    content: {
      meal: `Paylaşılan görsel: 1908485349275578.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-666163',
    title: '1908485285942251.jpg',
    slug: '1908485285942251jpg',
    category: 'fotograflar',
    imageId: 'new-1762252831753-10',
    content: {
      meal: `Paylaşılan görsel: 1908485285942251.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  
  {
    id: 'post-1762452178870-324070',
    title: '1894269640697149.jpg',
    slug: '1894269640697149jpg',
    category: 'fotograflar',
    imageId: 'new-1762252823589-9',
    content: {
      meal: `Paylaşılan görsel: 1894269640697149.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  
  {
    id: 'post-1762452178870-960568',
    title: '1894269574030489.jpg',
    slug: '1894269574030489jpg',
    category: 'fotograflar',
    imageId: 'new-1762252812116-8',
    content: {
      meal: `Paylaşılan görsel: 1894269574030489.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-481754',
    title: '1894269387363841.jpg',
    slug: '1894269387363841jpg',
    category: 'fotograflar',
    imageId: 'new-1762252803670-7',
    content: {
      meal: `Paylaşılan görsel: 1894269387363841.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-386797',
    title: '1894269260697187.jpg',
    slug: '1894269260697187jpg',
    category: 'fotograflar',
    imageId: 'new-1762252790974-6',
    content: {
      meal: `Paylaşılan görsel: 1894269260697187.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-19900',
    title: '1894269204030526.jpg',
    slug: '1894269204030526jpg',
    category: 'fotograflar',
    imageId: 'new-1762252777861-5',
    content: {
      meal: `Paylaşılan görsel: 1894269204030526.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-740004',
    title: '1752523821538399.jpg',
    slug: '1752523821538399jpg',
    category: 'fotograflar',
    imageId: 'new-1762252765516-4',
    content: {
      meal: `Paylaşılan görsel: 1752523821538399.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-354213',
    title: '1752523714871743.jpg',
    slug: '1752523714871743jpg',
    category: 'fotograflar',
    imageId: 'new-1762252753980-3',
    content: {
      meal: `Paylaşılan görsel: 1752523714871743.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-93011',
    title: '1752523578205090.jpg',
    slug: '1752523578205090jpg',
    category: 'fotograflar',
    imageId: 'new-1762252742129-2',
    content: {
      meal: `Paylaşılan görsel: 1752523578205090.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-549103',
    title: '1752523431538438.jpg',
    slug: '1752523431538438jpg',
    category: 'fotograflar',
    imageId: 'new-1762252731874-1',
    content: {
      meal: `Paylaşılan görsel: 1752523431538438.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:00:00.000Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-911122',
    title: '341298289327633.jpg',
    slug: '341298289327633jpg',
    category: 'cuma-mesajlari',
    imageId: 'new-1762252728404-0',
    content: {
      meal: `Paylaşılan görsel: 341298289327633.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-95552',
    title: '995463477244441.jpg',
    slug: '995463477244441jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365871-901399',
    content: {
      meal: `Paylaşılan görsel: 995463477244441.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:01:00.000Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-132293',
    title: '987861838004605.jpg',
    slug: '987861838004605jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365864-78356',
    content: {
      meal: `Paylaşılan görsel: 987861838004605.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:01:00.000Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-590090',
    title: '979559628834826.jpg',
    slug: '979559628834826jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365857-37544',
    content: {
      meal: `Paylaşılan görsel: 979559628834826.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:01:00.000Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-81419',
    title: '971552792968843.jpg',
    slug: '971552792968843jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365852-781274',
    content: {
      meal: `Paylaşılan görsel: 971552792968843.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-681022',
    title: '964041273719995.jpg',
    slug: '964041273719995jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365837-456015',
    content: {
      meal: `Paylaşılan görsel: 964041273719995.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:01:00.000Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-599162',
    title: '956467944477328.jpg',
    slug: '956467944477328jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365822-959404',
    content: {
      meal: `Paylaşılan görsel: 956467944477328.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:01:00.000Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-53582',
    title: '948731061917683.jpg',
    slug: '948731061917683jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365817-728058',
    content: {
      meal: `Paylaşılan görsel: 948731061917683.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-932715',
    title: '941260699331386.jpg',
    slug: '941260699331386jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365804-648196',
    content: {
      meal: `Paylaşılan görsel: 941260699331386.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-105906',
    title: '934070936717029.jpg',
    slug: '934070936717029jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365797-542534',
    content: {
      meal: `Paylaşılan görsel: 934070936717029.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-874739',
    title: '926685954122194.jpg',
    slug: '926685954122194jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365785-839803',
    content: {
      meal: `Paylaşılan görsel: 926685954122194.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-727243',
    title: '919691651488291.jpg',
    slug: '919691651488291jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365765-853742',
    content: {
      meal: `Paylaşılan görsel: 919691651488291.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-890304',
    title: '912659072191549.jpg',
    slug: '912659072191549jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365755-922322',
    content: {
      meal: `Paylaşılan görsel: 912659072191549.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-153743',
    title: '905450942912362.jpg',
    slug: '905450942912362jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365742-748481',
    content: {
      meal: `Paylaşılan görsel: 905450942912362.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-876750',
    title: '898541870269936.jpg',
    slug: '898541870269936jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365714-202409',
    content: {
      meal: `Paylaşılan görsel: 898541870269936.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:01:00.000Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-573099',
    title: '893319284125528.jpg',
    slug: '893319284125528jpg',
    category: 'kutlama-kartlar',
    imageId: 'upload-1762201365705-146759',
    content: {
      meal: `Paylaşılan görsel: 893319284125528.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-279510',
    title: '891871427603647.jpg',
    slug: '891871427603647jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365697-340951',
    content: {
      meal: `Paylaşılan görsel: 891871427603647.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-307445',
    title: '888918484565608.jpg',
    slug: '888918484565608jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365689-689545',
    content: {
      meal: `Paylaşılan görsel: 888918484565608.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-25555',
    title: '885633504894106.jpg',
    slug: '885633504894106jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365683-755312',
    content: {
      meal: `Paylaşılan görsel: 885633504894106.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T15:01:00.000Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-841335',
    title: '879348928855897.jpg',
    slug: '879348928855897jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365674-403604',
    content: {
      meal: `Paylaşılan görsel: 879348928855897.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-525314',
    title: '872709519519838.jpg',
    slug: '872709519519838jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365667-805863',
    content: {
      meal: `Paylaşılan görsel: 872709519519838.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-784804',
    title: '863279400462850.jpg',
    slug: '863279400462850jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365657-913339',
    content: {
      meal: `Paylaşılan görsel: 863279400462850.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-424129',
    title: '856970897760367.jpg',
    slug: '856970897760367jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365652-16499',
    content: {
      meal: `Paylaşılan görsel: 856970897760367.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-941055',
    title: '850724685051655.jpg',
    slug: '850724685051655jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365640-394748',
    content: {
      meal: `Paylaşılan görsel: 850724685051655.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-651361',
    title: '844535999003857.jpg',
    slug: '844535999003857jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365630-299766',
    content: {
      meal: `Paylaşılan görsel: 844535999003857.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-275825',
    title: '838890652901725.jpg',
    slug: '838890652901725jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365621-134742',
    content: {
      meal: `Paylaşılan görsel: 838890652901725.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-850512',
    title: '833503560107101.jpg',
    slug: '833503560107101jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365609-891667',
    content: {
      meal: `Paylaşılan görsel: 833503560107101.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-411782',
    title: '830926123698178.jpg',
    slug: '830926123698178jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365597-91961',
    content: {
      meal: `Paylaşılan görsel: 830926123698178.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-277100',
    title: '828187420638715.jpg',
    slug: '828187420638715jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365590-312169',
    content: {
      meal: `Paylaşılan görsel: 828187420638715.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-86021',
    title: '822790301178427.jpg',
    slug: '822790301178427jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365583-654183',
    content: {
      meal: `Paylaşılan görsel: 822790301178427.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-732224',
    title: '817315841725873.jpg',
    slug: '817315841725873jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365574-966984',
    content: {
      meal: `Paylaşılan görsel: 817315841725873.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-604899',
    title: '811086122348845.jpg',
    slug: '811086122348845jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365546-868084',
    content: {
      meal: `Paylaşılan görsel: 811086122348845.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-443529',
    title: '807193026071488.jpg',
    slug: '807193026071488jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365540-632997',
    content: {
      meal: `Paylaşılan görsel: 807193026071488.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-843033',
    title: '801815036609287.jpg',
    slug: '801815036609287jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365532-938400',
    content: {
      meal: `Paylaşılan görsel: 801815036609287.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-268529',
    title: '792421077548683.jpg',
    slug: '792421077548683jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365522-821668',
    content: {
      meal: `Paylaşılan görsel: 792421077548683.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-800328',
    title: '783698578420933.jpg',
    slug: '783698578420933jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365511-904350',
    content: {
      meal: `Paylaşılan görsel: 783698578420933.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-973377',
    title: '776504882473636.jpg',
    slug: '776504882473636jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201365503-985995',
    content: {
      meal: `Paylaşılan görsel: 776504882473636.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-658565',
    title: '776504785806979.jpg',
    slug: '776504785806979jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201365496-557998',
    content: {
      meal: `Paylaşılan görsel: 776504785806979.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-171041',
    title: '776504579140333.jpg',
    slug: '776504579140333jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201365490-132914',
    content: {
      meal: `Paylaşılan görsel: 776504579140333.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-819653',
    title: '776504479140343.jpg',
    slug: '776504479140343jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201365485-314130',
    content: {
      meal: `Paylaşılan görsel: 776504479140343.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178870-637943',
    title: '776504342473690.jpg',
    slug: '776504342473690jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201365475-987950',
    content: {
      meal: `Paylaşılan görsel: 776504342473690.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178870-428951',
    title: '776504245807033.jpg',
    slug: '776504245807033jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201365456-772195',
    content: {
      meal: `Paylaşılan görsel: 776504245807033.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-489159',
    title: '775152145942243.jpg',
    slug: '775152145942243jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365437-206325',
    content: {
      meal: `Paylaşılan görsel: 775152145942243.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-62857',
    title: '766340340156757.jpg',
    slug: '766340340156757jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365429-492670',
    content: {
      meal: `Paylaşılan görsel: 766340340156757.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-810450',
    title: '758579754266149.jpg',
    slug: '758579754266149jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365422-427925',
    content: {
      meal: `Paylaşılan görsel: 758579754266149.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-905166',
    title: '750827651708026.jpg',
    slug: '750827651708026jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365413-665929',
    content: {
      meal: `Paylaşılan görsel: 750827651708026.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-608247',
    title: '742505202540271.jpg',
    slug: '742505202540271jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365407-631251',
    content: {
      meal: `Paylaşılan görsel: 742505202540271.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-234856',
    title: '734488306675294.jpg',
    slug: '734488306675294jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365398-93981',
    content: {
      meal: `Paylaşılan görsel: 734488306675294.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-764449',
    title: '727183187405806.jpg',
    slug: '727183187405806jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365392-432474',
    content: {
      meal: `Paylaşılan görsel: 727183187405806.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-290902',
    title: '726967207427404.jpg',
    slug: '726967207427404jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365388-130930',
    content: {
      meal: `Paylaşılan görsel: 726967207427404.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-437115',
    title: '723194197804705.jpg',
    slug: '723194197804705jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365379-739393',
    content: {
      meal: `Paylaşılan görsel: 723194197804705.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-171618',
    title: '721523361305122.jpg',
    slug: '721523361305122jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365362-979484',
    content: {
      meal: `Paylaşılan görsel: 721523361305122.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-392377',
    title: '717291271728331.jpg',
    slug: '717291271728331jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365356-71990',
    content: {
      meal: `Paylaşılan görsel: 717291271728331.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-170391',
    title: '713186845472107.jpg',
    slug: '713186845472107jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365352-904977',
    content: {
      meal: `Paylaşılan görsel: 713186845472107.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-337210',
    title: '709094465881345.jpg',
    slug: '709094465881345jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365345-632643',
    content: {
      meal: `Paylaşılan görsel: 709094465881345.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-365896',
    title: '704893522968106.jpg',
    slug: '704893522968106jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365339-436773',
    content: {
      meal: `Paylaşılan görsel: 704893522968106.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-367671',
    title: '700850356705756.jpg',
    slug: '700850356705756jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365336-928741',
    content: {
      meal: `Paylaşılan görsel: 700850356705756.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-603006',
    title: '698835666907225.jpg',
    slug: '698835666907225jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365329-530583',
    content: {
      meal: `Paylaşılan görsel: 698835666907225.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-303433',
    title: '696762370447888.jpg',
    slug: '696762370447888jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365321-591655',
    content: {
      meal: `Paylaşılan görsel: 696762370447888.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-198108',
    title: '692529744204484.jpg',
    slug: '692529744204484jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365312-589070',
    content: {
      meal: `Paylaşılan görsel: 692529744204484.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-610625',
    title: '688822737908518.jpg',
    slug: '688822737908518jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365305-475621',
    content: {
      meal: `Paylaşılan görsel: 688822737908518.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-747189',
    title: '688476267943165.jpg',
    slug: '688476267943165jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365291-393634',
    content: {
      meal: `Paylaşılan görsel: 688476267943165.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-316161',
    title: '684187785038680.jpg',
    slug: '684187785038680jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365287-112262',
    content: {
      meal: `Paylaşılan görsel: 684187785038680.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-973629',
    title: '680009052123220.jpg',
    slug: '680009052123220jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365279-763841',
    content: {
      meal: `Paylaşılan görsel: 680009052123220.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-716431',
    title: '675880335869425.jpg',
    slug: '675880335869425jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365272-958894',
    content: {
      meal: `Paylaşılan görsel: 675880335869425.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-300194',
    title: '675537912570334.jpg',
    slug: '675537912570334jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365264-835996',
    content: {
      meal: `Paylaşılan görsel: 675537912570334.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-187444',
    title: '671642836293175.jpg',
    slug: '671642836293175jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365258-464047',
    content: {
      meal: `Paylaşılan görsel: 671642836293175.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178870-332277',
    title: '667336620057130.jpg',
    slug: '667336620057130jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365253-577541',
    content: {
      meal: `Paylaşılan görsel: 667336620057130.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-998011',
    title: '663221423801983.jpg',
    slug: '663221423801983jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365247-491551',
    content: {
      meal: `Paylaşılan görsel: 663221423801983.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-723760',
    title: '659192824204843.jpg',
    slug: '659192824204843jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365240-520458',
    content: {
      meal: `Paylaşılan görsel: 659192824204843.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-129426',
    title: '655212741269518.jpg',
    slug: '655212741269518jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365229-220510',
    content: {
      meal: `Paylaşılan görsel: 655212741269518.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-454905',
    title: '651345024989623.jpg',
    slug: '651345024989623jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365224-320271',
    content: {
      meal: `Paylaşılan görsel: 651345024989623.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-237878',
    title: '647670002023792.jpg',
    slug: '647670002023792jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365220-361388',
    content: {
      meal: `Paylaşılan görsel: 647670002023792.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-501389',
    title: '643955185728607.jpg',
    slug: '643955185728607jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365214-514053',
    content: {
      meal: `Paylaşılan görsel: 643955185728607.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-609957',
    title: '640161542774638.jpg',
    slug: '640161542774638jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365199-778010',
    content: {
      meal: `Paylaşılan görsel: 640161542774638.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-292590',
    title: '636559766468149.jpg',
    slug: '636559766468149jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365191-441994',
    content: {
      meal: `Paylaşılan görsel: 636559766468149.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-369877',
    title: '632164756907650.jpg',
    slug: '632164756907650jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365187-701296',
    content: {
      meal: `Paylaşılan görsel: 632164756907650.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-162589',
    title: '628300083960784.jpg',
    slug: '628300083960784jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365181-179150',
    content: {
      meal: `Paylaşılan görsel: 628300083960784.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-385695',
    title: '624920890965370.jpg',
    slug: '624920890965370jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365171-691312',
    content: {
      meal: `Paylaşılan görsel: 624920890965370.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-930209',
    title: '621265681330891.jpg',
    slug: '621265681330891jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365164-435794',
    content: {
      meal: `Paylaşılan görsel: 621265681330891.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-912310',
    title: '617337321723727.jpg',
    slug: '617337321723727jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365158-44735',
    content: {
      meal: `Paylaşılan görsel: 617337321723727.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-258447',
    title: '613192552138204.jpg',
    slug: '613192552138204jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365154-819246',
    content: {
      meal: `Paylaşılan görsel: 613192552138204.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-18631',
    title: '612257942231665.jpg',
    slug: '612257942231665jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365148-372182',
    content: {
      meal: `Paylaşılan görsel: 612257942231665.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-918961',
    title: '608717649252361.jpg',
    slug: '608717649252361jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365125-346789',
    content: {
      meal: `Paylaşılan görsel: 608717649252361.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-98094',
    title: '604661919657934.jpg',
    slug: '604661919657934jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365120-69371',
    content: {
      meal: `Paylaşılan görsel: 604661919657934.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-59400',
    title: '600813023376157.jpg',
    slug: '600813023376157jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365113-935832',
    content: {
      meal: `Paylaşılan görsel: 600813023376157.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-815019',
    title: '597304917060301.jpg',
    slug: '597304917060301jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365108-788269',
    content: {
      meal: `Paylaşılan görsel: 597304917060301.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-327138',
    title: '593727434084716.jpg',
    slug: '593727434084716jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365102-708434',
    content: {
      meal: `Paylaşılan görsel: 593727434084716.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-427091',
    title: '590154347775358.jpg',
    slug: '590154347775358jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365094-680316',
    content: {
      meal: `Paylaşılan görsel: 590154347775358.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-49299',
    title: '586766171447509.jpg',
    slug: '586766171447509jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365081-786167',
    content: {
      meal: `Paylaşılan görsel: 586766171447509.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-116807',
    title: '583489778441815.jpg',
    slug: '583489778441815jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365070-356276',
    content: {
      meal: `Paylaşılan görsel: 583489778441815.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-373473',
    title: '580201195437340.jpg',
    slug: '580201195437340jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365061-215405',
    content: {
      meal: `Paylaşılan görsel: 580201195437340.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-253852',
    title: '574657405991719.jpg',
    slug: '574657405991719jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365053-750246',
    content: {
      meal: `Paylaşılan görsel: 574657405991719.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-359408',
    title: '570534843070642.jpg',
    slug: '570534843070642jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365045-11127',
    content: {
      meal: `Paylaşılan görsel: 570534843070642.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-151099',
    title: '567416716715788.jpg',
    slug: '567416716715788jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365040-264380',
    content: {
      meal: `Paylaşılan görsel: 567416716715788.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-522672',
    title: '563962980394495.jpg',
    slug: '563962980394495jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365036-964710',
    content: {
      meal: `Paylaşılan görsel: 563962980394495.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178871-916627',
    title: '563318373792289.jpg',
    slug: '563318373792289jpg',
    category: 'kutlama-kartlar',
    imageId: 'upload-1762201365028-282108',
    content: {
      meal: `Paylaşılan görsel: 563318373792289.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-474647',
    title: '560802120710581.jpg',
    slug: '560802120710581jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365023-775850',
    content: {
      meal: `Paylaşılan görsel: 560802120710581.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-631410',
    title: '557704371020356.jpg',
    slug: '557704371020356jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365019-412940',
    content: {
      meal: `Paylaşılan görsel: 557704371020356.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-828076',
    title: '553374458120014.jpg',
    slug: '553374458120014jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365011-585694',
    content: {
      meal: `Paylaşılan görsel: 553374458120014.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-599180',
    title: '4204608549663235.jpg',
    slug: '4204608549663235jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201365006-729722',
    content: {
      meal: `Paylaşılan görsel: 4204608549663235.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-557121',
    title: '4185426468248110.jpg',
    slug: '4185426468248110jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364998-961719',
    content: {
      meal: `Paylaşılan görsel: 4185426468248110.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-813604',
    title: '4167393486718075.jpg',
    slug: '4167393486718075jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364992-82258',
    content: {
      meal: `Paylaşılan görsel: 4167393486718075.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-515411',
    title: '4150712281719529.jpg',
    slug: '4150712281719529jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364982-486854',
    content: {
      meal: `Paylaşılan görsel: 4150712281719529.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-94471',
    title: '4133358206788270.jpg',
    slug: '4133358206788270jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364974-798808',
    content: {
      meal: `Paylaşılan görsel: 4133358206788270.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-674764',
    title: '4114861955304562.jpg',
    slug: '4114861955304562jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364965-884410',
    content: {
      meal: `Paylaşılan görsel: 4114861955304562.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-99699',
    title: '4085552608235497.jpg',
    slug: '4085552608235497jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364949-998158',
    content: {
      meal: `Paylaşılan görsel: 4085552608235497.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-422776',
    title: '4068173086640116.jpg',
    slug: '4068173086640116jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364941-252399',
    content: {
      meal: `Paylaşılan görsel: 4068173086640116.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-462845',
    title: '4050639001726858.jpg',
    slug: '4050639001726858jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364929-774844',
    content: {
      meal: `Paylaşılan görsel: 4050639001726858.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-441361',
    title: '4032519403538818.jpg',
    slug: '4032519403538818jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364919-627014',
    content: {
      meal: `Paylaşılan görsel: 4032519403538818.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-877735',
    title: '4014760555314703.jpg',
    slug: '4014760555314703jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364911-439264',
    content: {
      meal: `Paylaşılan görsel: 4014760555314703.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-135095',
    title: '3997005887090170.jpg',
    slug: '3997005887090170jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364904-951423',
    content: {
      meal: `Paylaşılan görsel: 3997005887090170.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-109680',
    title: '3980656858725073.jpg',
    slug: '3980656858725073jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364898-794174',
    content: {
      meal: `Paylaşılan görsel: 3980656858725073.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-241201',
    title: '3962910633833029.jpg',
    slug: '3962910633833029jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364891-431148',
    content: {
      meal: `Paylaşılan görsel: 3962910633833029.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-12262',
    title: '368645916592870.jpg',
    slug: '368645916592870jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364884-783761',
    content: {
      meal: `Paylaşılan görsel: 368645916592870.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-107725',
    title: '2114647411992703.jpg',
    slug: '2114647411992703jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364876-74022',
    content: {
      meal: `Paylaşılan görsel: 2114647411992703.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-234669',
    title: '2097558667034911.jpg',
    slug: '2097558667034911jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364870-217301',
    content: {
      meal: `Paylaşılan görsel: 2097558667034911.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-167283',
    title: '2080781665379278.jpg',
    slug: '2080781665379278jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364863-847361',
    content: {
      meal: `Paylaşılan görsel: 2080781665379278.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-640168',
    title: '2064065683717543.jpg',
    slug: '2064065683717543jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364854-445532',
    content: {
      meal: `Paylaşılan görsel: 2064065683717543.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-667241',
    title: '2031417053649073.jpg',
    slug: '2031417053649073jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364847-757200',
    content: {
      meal: `Paylaşılan görsel: 2031417053649073.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178871-915672',
    title: '1994125110711601.jpg',
    slug: '1994125110711601jpg',
    category: 'kutlama-kartlar',
    imageId: 'upload-1762201364841-527585',
    content: {
      meal: `Paylaşılan görsel: 1994125110711601.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178871-54538',
    title: '1940479502742829.jpg',
    slug: '1940479502742829jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201364836-845711',
    content: {
      meal: `Paylaşılan görsel: 1940479502742829.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178871-676793',
    title: '1940479329409513.jpg',
    slug: '1940479329409513jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201364829-872869',
    content: {
      meal: `Paylaşılan görsel: 1940479329409513.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178871-29224',
    title: '1940479142742865.jpg',
    slug: '1940479142742865jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201364822-433109',
    content: {
      meal: `Paylaşılan görsel: 1940479142742865.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178871-293938',
    title: '1940478919409554.jpg',
    slug: '1940478919409554jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201364814-54286',
    content: {
      meal: `Paylaşılan görsel: 1940478919409554.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-964767',
    title: '1781632225294225.jpg',
    slug: '1781632225294225jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364805-368275',
    content: {
      meal: `Paylaşılan görsel: 1781632225294225.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-327517',
    title: '1750354638421984.jpg',
    slug: '1750354638421984jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364799-617069',
    content: {
      meal: `Paylaşılan görsel: 1750354638421984.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-184145',
    title: '1646875008769948.jpg',
    slug: '1646875008769948jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364792-736673',
    content: {
      meal: `Paylaşılan görsel: 1646875008769948.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-906783',
    title: '1634002143390568.jpg',
    slug: '1634002143390568jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364787-637923',
    content: {
      meal: `Paylaşılan görsel: 1634002143390568.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-235499',
    title: '1620496681407781.jpg',
    slug: '1620496681407781jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364778-155771',
    content: {
      meal: `Paylaşılan görsel: 1620496681407781.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-367453',
    title: '1595841113873338.jpg',
    slug: '1595841113873338jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364771-20907',
    content: {
      meal: `Paylaşılan görsel: 1595841113873338.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-48029',
    title: '1591571734300276.jpg',
    slug: '1591571734300276jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364761-95526',
    content: {
      meal: `Paylaşılan görsel: 1591571734300276.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-128528',
    title: '1583867688404014.jpg',
    slug: '1583867688404014jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364754-935727',
    content: {
      meal: `Paylaşılan görsel: 1583867688404014.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-87565',
    title: '1571892096268240.jpg',
    slug: '1571892096268240jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364746-779272',
    content: {
      meal: `Paylaşılan görsel: 1571892096268240.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-643620',
    title: '1562821173841999.jpg',
    slug: '1562821173841999jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364738-431130',
    content: {
      meal: `Paylaşılan görsel: 1562821173841999.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-295620',
    title: '1559697037487746.jpg',
    slug: '1559697037487746jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364730-121559',
    content: {
      meal: `Paylaşılan görsel: 1559697037487746.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-172263',
    title: '1547318985392218.jpg',
    slug: '1547318985392218jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364720-621999',
    content: {
      meal: `Paylaşılan görsel: 1547318985392218.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-548536',
    title: '1535898099867640.jpg',
    slug: '1535898099867640jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364711-902276',
    content: {
      meal: `Paylaşılan görsel: 1535898099867640.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-556567',
    title: '1535801543210629.jpg',
    slug: '1535801543210629jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364700-851336',
    content: {
      meal: `Paylaşılan görsel: 1535801543210629.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-869617',
    title: '1523920451065405.jpg',
    slug: '1523920451065405jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364692-134353',
    content: {
      meal: `Paylaşılan görsel: 1523920451065405.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-423098',
    title: '1523130174477766.jpg',
    slug: '1523130174477766jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364688-33254',
    content: {
      meal: `Paylaşılan görsel: 1523130174477766.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-334533',
    title: '1512233085567475.jpg',
    slug: '1512233085567475jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364678-865325',
    content: {
      meal: `Paylaşılan görsel: 1512233085567475.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-106995',
    title: '1500417450082372.jpg',
    slug: '1500417450082372jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364671-893894',
    content: {
      meal: `Paylaşılan görsel: 1500417450082372.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-74293',
    title: '1488792724578178.jpg',
    slug: '1488792724578178jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364664-754701',
    content: {
      meal: `Paylaşılan görsel: 1488792724578178.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-752592',
    title: '1477744752349642.jpg',
    slug: '1477744752349642jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364658-29334',
    content: {
      meal: `Paylaşılan görsel: 1477744752349642.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-226979',
    title: '1466593293464788.jpg',
    slug: '1466593293464788jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364653-546877',
    content: {
      meal: `Paylaşılan görsel: 1466593293464788.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-300183',
    title: '1455536334570484.jpg',
    slug: '1455536334570484jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364646-771876',
    content: {
      meal: `Paylaşılan görsel: 1455536334570484.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-249061',
    title: '1443129269144524.jpg',
    slug: '1443129269144524jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364637-148356',
    content: {
      meal: `Paylaşılan görsel: 1443129269144524.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-851621',
    title: '1431058443684940.jpg',
    slug: '1431058443684940jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364629-206939',
    content: {
      meal: `Paylaşılan görsel: 1431058443684940.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-281328',
    title: '1418846521572799.jpg',
    slug: '1418846521572799jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364621-326726',
    content: {
      meal: `Paylaşılan görsel: 1418846521572799.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-401846',
    title: '1407170422740409.jpg',
    slug: '1407170422740409jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364614-466455',
    content: {
      meal: `Paylaşılan görsel: 1407170422740409.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-223600',
    title: '1395092277281557.jpg',
    slug: '1395092277281557jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364608-129625',
    content: {
      meal: `Paylaşılan görsel: 1395092277281557.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-628989',
    title: '1381761348614650.jpg',
    slug: '1381761348614650jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364603-791115',
    content: {
      meal: `Paylaşılan görsel: 1381761348614650.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-153277',
    title: '1368733273250791.jpg',
    slug: '1368733273250791jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364595-686443',
    content: {
      meal: `Paylaşılan görsel: 1368733273250791.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-581649',
    title: '1355403307917121.jpg',
    slug: '1355403307917121jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364590-582007',
    content: {
      meal: `Paylaşılan görsel: 1355403307917121.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-893819',
    title: '1343050659152386.jpg',
    slug: '1343050659152386jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364586-48356',
    content: {
      meal: `Paylaşılan görsel: 1343050659152386.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-877947',
    title: '1331902566933862.jpg',
    slug: '1331902566933862jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364578-842632',
    content: {
      meal: `Paylaşılan görsel: 1331902566933862.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-805376',
    title: '1330925023698283.jpg',
    slug: '1330925023698283jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364573-545034',
    content: {
      meal: `Paylaşılan görsel: 1330925023698283.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-113153',
    title: '1319204638203655.jpg',
    slug: '1319204638203655jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364567-362001',
    content: {
      meal: `Paylaşılan görsel: 1319204638203655.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-524473',
    title: '1307977772659675.jpg',
    slug: '1307977772659675jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364558-163909',
    content: {
      meal: `Paylaşılan görsel: 1307977772659675.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-542212',
    title: '1295898730534246.jpg',
    slug: '1295898730534246jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364553-184673',
    content: {
      meal: `Paylaşılan görsel: 1295898730534246.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-611173',
    title: '1284915194965933.jpg',
    slug: '1284915194965933jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364546-579890',
    content: {
      meal: `Paylaşılan görsel: 1284915194965933.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-925077',
    title: '1274313439359442.jpg',
    slug: '1274313439359442jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364541-473435',
    content: {
      meal: `Paylaşılan görsel: 1274313439359442.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-820550',
    title: '1263745723749547.jpg',
    slug: '1263745723749547jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364536-382757',
    content: {
      meal: `Paylaşılan görsel: 1263745723749547.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-508478',
    title: '1252852084838911.jpg',
    slug: '1252852084838911jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364528-934389',
    content: {
      meal: `Paylaşılan görsel: 1252852084838911.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-695319',
    title: '1242611239196329.jpg',
    slug: '1242611239196329jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364522-658113',
    content: {
      meal: `Paylaşılan görsel: 1242611239196329.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-478905',
    title: '1232278213562965.jpg',
    slug: '1232278213562965jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364517-175469',
    content: {
      meal: `Paylaşılan görsel: 1232278213562965.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-21286',
    title: '1222395814551205.jpg',
    slug: '1222395814551205jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364506-898667',
    content: {
      meal: `Paylaşılan görsel: 1222395814551205.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-286460',
    title: '1212309218893198.jpg',
    slug: '1212309218893198jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364502-196576',
    content: {
      meal: `Paylaşılan görsel: 1212309218893198.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-800622',
    title: '1202858059838314.jpg',
    slug: '1202858059838314jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364495-348294',
    content: {
      meal: `Paylaşılan görsel: 1202858059838314.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-78762',
    title: '1196543547136432.jpg',
    slug: '1196543547136432jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364491-972352',
    content: {
      meal: `Paylaşılan görsel: 1196543547136432.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-618254',
    title: '1193328884124565.jpg',
    slug: '1193328884124565jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364486-171157',
    content: {
      meal: `Paylaşılan görsel: 1193328884124565.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-155444',
    title: '1184086225048831.jpg',
    slug: '1184086225048831jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364478-712015',
    content: {
      meal: `Paylaşılan görsel: 1184086225048831.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-590230',
    title: '1174744415983012.jpg',
    slug: '1174744415983012jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364473-282864',
    content: {
      meal: `Paylaşılan görsel: 1174744415983012.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-105652',
    title: '1165174653606655.jpg',
    slug: '1165174653606655jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364467-505412',
    content: {
      meal: `Paylaşılan görsel: 1165174653606655.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-828173',
    title: '1155788077878646.jpg',
    slug: '1155788077878646jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364458-525160',
    content: {
      meal: `Paylaşılan görsel: 1155788077878646.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-120460',
    title: '1146463785477742.jpg',
    slug: '1146463785477742jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364448-322602',
    content: {
      meal: `Paylaşılan görsel: 1146463785477742.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-850489',
    title: '1137199046404216.jpg',
    slug: '1137199046404216jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364442-210849',
    content: {
      meal: `Paylaşılan görsel: 1137199046404216.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-918902',
    title: '1127439957380125.jpg',
    slug: '1127439957380125jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364438-199265',
    content: {
      meal: `Paylaşılan görsel: 1127439957380125.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-535178',
    title: '1117820021675452.jpg',
    slug: '1117820021675452jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364435-427683',
    content: {
      meal: `Paylaşılan görsel: 1117820021675452.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-67645',
    title: '1108172729306848.jpg',
    slug: '1108172729306848jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364430-701929',
    content: {
      meal: `Paylaşılan görsel: 1108172729306848.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-604861',
    title: '1104498716340916.jpg',
    slug: '1104498716340916jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364426-697314',
    content: {
      meal: `Paylaşılan görsel: 1104498716340916.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-213716',
    title: '1099519870172134.jpg',
    slug: '1099519870172134jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364423-592858',
    content: {
      meal: `Paylaşılan görsel: 1099519870172134.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-391407',
    title: '1098956456895142.jpg',
    slug: '1098956456895142jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364420-68881',
    content: {
      meal: `Paylaşılan görsel: 1098956456895142.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-914004',
    title: '1090114531112668.jpg',
    slug: '1090114531112668jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364417-49099',
    content: {
      meal: `Paylaşılan görsel: 1090114531112668.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-103169',
    title: '1081237845333670.jpg',
    slug: '1081237845333670jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364409-287101',
    content: {
      meal: `Paylaşılan görsel: 1081237845333670.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-966771',
    title: '1072178812906240.jpg',
    slug: '1072178812906240jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364406-601268',
    content: {
      meal: `Paylaşılan görsel: 1072178812906240.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-123446',
    title: '1063813690409419.jpg',
    slug: '1063813690409419jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364403-171153',
    content: {
      meal: `Paylaşılan görsel: 1063813690409419.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-44492',
    title: '1055708087886646.jpg',
    slug: '1055708087886646jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364400-777646',
    content: {
      meal: `Paylaşılan görsel: 1055708087886646.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-713051',
    title: '1047812752009513.jpg',
    slug: '1047812752009513jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364394-484592',
    content: {
      meal: `Paylaşılan görsel: 1047812752009513.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-239800',
    title: '1047314425392679.jpg',
    slug: '1047314425392679jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364391-296185',
    content: {
      meal: `Paylaşılan görsel: 1047314425392679.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-644552',
    title: '1039645906159531.jpg',
    slug: '1039645906159531jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364388-35728',
    content: {
      meal: `Paylaşılan görsel: 1039645906159531.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-596734',
    title: '1032001163590672.jpg',
    slug: '1032001163590672jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364385-6287',
    content: {
      meal: `Paylaşılan görsel: 1032001163590672.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-974294',
    title: '1029184527205669.jpg',
    slug: '1029184527205669jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364381-115282',
    content: {
      meal: `Paylaşılan görsel: 1029184527205669.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-649938',
    title: '1024192264371562.jpg',
    slug: '1024192264371562jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364376-698368',
    content: {
      meal: `Paylaşılan görsel: 1024192264371562.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-841478',
    title: '1016511991806256.jpg',
    slug: '1016511991806256jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364373-149592',
    content: {
      meal: `Paylaşılan görsel: 1016511991806256.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-973008',
    title: '1009161052541350.jpg',
    slug: '1009161052541350jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364370-70415',
    content: {
      meal: `Paylaşılan görsel: 1009161052541350.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-538973',
    title: '1002748129849309.jpg',
    slug: '1002748129849309jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364366-23914',
    content: {
      meal: `Paylaşılan görsel: 1002748129849309.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-757419',
    title: '1002084686582320.jpg',
    slug: '1002084686582320jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201364360-514620',
    content: {
      meal: `Paylaşılan görsel: 1002084686582320.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-549839',
    title: '549365588520901.jpg',
    slug: '549365588520901jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141303-567783',
    content: {
      meal: `Paylaşılan görsel: 549365588520901.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-187731',
    title: '545397358917724.jpg',
    slug: '545397358917724jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141293-512852',
    content: {
      meal: `Paylaşılan görsel: 545397358917724.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-50451',
    title: '541624562628337.jpg',
    slug: '541624562628337jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141288-193886',
    content: {
      meal: `Paylaşılan görsel: 541624562628337.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-129134',
    title: '537846296339497.jpg',
    slug: '537846296339497jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141277-551964',
    content: {
      meal: `Paylaşılan görsel: 537846296339497.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-852382',
    title: '534628006661326.jpg',
    slug: '534628006661326jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141272-590070',
    content: {
      meal: `Paylaşılan görsel: 534628006661326.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-475811',
    title: '531383823652411.jpg',
    slug: '531383823652411jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141265-354529',
    content: {
      meal: `Paylaşılan görsel: 531383823652411.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-95699',
    title: '528992227224904.jpg',
    slug: '528992227224904jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141257-485271',
    content: {
      meal: `Paylaşılan görsel: 528992227224904.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-307490',
    title: '527936707330456.jpg',
    slug: '527936707330456jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141248-79055',
    content: {
      meal: `Paylaşılan görsel: 527936707330456.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-290272',
    title: '527227604068033.jpg',
    slug: '527227604068033jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141242-805689',
    content: {
      meal: `Paylaşılan görsel: 527227604068033.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-209732',
    title: '524510141006446.jpg',
    slug: '524510141006446jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141238-154633',
    content: {
      meal: `Paylaşılan görsel: 524510141006446.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-702649',
    title: '521127238011403.jpg',
    slug: '521127238011403jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141231-814891',
    content: {
      meal: `Paylaşılan görsel: 521127238011403.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-999628',
    title: '518050301652430.jpg',
    slug: '518050301652430jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141223-837859',
    content: {
      meal: `Paylaşılan görsel: 518050301652430.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-90807',
    title: '517779601679500.jpg',
    slug: '517779601679500jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141217-770604',
    content: {
      meal: `Paylaşılan görsel: 517779601679500.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-587919',
    title: '516099135180880.jpg',
    slug: '516099135180880jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141210-700153',
    content: {
      meal: `Paylaşılan görsel: 516099135180880.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-536341',
    title: '515451855245608.jpg',
    slug: '515451855245608jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141205-78437',
    content: {
      meal: `Paylaşılan görsel: 515451855245608.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-210441',
    title: '511178445672949.jpg',
    slug: '511178445672949jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141197-194503',
    content: {
      meal: `Paylaşılan görsel: 511178445672949.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-911952',
    title: '506865922770868.jpg',
    slug: '506865922770868jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141190-415284',
    content: {
      meal: `Paylaşılan görsel: 506865922770868.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-162102',
    title: '505831679540959.jpg',
    slug: '505831679540959jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141182-312769',
    content: {
      meal: `Paylaşılan görsel: 505831679540959.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-949934',
    title: '502516339872493.jpg',
    slug: '502516339872493jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141176-776275',
    content: {
      meal: `Paylaşılan görsel: 502516339872493.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-298624',
    title: '498628930261234.jpg',
    slug: '498628930261234jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141170-452899',
    content: {
      meal: `Paylaşılan görsel: 498628930261234.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-983190',
    title: '496149483842512.jpg',
    slug: '496149483842512jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141159-102825',
    content: {
      meal: `Paylaşılan görsel: 496149483842512.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-127752',
    title: '494613273996133.jpg',
    slug: '494613273996133jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141148-275127',
    content: {
      meal: `Paylaşılan görsel: 494613273996133.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-422728',
    title: '490157837775010.jpg',
    slug: '490157837775010jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141137-674647',
    content: {
      meal: `Paylaşılan görsel: 490157837775010.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-460019',
    title: '485835701540557.jpg',
    slug: '485835701540557jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141127-174029',
    content: {
      meal: `Paylaşılan görsel: 485835701540557.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-527489',
    title: '482110645246396.jpg',
    slug: '482110645246396jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141122-455716',
    content: {
      meal: `Paylaşılan görsel: 482110645246396.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-651556',
    title: '481821071942020.jpg',
    slug: '481821071942020jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141115-814210',
    content: {
      meal: `Paylaşılan görsel: 481821071942020.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-254808',
    title: '478826568908137.jpg',
    slug: '478826568908137jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141108-55959',
    content: {
      meal: `Paylaşılan görsel: 478826568908137.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178871-76372',
    title: '476323149158479.jpg',
    slug: '476323149158479jpg',
    category: 'kutlama-kartlar',
    imageId: 'upload-1762201141098-287861',
    content: {
      meal: `Paylaşılan görsel: 476323149158479.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-443625',
    title: '475606189230175.jpg',
    slug: '475606189230175jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141089-496741',
    content: {
      meal: `Paylaşılan görsel: 475606189230175.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-161818',
    title: '472705859520208.jpg',
    slug: '472705859520208jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141082-962425',
    content: {
      meal: `Paylaşılan görsel: 472705859520208.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-41537',
    title: '469370713187056.jpg',
    slug: '469370713187056jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141072-544732',
    content: {
      meal: `Paylaşılan görsel: 469370713187056.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-394728',
    title: '466119380178856.jpg',
    slug: '466119380178856jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141059-330943',
    content: {
      meal: `Paylaşılan görsel: 466119380178856.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178871-600619',
    title: '463365997120861.jpg',
    slug: '463365997120861jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141052-753206',
    content: {
      meal: `Paylaşılan görsel: 463365997120861.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-956543',
    title: '462877717169689.jpg',
    slug: '462877717169689jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141043-609546',
    content: {
      meal: `Paylaşılan görsel: 462877717169689.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-933253',
    title: '460072274116900.jpg',
    slug: '460072274116900jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141038-306452',
    content: {
      meal: `Paylaşılan görsel: 460072274116900.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-472801',
    title: '456771727780288.jpg',
    slug: '456771727780288jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141030-848223',
    content: {
      meal: `Paylaşılan görsel: 456771727780288.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-491598',
    title: '452639201526874.jpg',
    slug: '452639201526874jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141024-753983',
    content: {
      meal: `Paylaşılan görsel: 452639201526874.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-359333',
    title: '448834118574049.jpg',
    slug: '448834118574049jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141020-515416',
    content: {
      meal: `Paylaşılan görsel: 448834118574049.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-302391',
    title: '446004488857012.jpg',
    slug: '446004488857012jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141010-86843',
    content: {
      meal: `Paylaşılan görsel: 446004488857012.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-523903',
    title: '443555849101876.jpg',
    slug: '443555849101876jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201141006-408237',
    content: {
      meal: `Paylaşılan görsel: 443555849101876.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-768361',
    title: '440982322692562.jpg',
    slug: '440982322692562jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140999-972519',
    content: {
      meal: `Paylaşılan görsel: 440982322692562.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-865253',
    title: '438490509608410.jpg',
    slug: '438490509608410jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140992-550986',
    content: {
      meal: `Paylaşılan görsel: 438490509608410.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-464994',
    title: '436017313189063.jpg',
    slug: '436017313189063jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140987-34533',
    content: {
      meal: `Paylaşılan görsel: 436017313189063.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-87861',
    title: '434932059964255.jpg',
    slug: '434932059964255jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140977-794949',
    content: {
      meal: `Paylaşılan görsel: 434932059964255.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-298418',
    title: '434441896679938.jpg',
    slug: '434441896679938jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140971-324369',
    content: {
      meal: `Paylaşılan görsel: 434441896679938.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-293953',
    title: '432747980182663.jpg',
    slug: '432747980182663jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140964-146707',
    content: {
      meal: `Paylaşılan görsel: 432747980182663.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-143425',
    title: '429781247146003.jpg',
    slug: '429781247146003jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140956-158455',
    content: {
      meal: `Paylaşılan görsel: 429781247146003.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-955361',
    title: '426573020800159.jpg',
    slug: '426573020800159jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140947-204951',
    content: {
      meal: `Paylaşılan görsel: 426573020800159.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-54671',
    title: '422157631241698.jpg',
    slug: '422157631241698jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140939-836225',
    content: {
      meal: `Paylaşılan görsel: 422157631241698.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-864641',
    title: '415549658569162.jpg',
    slug: '415549658569162jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140929-630164',
    content: {
      meal: `Paylaşılan görsel: 415549658569162.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-874088',
    title: '410020089122119.jpg',
    slug: '410020089122119jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140923-934367',
    content: {
      meal: `Paylaşılan görsel: 410020089122119.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-207964',
    title: '406411522816309.jpg',
    slug: '406411522816309jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140915-23496',
    content: {
      meal: `Paylaşılan görsel: 406411522816309.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-126541',
    title: '403625423094919.jpg',
    slug: '403625423094919jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140907-32390',
    content: {
      meal: `Paylaşılan görsel: 403625423094919.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-653595',
    title: '401045770019551.jpg',
    slug: '401045770019551jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140900-207208',
    content: {
      meal: `Paylaşılan görsel: 401045770019551.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-799257',
    title: '399488080175320.jpg',
    slug: '399488080175320jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140890-517753',
    content: {
      meal: `Paylaşılan görsel: 399488080175320.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-169103',
    title: '398424610281667.jpg',
    slug: '398424610281667jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140881-120225',
    content: {
      meal: `Paylaşılan görsel: 398424610281667.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-735108',
    title: '395325153924946.jpg',
    slug: '395325153924946jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140873-977136',
    content: {
      meal: `Paylaşılan görsel: 395325153924946.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-392524',
    title: '3945334118924014.jpg',
    slug: '3945334118924014jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140865-846505',
    content: {
      meal: `Paylaşılan görsel: 3945334118924014.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-418688',
    title: '3928535760603850.jpg',
    slug: '3928535760603850jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140855-741919',
    content: {
      meal: `Paylaşılan görsel: 3928535760603850.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-818758',
    title: '3927220060735420.jpg',
    slug: '3927220060735420jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140840-357604',
    content: {
      meal: `Paylaşılan görsel: 3927220060735420.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-539756',
    title: '392441287546666.jpg',
    slug: '392441287546666jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140827-20959',
    content: {
      meal: `Paylaşılan görsel: 392441287546666.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-939369',
    title: '3907883409335752.jpg',
    slug: '3907883409335752jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140815-461076',
    content: {
      meal: `Paylaşılan görsel: 3907883409335752.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-274743',
    title: '389742927816502.jpg',
    slug: '389742927816502jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140807-771215',
    content: {
      meal: `Paylaşılan görsel: 389742927816502.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-896779',
    title: '3889343064523120.jpg',
    slug: '3889343064523120jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140801-809437',
    content: {
      meal: `Paylaşılan görsel: 3889343064523120.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-540076',
    title: '388056034651858.jpg',
    slug: '388056034651858jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140794-337291',
    content: {
      meal: `Paylaşılan görsel: 388056034651858.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-328814',
    title: '387816678009127.jpg',
    slug: '387816678009127jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140786-841784',
    content: {
      meal: `Paylaşılan görsel: 387816678009127.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-472828',
    title: '3871793396278087.jpg',
    slug: '3871793396278087jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140775-79912',
    content: {
      meal: `Paylaşılan görsel: 3871793396278087.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-289107',
    title: '386177688173026.jpg',
    slug: '386177688173026jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140768-894847',
    content: {
      meal: `Paylaşılan görsel: 386177688173026.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-343651',
    title: '3854753811315379.jpg',
    slug: '3854753811315379jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140760-124303',
    content: {
      meal: `Paylaşılan görsel: 3854753811315379.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-787641',
    title: '3836895586434535.jpg',
    slug: '3836895586434535jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140755-539652',
    content: {
      meal: `Paylaşılan görsel: 3836895586434535.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-757047',
    title: '382526758538119.jpg',
    slug: '382526758538119jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140746-546746',
    content: {
      meal: `Paylaşılan görsel: 382526758538119.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-647169',
    title: '3818776941579733.jpg',
    slug: '3818776941579733jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140739-501658',
    content: {
      meal: `Paylaşılan görsel: 3818776941579733.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-505161',
    title: '3800757923381635.jpg',
    slug: '3800757923381635jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140731-253220',
    content: {
      meal: `Paylaşılan görsel: 3800757923381635.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-123517',
    title: '379631092161019.jpg',
    slug: '379631092161019jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140714-241091',
    content: {
      meal: `Paylaşılan görsel: 379631092161019.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-459500',
    title: '3782493475208080.jpg',
    slug: '3782493475208080jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140707-711647',
    content: {
      meal: `Paylaşılan görsel: 3782493475208080.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178872-761069',
    title: '3769983253125769.jpg',
    slug: '3769983253125769jpg',
    category: 'kutlama-kartlar',
    imageId: 'upload-1762201140698-337453',
    content: {
      meal: `Paylaşılan görsel: 3769983253125769.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-751572',
    title: '376719942452134.jpg',
    slug: '376719942452134jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140692-561832',
    content: {
      meal: `Paylaşılan görsel: 376719942452134.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-703824',
    title: '3765295126927915.jpg',
    slug: '3765295126927915jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140685-793866',
    content: {
      meal: `Paylaşılan görsel: 3765295126927915.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-149124',
    title: '3746921295431965.jpg',
    slug: '3746921295431965jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140677-793607',
    content: {
      meal: `Paylaşılan görsel: 3746921295431965.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-295611',
    title: '373456412778487.jpg',
    slug: '373456412778487jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140670-843448',
    content: {
      meal: `Paylaşılan görsel: 373456412778487.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-164741',
    title: '3730346773756084.jpg',
    slug: '3730346773756084jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140661-900671',
    content: {
      meal: `Paylaşılan görsel: 3730346773756084.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-531769',
    title: '3711739272283501.jpg',
    slug: '3711739272283501jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140654-876196',
    content: {
      meal: `Paylaşılan görsel: 3711739272283501.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-207623',
    title: '370699333054195.jpg',
    slug: '370699333054195jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140643-122565',
    content: {
      meal: `Paylaşılan görsel: 370699333054195.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-923543',
    title: '3695836507207111.jpg',
    slug: '3695836507207111jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140632-909683',
    content: {
      meal: `Paylaşılan görsel: 3695836507207111.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-458228',
    title: '3693127900811305.jpg',
    slug: '3693127900811305jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140626-11045',
    content: {
      meal: `Paylaşılan görsel: 3693127900811305.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-240209',
    title: '3676408592483236.jpg',
    slug: '3676408592483236jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140618-320731',
    content: {
      meal: `Paylaşılan görsel: 3676408592483236.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-857043',
    title: '366860570104738.jpg',
    slug: '366860570104738jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140605-642441',
    content: {
      meal: `Paylaşılan görsel: 366860570104738.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-855431',
    title: '3658416620949100.jpg',
    slug: '3658416620949100jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140594-541620',
    content: {
      meal: `Paylaşılan görsel: 3658416620949100.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-140118',
    title: '365459400244855.jpg',
    slug: '365459400244855jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140588-133290',
    content: {
      meal: `Paylaşılan görsel: 365459400244855.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-551171',
    title: '3640116829445746.jpg',
    slug: '3640116829445746jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140575-47547',
    content: {
      meal: `Paylaşılan görsel: 3640116829445746.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-775193',
    title: '363995807057881.jpg',
    slug: '363995807057881jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140565-24228',
    content: {
      meal: `Paylaşılan görsel: 363995807057881.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-859353',
    title: '363363817121080.jpg',
    slug: '363363817121080jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140555-808131',
    content: {
      meal: `Paylaşılan görsel: 363363817121080.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-815349',
    title: '362588327198629.jpg',
    slug: '362588327198629jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140548-512354',
    content: {
      meal: `Paylaşılan görsel: 362588327198629.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-283396',
    title: '3622667774523985.jpg',
    slug: '3622667774523985jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140540-71922',
    content: {
      meal: `Paylaşılan görsel: 3622667774523985.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-484652',
    title: '361186350672160.jpg',
    slug: '361186350672160jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140532-504675',
    content: {
      meal: `Paylaşılan görsel: 361186350672160.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-686598',
    title: '3604517129672383.jpg',
    slug: '3604517129672383jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140524-916532',
    content: {
      meal: `Paylaşılan görsel: 3604517129672383.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-187182',
    title: '359697890821006.jpg',
    slug: '359697890821006jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140515-430681',
    content: {
      meal: `Paylaşılan görsel: 359697890821006.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-249407',
    title: '3585548631569233.jpg',
    slug: '3585548631569233jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140506-801169',
    content: {
      meal: `Paylaşılan görsel: 3585548631569233.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-336085',
    title: '358234847633977.jpg',
    slug: '358234847633977jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140499-2337',
    content: {
      meal: `Paylaşılan görsel: 358234847633977.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-341007',
    title: '357406534383475.jpg',
    slug: '357406534383475jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140492-647331',
    content: {
      meal: `Paylaşılan görsel: 357406534383475.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-577369',
    title: '356790531111742.jpg',
    slug: '356790531111742jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140486-310524',
    content: {
      meal: `Paylaşılan görsel: 356790531111742.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-57629',
    title: '3566264760164287.jpg',
    slug: '3566264760164287jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140478-507704',
    content: {
      meal: `Paylaşılan görsel: 3566264760164287.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-670010',
    title: '355360584588070.jpg',
    slug: '355360584588070jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140473-984506',
    content: {
      meal: `Paylaşılan görsel: 355360584588070.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-675100',
    title: '3547887625335334.jpg',
    slug: '3547887625335334jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140459-396727',
    content: {
      meal: `Paylaşılan görsel: 3547887625335334.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-508298',
    title: '354152828042179.jpg',
    slug: '354152828042179jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140449-544572',
    content: {
      meal: `Paylaşılan görsel: 354152828042179.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-778588',
    title: '353940108063451.jpg',
    slug: '353940108063451jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140442-486413',
    content: {
      meal: `Paylaşılan görsel: 353940108063451.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-539739',
    title: '3530439617080135.jpg',
    slug: '3530439617080135jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140431-690463',
    content: {
      meal: `Paylaşılan görsel: 3530439617080135.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-509530',
    title: '352288804895248.jpg',
    slug: '352288804895248jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140424-300553',
    content: {
      meal: `Paylaşılan görsel: 352288804895248.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-990033',
    title: '3520718394718924.jpg',
    slug: '3520718394718924jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140414-770715',
    content: {
      meal: `Paylaşılan görsel: 3520718394718924.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-584350',
    title: '3514797811977649.jpg',
    slug: '3514797811977649jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140406-164222',
    content: {
      meal: `Paylaşılan görsel: 3514797811977649.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-186971',
    title: '3508973832560047.jpg',
    slug: '3508973832560047jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140393-509436',
    content: {
      meal: `Paylaşılan görsel: 3508973832560047.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-302384',
    title: '350677821723013.jpg',
    slug: '350677821723013jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140377-393936',
    content: {
      meal: `Paylaşılan görsel: 350677821723013.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-493721',
    title: '3496287230495374.jpg',
    slug: '3496287230495374jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140372-998083',
    content: {
      meal: `Paylaşılan görsel: 3496287230495374.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-143513',
    title: '349255005198628.jpg',
    slug: '349255005198628jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140364-654277',
    content: {
      meal: `Paylaşılan görsel: 349255005198628.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-852647',
    title: '349254485198680.jpg',
    slug: '349254485198680jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140352-617635',
    content: {
      meal: `Paylaşılan görsel: 349254485198680.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-308231',
    title: '3480085502115547.jpg',
    slug: '3480085502115547jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140339-991209',
    content: {
      meal: `Paylaşılan görsel: 3480085502115547.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-413334',
    title: '347520138705448.jpg',
    slug: '347520138705448jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140331-309775',
    content: {
      meal: `Paylaşılan görsel: 347520138705448.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-158898',
    title: '3463786590412105.jpg',
    slug: '3463786590412105jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140324-768250',
    content: {
      meal: `Paylaşılan görsel: 3463786590412105.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-650597',
    title: '346060352184760.jpg',
    slug: '346060352184760jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140315-120373',
    content: {
      meal: `Paylaşılan görsel: 346060352184760.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-625313',
    title: '3446883332102431.jpg',
    slug: '3446883332102431jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140307-210607',
    content: {
      meal: `Paylaşılan görsel: 3446883332102431.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-551716',
    title: '344596018997860.jpg',
    slug: '344596018997860jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140298-707054',
    content: {
      meal: `Paylaşılan görsel: 344596018997860.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-599495',
    title: '343268885797240.jpg',
    slug: '343268885797240jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140290-591413',
    content: {
      meal: `Paylaşılan görsel: 343268885797240.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-684827',
    title: '3430468307077267.jpg',
    slug: '3430468307077267jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140283-583156',
    content: {
      meal: `Paylaşılan görsel: 3430468307077267.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-574215',
    title: '341799965944132.jpg',
    slug: '341799965944132jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140275-570435',
    content: {
      meal: `Paylaşılan görsel: 341799965944132.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-417161',
    title: '341674769289985.png',
    slug: '341674769289985png',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140265-586820',
    content: {
      meal: `Paylaşılan görsel: 341674769289985.png`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-81236',
    title: '341674692623326.jpg',
    slug: '341674692623326jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140256-933637',
    content: {
      meal: `Paylaşılan görsel: 341674692623326.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-344821',
    title: '341674632623332.jpg',
    slug: '341674632623332jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140247-319729',
    content: {
      meal: `Paylaşılan görsel: 341674632623332.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-974139',
    title: '341674602623335.jpg',
    slug: '341674602623335jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140242-334420',
    content: {
      meal: `Paylaşılan görsel: 341674602623335.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-182139',
    title: '341674575956671.jpg',
    slug: '341674575956671jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140233-676017',
    content: {
      meal: `Paylaşılan görsel: 341674575956671.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-144351',
    title: '341674452623350.jpg',
    slug: '341674452623350jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140225-604375',
    content: {
      meal: `Paylaşılan görsel: 341674452623350.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-52377',
    title: '341674175956711.jpg',
    slug: '341674175956711jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140220-181042',
    content: {
      meal: `Paylaşılan görsel: 341674175956711.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-59908',
    title: '341674129290049.jpg',
    slug: '341674129290049jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140212-927944',
    content: {
      meal: `Paylaşılan görsel: 341674129290049.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-606959',
    title: '341674055956723.jpg',
    slug: '341674055956723jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140207-289861',
    content: {
      meal: `Paylaşılan görsel: 341674055956723.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-780329',
    title: '341673982623397.jpg',
    slug: '341673982623397jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140200-764447',
    content: {
      meal: `Paylaşılan görsel: 341673982623397.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-124153',
    title: '341673895956739.jpg',
    slug: '341673895956739jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140194-206431',
    content: {
      meal: `Paylaşılan görsel: 341673895956739.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-778451',
    title: '341673849290077.jpg',
    slug: '341673849290077jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140185-148436',
    content: {
      meal: `Paylaşılan görsel: 341673849290077.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-497177',
    title: '341673769290085.jpg',
    slug: '341673769290085jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140177-951185',
    content: {
      meal: `Paylaşılan görsel: 341673769290085.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-54441',
    title: '341673695956759.jpg',
    slug: '341673695956759jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140167-565642',
    content: {
      meal: `Paylaşılan görsel: 341673695956759.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-418019',
    title: '341673609290101.jpg',
    slug: '341673609290101jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140158-81748',
    content: {
      meal: `Paylaşılan görsel: 341673609290101.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-110283',
    title: '341673572623438.jpg',
    slug: '341673572623438jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140152-956774',
    content: {
      meal: `Paylaşılan görsel: 341673572623438.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-899219',
    title: '341673519290110.jpg',
    slug: '341673519290110jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140143-780615',
    content: {
      meal: `Paylaşılan görsel: 341673519290110.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-285004',
    title: '341673465956782.jpg',
    slug: '341673465956782jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140139-148253',
    content: {
      meal: `Paylaşılan görsel: 341673465956782.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-967562',
    title: '341673402623455.jpg',
    slug: '341673402623455jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140132-83048',
    content: {
      meal: `Paylaşılan görsel: 341673402623455.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-799063',
    title: '341673329290129.jpg',
    slug: '341673329290129jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140125-710046',
    content: {
      meal: `Paylaşılan görsel: 341673329290129.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-762242',
    title: '341673225956806.jpg',
    slug: '341673225956806jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140115-761274',
    content: {
      meal: `Paylaşılan görsel: 341673225956806.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-896550',
    title: '3414518198672278.jpg',
    slug: '3414518198672278jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140107-856309',
    content: {
      meal: `Paylaşılan görsel: 3414518198672278.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-544874',
    title: '3413277418796356.jpg',
    slug: '3413277418796356jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140097-404437',
    content: {
      meal: `Paylaşılan görsel: 3413277418796356.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-517295',
    title: '341300792660716.jpg',
    slug: '341300792660716jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140090-874482',
    content: {
      meal: `Paylaşılan görsel: 341300792660716.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-188',
    title: '341300695994059.jpg',
    slug: '341300695994059jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140084-649313',
    content: {
      meal: `Paylaşılan görsel: 341300695994059.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-570097',
    title: '341300565994072.jpg',
    slug: '341300565994072jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140076-11298',
    content: {
      meal: `Paylaşılan görsel: 341300565994072.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-250137',
    title: '341300475994081.jpg',
    slug: '341300475994081jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140072-393926',
    content: {
      meal: `Paylaşılan görsel: 341300475994081.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-648827',
    title: '341300239327438.jpg',
    slug: '341300239327438jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140065-339174',
    content: {
      meal: `Paylaşılan görsel: 341300239327438.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-905999',
    title: '341300135994115.jpg',
    slug: '341300135994115jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140059-872056',
    content: {
      meal: `Paylaşılan görsel: 341300135994115.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-998316',
    title: '341300002660795.jpg',
    slug: '341300002660795jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140054-551970',
    content: {
      meal: `Paylaşılan görsel: 341300002660795.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-216006',
    title: '341299925994136.jpg',
    slug: '341299925994136jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140045-550169',
    content: {
      meal: `Paylaşılan görsel: 341299925994136.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-645862',
    title: '341299789327483.jpg',
    slug: '341299789327483jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140035-6459',
    content: {
      meal: `Paylaşılan görsel: 341299789327483.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-890252',
    title: '341299715994157.jpg',
    slug: '341299715994157jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140024-226642',
    content: {
      meal: `Paylaşılan görsel: 341299715994157.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-133735',
    title: '341299635994165.jpg',
    slug: '341299635994165jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140017-798762',
    content: {
      meal: `Paylaşılan görsel: 341299635994165.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-713901',
    title: '341299555994173.jpg',
    slug: '341299555994173jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201140008-410314',
    content: {
      meal: `Paylaşılan görsel: 341299555994173.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-800286',
    title: '341299469327515.jpg',
    slug: '341299469327515jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139993-860323',
    content: {
      meal: `Paylaşılan görsel: 341299469327515.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-267050',
    title: '341299342660861.jpg',
    slug: '341299342660861jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139988-956917',
    content: {
      meal: `Paylaşılan görsel: 341299342660861.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-865178',
    title: '341299275994201.jpg',
    slug: '341299275994201jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139980-425823',
    content: {
      meal: `Paylaşılan görsel: 341299275994201.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-674541',
    title: '341297249327737.jpg',
    slug: '341297249327737jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139972-200419',
    content: {
      meal: `Paylaşılan görsel: 341297249327737.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-450037',
    title: '341297155994413.jpg',
    slug: '341297155994413jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139965-212555',
    content: {
      meal: `Paylaşılan görsel: 341297155994413.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-654430',
    title: '341297022661093.jpg',
    slug: '341297022661093jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139957-498295',
    content: {
      meal: `Paylaşılan görsel: 341297022661093.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-97376',
    title: '341296222661173.jpg',
    slug: '341296222661173jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139951-107441',
    content: {
      meal: `Paylaşılan görsel: 341296222661173.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-784980',
    title: '341296172661178.jpg',
    slug: '341296172661178jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139943-119137',
    content: {
      meal: `Paylaşılan görsel: 341296172661178.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-692990',
    title: '341296049327857.jpg',
    slug: '341296049327857jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139939-22374',
    content: {
      meal: `Paylaşılan görsel: 341296049327857.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-225464',
    title: '341295992661196.jpg',
    slug: '341295992661196jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139932-211649',
    content: {
      meal: `Paylaşılan görsel: 341295992661196.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-118266',
    title: '341295915994537.jpg',
    slug: '341295915994537jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139926-623304',
    content: {
      meal: `Paylaşılan görsel: 341295915994537.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-533940',
    title: '341295692661226.jpg',
    slug: '341295692661226jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139921-222054',
    content: {
      meal: `Paylaşılan görsel: 341295692661226.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-307422',
    title: '341294889327973.jpg',
    slug: '341294889327973jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139911-874099',
    content: {
      meal: `Paylaşılan görsel: 341294889327973.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-174208',
    title: '341294642661331.jpg',
    slug: '341294642661331jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139906-363177',
    content: {
      meal: `Paylaşılan görsel: 341294642661331.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-715501',
    title: '341294402661355.jpg',
    slug: '341294402661355jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139898-540630',
    content: {
      meal: `Paylaşılan görsel: 341294402661355.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-117034',
    title: '341294289328033.jpg',
    slug: '341294289328033jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139889-747481',
    content: {
      meal: `Paylaşılan görsel: 341294289328033.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-14122',
    title: '341294229328039.jpg',
    slug: '341294229328039jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139877-851106',
    content: {
      meal: `Paylaşılan görsel: 341294229328039.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-661326',
    title: '341294075994721.jpg',
    slug: '341294075994721jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139871-807182',
    content: {
      meal: `Paylaşılan görsel: 341294075994721.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-667321',
    title: '341293982661397.jpg',
    slug: '341293982661397jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139861-879066',
    content: {
      meal: `Paylaşılan görsel: 341293982661397.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-586422',
    title: '341290829328379.jpg',
    slug: '341290829328379jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139855-455553',
    content: {
      meal: `Paylaşılan görsel: 341290829328379.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-631877',
    title: '341290795995049.jpg',
    slug: '341290795995049jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139840-429473',
    content: {
      meal: `Paylaşılan görsel: 341290795995049.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-427018',
    title: '341290739328388.jpg',
    slug: '341290739328388jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139823-715976',
    content: {
      meal: `Paylaşılan görsel: 341290739328388.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-405076',
    title: '341290689328393.jpg',
    slug: '341290689328393jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139815-315388',
    content: {
      meal: `Paylaşılan görsel: 341290689328393.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-472559',
    title: '341290615995067.jpg',
    slug: '341290615995067jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139807-117158',
    content: {
      meal: `Paylaşılan görsel: 341290615995067.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-520213',
    title: '341290529328409.jpg',
    slug: '341290529328409jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139799-385420',
    content: {
      meal: `Paylaşılan görsel: 341290529328409.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-41646',
    title: '341290402661755.jpg',
    slug: '341290402661755jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139791-106592',
    content: {
      meal: `Paylaşılan görsel: 341290402661755.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-318999',
    title: '341290325995096.jpg',
    slug: '341290325995096jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139781-443678',
    content: {
      meal: `Paylaşılan görsel: 341290325995096.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-983397',
    title: '341290092661786.jpg',
    slug: '341290092661786jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139773-290329',
    content: {
      meal: `Paylaşılan görsel: 341290092661786.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-842936',
    title: '341289979328464.jpg',
    slug: '341289979328464jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139765-107989',
    content: {
      meal: `Paylaşılan görsel: 341289979328464.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-566854',
    title: '341289845995144.jpg',
    slug: '341289845995144jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139757-203348',
    content: {
      meal: `Paylaşılan görsel: 341289845995144.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-198371',
    title: '341289782661817.jpg',
    slug: '341289782661817jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139750-50136',
    content: {
      meal: `Paylaşılan görsel: 341289782661817.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-235149',
    title: '341289552661840.jpg',
    slug: '341289552661840jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139741-901833',
    content: {
      meal: `Paylaşılan görsel: 341289552661840.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-540158',
    title: '341289489328513.jpg',
    slug: '341289489328513jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139733-435956',
    content: {
      meal: `Paylaşılan görsel: 341289489328513.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-454111',
    title: '341289382661857.jpg',
    slug: '341289382661857jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139725-844049',
    content: {
      meal: `Paylaşılan görsel: 341289382661857.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-865820',
    title: '341289319328530.jpg',
    slug: '341289319328530jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139717-431356',
    content: {
      meal: `Paylaşılan görsel: 341289319328530.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-940473',
    title: '341289215995207.jpg',
    slug: '341289215995207jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139703-322105',
    content: {
      meal: `Paylaşılan görsel: 341289215995207.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-271695',
    title: '341289149328547.jpg',
    slug: '341289149328547jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139691-117808',
    content: {
      meal: `Paylaşılan görsel: 341289149328547.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-453301',
    title: '341289095995219.jpg',
    slug: '341289095995219jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139673-187980',
    content: {
      meal: `Paylaşılan görsel: 341289095995219.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-874698',
    title: '341289052661890.jpg',
    slug: '341289052661890jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139664-339678',
    content: {
      meal: `Paylaşılan görsel: 341289052661890.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-951324',
    title: '341289025995226.jpg',
    slug: '341289025995226jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139655-591443',
    content: {
      meal: `Paylaşılan görsel: 341289025995226.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-330180',
    title: '3397255547065210.jpg',
    slug: '3397255547065210jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139641-735975',
    content: {
      meal: `Paylaşılan görsel: 3397255547065210.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-710348',
    title: '3380238012100297.jpg',
    slug: '3380238012100297jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139621-454329',
    content: {
      meal: `Paylaşılan görsel: 3380238012100297.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-259873',
    title: '3369797249811040.jpg',
    slug: '3369797249811040jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139597-984730',
    content: {
      meal: `Paylaşılan görsel: 3369797249811040.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-161833',
    title: '3362626477194784.jpg',
    slug: '3362626477194784jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139569-174885',
    content: {
      meal: `Paylaşılan görsel: 3362626477194784.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-965343',
    title: '3342763489181083.jpg',
    slug: '3342763489181083jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139560-959551',
    content: {
      meal: `Paylaşılan görsel: 3342763489181083.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-844918',
    title: '3323206741136758.jpg',
    slug: '3323206741136758jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139553-58587',
    content: {
      meal: `Paylaşılan görsel: 3323206741136758.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-816720',
    title: '3303373526453413.jpg',
    slug: '3303373526453413jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139538-556432',
    content: {
      meal: `Paylaşılan görsel: 3303373526453413.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-225479',
    title: '3302360879888011.jpg',
    slug: '3302360879888011jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139527-912533',
    content: {
      meal: `Paylaşılan görsel: 3302360879888011.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-723973',
    title: '3280721092051990.jpg',
    slug: '3280721092051990jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139520-987345',
    content: {
      meal: `Paylaşılan görsel: 3280721092051990.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-678291',
    title: '3250484271742339.jpg',
    slug: '3250484271742339jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139505-422239',
    content: {
      meal: `Paylaşılan görsel: 3250484271742339.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-859341',
    title: '3236421659815267.jpg',
    slug: '3236421659815267jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139494-604599',
    content: {
      meal: `Paylaşılan görsel: 3236421659815267.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-637187',
    title: '3234383070019126.jpg',
    slug: '3234383070019126jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139482-565790',
    content: {
      meal: `Paylaşılan görsel: 3234383070019126.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-165219',
    title: '3221441757979924.jpg',
    slug: '3221441757979924jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139474-827909',
    content: {
      meal: `Paylaşılan görsel: 3221441757979924.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-816595',
    title: '3201948566595910.jpg',
    slug: '3201948566595910jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139466-588783',
    content: {
      meal: `Paylaşılan görsel: 3201948566595910.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-445380',
    title: '3182646401859460.jpg',
    slug: '3182646401859460jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139458-299407',
    content: {
      meal: `Paylaşılan görsel: 3182646401859460.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-603072',
    title: '3157791114344989.jpg',
    slug: '3157791114344989jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139453-712482',
    content: {
      meal: `Paylaşılan görsel: 3157791114344989.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-62263',
    title: '3127642490693185.jpg',
    slug: '3127642490693185jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139444-352070',
    content: {
      meal: `Paylaşılan görsel: 3127642490693185.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-29894',
    title: '3104160673041367.jpg',
    slug: '3104160673041367jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139437-779081',
    content: {
      meal: `Paylaşılan görsel: 3104160673041367.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-558443',
    title: '3083203851803716.jpg',
    slug: '3083203851803716jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139427-836927',
    content: {
      meal: `Paylaşılan görsel: 3083203851803716.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-631415',
    title: '3062226873901414.jpg',
    slug: '3062226873901414jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139418-266304',
    content: {
      meal: `Paylaşılan görsel: 3062226873901414.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-154513',
    title: '3057953554328746.jpg',
    slug: '3057953554328746jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139408-227161',
    content: {
      meal: `Paylaşılan görsel: 3057953554328746.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-1436',
    title: '3041507212640047.jpg',
    slug: '3041507212640047jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139400-589536',
    content: {
      meal: `Paylaşılan görsel: 3041507212640047.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-282080',
    title: '3021204168003685.jpg',
    slug: '3021204168003685jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139389-270111',
    content: {
      meal: `Paylaşılan görsel: 3021204168003685.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-883490',
    title: '3001556756635093.jpg',
    slug: '3001556756635093jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139378-842808',
    content: {
      meal: `Paylaşılan görsel: 3001556756635093.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-598596',
    title: '2982109718579797.jpg',
    slug: '2982109718579797jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139368-390967',
    content: {
      meal: `Paylaşılan görsel: 2982109718579797.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-884947',
    title: '2962509323873170.jpg',
    slug: '2962509323873170jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139352-241250',
    content: {
      meal: `Paylaşılan görsel: 2962509323873170.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-840038',
    title: '2950850875039015.jpg',
    slug: '2950850875039015jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139337-440560',
    content: {
      meal: `Paylaşılan görsel: 2950850875039015.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-167784',
    title: '2942745362516233.jpg',
    slug: '2942745362516233jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139319-816913',
    content: {
      meal: `Paylaşılan görsel: 2942745362516233.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-28257',
    title: '2922272304563539.jpg',
    slug: '2922272304563539jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139310-844925',
    content: {
      meal: `Paylaşılan görsel: 2922272304563539.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178872-253207',
    title: '2903312416459528.jpg',
    slug: '2903312416459528jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139293-696803',
    content: {
      meal: `Paylaşılan görsel: 2903312416459528.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-932085',
    title: '2882302861893817.jpg',
    slug: '2882302861893817jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139274-732632',
    content: {
      meal: `Paylaşılan görsel: 2882302861893817.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-981434',
    title: '2861310527326384.jpg',
    slug: '2861310527326384jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139266-386690',
    content: {
      meal: `Paylaşılan görsel: 2861310527326384.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-831193',
    title: '2841497519307685.jpg',
    slug: '2841497519307685jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139248-102391',
    content: {
      meal: `Paylaşılan görsel: 2841497519307685.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-181044',
    title: '2821293451328092.jpg',
    slug: '2821293451328092jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139236-694276',
    content: {
      meal: `Paylaşılan görsel: 2821293451328092.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-878081',
    title: '2801778866612884.jpg',
    slug: '2801778866612884jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139227-253298',
    content: {
      meal: `Paylaşılan görsel: 2801778866612884.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-169151',
    title: '2782557105201727.jpg',
    slug: '2782557105201727jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139217-387847',
    content: {
      meal: `Paylaşılan görsel: 2782557105201727.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-418962',
    title: '2763977467059691.jpg',
    slug: '2763977467059691jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139207-648281',
    content: {
      meal: `Paylaşılan görsel: 2763977467059691.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-337746',
    title: '2744436495680455.jpg',
    slug: '2744436495680455jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139199-834672',
    content: {
      meal: `Paylaşılan görsel: 2744436495680455.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-559679',
    title: '2726451410812297.jpg',
    slug: '2726451410812297jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139187-956219',
    content: {
      meal: `Paylaşılan görsel: 2726451410812297.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-673008',
    title: '2708105435980228.jpg',
    slug: '2708105435980228jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139177-463414',
    content: {
      meal: `Paylaşılan görsel: 2708105435980228.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-515818',
    title: '2700326856758086.jpg',
    slug: '2700326856758086jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139170-301940',
    content: {
      meal: `Paylaşılan görsel: 2700326856758086.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-644002',
    title: '2690216507769121.jpg',
    slug: '2690216507769121jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139160-662414',
    content: {
      meal: `Paylaşılan görsel: 2690216507769121.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-552478',
    title: '2672491226208316.jpg',
    slug: '2672491226208316jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139153-555851',
    content: {
      meal: `Paylaşılan görsel: 2672491226208316.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-484451',
    title: '2655128537944585.jpg',
    slug: '2655128537944585jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139141-39625',
    content: {
      meal: `Paylaşılan görsel: 2655128537944585.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-748395',
    title: '2637990482991724.jpg',
    slug: '2637990482991724jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139131-848299',
    content: {
      meal: `Paylaşılan görsel: 2637990482991724.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-241897',
    title: '2621438571313582.jpg',
    slug: '2621438571313582jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139125-167890',
    content: {
      meal: `Paylaşılan görsel: 2621438571313582.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-531413',
    title: '2605170496273723.jpg',
    slug: '2605170496273723jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139120-399464',
    content: {
      meal: `Paylaşılan görsel: 2605170496273723.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-122537',
    title: '2587927804664659.jpg',
    slug: '2587927804664659jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139113-758363',
    content: {
      meal: `Paylaşılan görsel: 2587927804664659.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-934338',
    title: '2569828683141238.jpg',
    slug: '2569828683141238jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139108-116814',
    content: {
      meal: `Paylaşılan görsel: 2569828683141238.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-493835',
    title: '2551560294968077.jpg',
    slug: '2551560294968077jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139103-309364',
    content: {
      meal: `Paylaşılan görsel: 2551560294968077.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-25256',
    title: '2532853566838750.jpg',
    slug: '2532853566838750jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139095-586730',
    content: {
      meal: `Paylaşılan görsel: 2532853566838750.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-875805',
    title: '2530119117112195.jpg',
    slug: '2530119117112195jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139089-374137',
    content: {
      meal: `Paylaşılan görsel: 2530119117112195.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-314971',
    title: '2518071158316991.jpg',
    slug: '2518071158316991jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139080-146341',
    content: {
      meal: `Paylaşılan görsel: 2518071158316991.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-584492',
    title: '2513466105444163.jpg',
    slug: '2513466105444163jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139075-875492',
    content: {
      meal: `Paylaşılan görsel: 2513466105444163.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-20580',
    title: '2496094577181316.jpg',
    slug: '2496094577181316jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139070-858365',
    content: {
      meal: `Paylaşılan görsel: 2496094577181316.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-853852',
    title: '2478293805628060.jpg',
    slug: '2478293805628060jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139063-998337',
    content: {
      meal: `Paylaşılan görsel: 2478293805628060.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-214157',
    title: '2460932964030811.jpg',
    slug: '2460932964030811jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139057-234884',
    content: {
      meal: `Paylaşılan görsel: 2460932964030811.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-264429',
    title: '2443349875789120.jpg',
    slug: '2443349875789120jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139050-406043',
    content: {
      meal: `Paylaşılan görsel: 2443349875789120.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-908784',
    title: '2421279087996199.jpg',
    slug: '2421279087996199jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139043-29358',
    content: {
      meal: `Paylaşılan görsel: 2421279087996199.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-82158',
    title: '2406722242785217.jpg',
    slug: '2406722242785217jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139039-49055',
    content: {
      meal: `Paylaşılan görsel: 2406722242785217.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-760733',
    title: '2403027066488068.jpg',
    slug: '2403027066488068jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139031-652112',
    content: {
      meal: `Paylaşılan görsel: 2403027066488068.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-26171',
    title: '2386741148116660.jpg',
    slug: '2386741148116660jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139026-229188',
    content: {
      meal: `Paylaşılan görsel: 2386741148116660.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-441979',
    title: '2370821316375310.jpg',
    slug: '2370821316375310jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139022-63296',
    content: {
      meal: `Paylaşılan görsel: 2370821316375310.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-474589',
    title: '2367468683377240.jpg',
    slug: '2367468683377240jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139014-117414',
    content: {
      meal: `Paylaşılan görsel: 2367468683377240.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-483450',
    title: '2363299293794179.jpg',
    slug: '2363299293794179jpg',
    category: 'kutlama-kartlar',
    imageId: 'upload-1762201139009-967194',
    content: {
      meal: `Paylaşılan görsel: 2363299293794179.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-368426',
    title: '2355258634598245.jpg',
    slug: '2355258634598245jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201139004-981555',
    content: {
      meal: `Paylaşılan görsel: 2355258634598245.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-580663',
    title: '2336441853146590.jpg',
    slug: '2336441853146590jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138995-788587',
    content: {
      meal: `Paylaşılan görsel: 2336441853146590.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-433865',
    title: '2318020938322015.jpg',
    slug: '2318020938322015jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138990-832540',
    content: {
      meal: `Paylaşılan görsel: 2318020938322015.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-738098',
    title: '2315905118533597.jpg',
    slug: '2315905118533597jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138982-353764',
    content: {
      meal: `Paylaşılan görsel: 2315905118533597.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-716618',
    title: '2301391499984959.jpg',
    slug: '2301391499984959jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138977-384158',
    content: {
      meal: `Paylaşılan görsel: 2301391499984959.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-13409',
    title: '2286566764800766.jpg',
    slug: '2286566764800766jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138972-408013',
    content: {
      meal: `Paylaşılan görsel: 2286566764800766.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-765144',
    title: '2271482092975900.jpg',
    slug: '2271482092975900jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138964-502632',
    content: {
      meal: `Paylaşılan görsel: 2271482092975900.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-201047',
    title: '2255794357878007.jpg',
    slug: '2255794357878007jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138960-358788',
    content: {
      meal: `Paylaşılan görsel: 2255794357878007.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-915660',
    title: '2239359976188112.jpg',
    slug: '2239359976188112jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138955-494064',
    content: {
      meal: `Paylaşılan görsel: 2239359976188112.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-131850',
    title: '2223171411140302.jpg',
    slug: '2223171411140302jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138947-674762',
    content: {
      meal: `Paylaşılan görsel: 2223171411140302.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-414346',
    title: '2208471089277001.jpg',
    slug: '2208471089277001jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138942-650447',
    content: {
      meal: `Paylaşılan görsel: 2208471089277001.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-328575',
    title: '2194315457359231.jpg',
    slug: '2194315457359231jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138937-118752',
    content: {
      meal: `Paylaşılan görsel: 2194315457359231.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-583604',
    title: '2179116432212467.jpg',
    slug: '2179116432212467jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138930-334227',
    content: {
      meal: `Paylaşılan görsel: 2179116432212467.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-635089',
    title: '2163596727097771.jpg',
    slug: '2163596727097771jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138925-765134',
    content: {
      meal: `Paylaşılan görsel: 2163596727097771.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-292661',
    title: '2060675810723197.jpg',
    slug: '2060675810723197jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138921-895269',
    content: {
      meal: `Paylaşılan görsel: 2060675810723197.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-917423',
    title: '2047292882061490.jpg',
    slug: '2047292882061490jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138912-892712',
    content: {
      meal: `Paylaşılan görsel: 2047292882061490.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-361294',
    title: '2038222129635232.jpg',
    slug: '2038222129635232jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138908-95544',
    content: {
      meal: `Paylaşılan görsel: 2038222129635232.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-414056',
    title: '1904669842990462.jpg',
    slug: '1904669842990462jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201138903-10696',
    content: {
      meal: `Paylaşılan görsel: 1904669842990462.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-121125',
    title: '1900548986735881.jpg',
    slug: '1900548986735881jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138896-454091',
    content: {
      meal: `Paylaşılan görsel: 1900548986735881.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-284027',
    title: '1882521015205345.jpg',
    slug: '1882521015205345jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138892-52265',
    content: {
      meal: `Paylaşılan görsel: 1882521015205345.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-530192',
    title: '1864644600326320.jpg',
    slug: '1864644600326320jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138887-940395',
    content: {
      meal: `Paylaşılan görsel: 1864644600326320.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-496370',
    title: '1847832775340836.jpg',
    slug: '1847832775340836jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138879-989333',
    content: {
      meal: `Paylaşılan görsel: 1847832775340836.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-459970',
    title: '1832006790256768.jpg',
    slug: '1832006790256768jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138873-730644',
    content: {
      meal: `Paylaşılan görsel: 1832006790256768.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-11038',
    title: '1831032093687571.jpg',
    slug: '1831032093687571jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138866-5237',
    content: {
      meal: `Paylaşılan görsel: 1831032093687571.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-514778',
    title: '1814004582056989.jpg',
    slug: '1814004582056989jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138860-739470',
    content: {
      meal: `Paylaşılan görsel: 1814004582056989.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-865325',
    title: '1797749030349211.jpg',
    slug: '1797749030349211jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138856-892669',
    content: {
      meal: `Paylaşılan görsel: 1797749030349211.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-243623',
    title: '1765811110209670.jpg',
    slug: '1765811110209670jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138849-957220',
    content: {
      meal: `Paylaşılan görsel: 1765811110209670.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-111101',
    title: '1734734116650703.jpg',
    slug: '1734734116650703jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138842-217102',
    content: {
      meal: `Paylaşılan görsel: 1734734116650703.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-223015',
    title: '1719620218162093.jpg',
    slug: '1719620218162093jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138837-133891',
    content: {
      meal: `Paylaşılan görsel: 1719620218162093.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-778760',
    title: '1704694399654675.jpg',
    slug: '1704694399654675jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138828-98920',
    content: {
      meal: `Paylaşılan görsel: 1704694399654675.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-452079',
    title: '1695525837238198.jpg',
    slug: '1695525837238198jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201138821-363753',
    content: {
      meal: `Paylaşılan görsel: 1695525837238198.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-408921',
    title: '1695524837238298.jpg',
    slug: '1695524837238298jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201138812-181030',
    content: {
      meal: `Paylaşılan görsel: 1695524837238298.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-102297',
    title: '1695523493905099.jpg',
    slug: '1695523493905099jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201138807-146292',
    content: {
      meal: `Paylaşılan görsel: 1695523493905099.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-843560',
    title: '1695523123905136.jpg',
    slug: '1695523123905136jpg',
    category: 'videolar',
    imageId: 'upload-1762201138802-955540',
    content: {
      meal: `Paylaşılan görsel: 1695523123905136.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  
  {
    id: 'post-1762452178873-886398',
    title: '1695522723905176.jpg',
    slug: '1695522723905176jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201138796-794263',
    content: {
      meal: `Paylaşılan görsel: 1695522723905176.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-952519',
    title: '1695522417238540.jpg',
    slug: '1695522417238540jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201138794-574986',
    content: {
      meal: `Paylaşılan görsel: 1695522417238540.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-85095',
    title: '1695521777238604.jpg',
    slug: '1695521777238604jpg',
    category: 'fotograflar',
    imageId: 'upload-1762201138791-92076',
    content: {
      meal: `Paylaşılan görsel: 1695521777238604.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-145725',
    title: '1689967417794040.jpg',
    slug: '1689967417794040jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138788-630114',
    content: {
      meal: `Paylaşılan görsel: 1689967417794040.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-475060',
    title: '1680350445422404.jpg',
    slug: '1680350445422404jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138785-762746',
    content: {
      meal: `Paylaşılan görsel: 1680350445422404.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-171820',
    title: '1676396452484470.jpg',
    slug: '1676396452484470jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138779-158313',
    content: {
      meal: `Paylaşılan görsel: 1676396452484470.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-234807',
    title: '1671831852940930.jpg',
    slug: '1671831852940930jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138776-482118',
    content: {
      meal: `Paylaşılan görsel: 1671831852940930.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-875210',
    title: '1660573740733408.jpg',
    slug: '1660573740733408jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138774-963017',
    content: {
      meal: `Paylaşılan görsel: 1660573740733408.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178873-895788',
    title: '1651837401607042.jpg',
    slug: '1651837401607042jpg',
    category: 'kutlama-kartlar',
    imageId: 'upload-1762201138769-441180',
    content: {
      meal: `Paylaşılan görsel: 1651837401607042.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-80060',
    title: '1621162018007914.jpg',
    slug: '1621162018007914jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138763-723008',
    content: {
      meal: `Paylaşılan görsel: 1621162018007914.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-163421',
    title: '1608307059293410.jpg',
    slug: '1608307059293410jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762201138760-863440',
    content: {
      meal: `Paylaşılan görsel: 1608307059293410.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-100696',
    title: '725942080188183.jpg',
    slug: '725942080188183jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998705-443939',
    content: {
      meal: `Paylaşılan görsel: 725942080188183.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-552867',
    title: '725941176854940.jpg',
    slug: '725941176854940jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998700-88540',
    content: {
      meal: `Paylaşılan görsel: 725941176854940.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },{
    id: 'post-1762452178873-420190',
    title: '490848867030840.jpg',
    slug: '490848867030840jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998688-442897',
    content: {
      meal: `Paylaşılan görsel: 490848867030840.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-938339',
    title: '486143144168079.jpg',
    slug: '486143144168079jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998684-101647',
    content: {
      meal: `Paylaşılan görsel: 486143144168079.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-725017',
    title: '481544024627991.jpg',
    slug: '481544024627991jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998682-919708',
    content: {
      meal: `Paylaşılan görsel: 481544024627991.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-952241',
    title: '477076295074764.jpg',
    slug: '477076295074764jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998678-286979',
    content: {
      meal: `Paylaşılan görsel: 477076295074764.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-179757',
    title: '472700742178986.jpg',
    slug: '472700742178986jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998671-75589',
    content: {
      meal: `Paylaşılan görsel: 472700742178986.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-330615',
    title: '460081810107546.jpg',
    slug: '460081810107546jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998668-898334',
    content: {
      meal: `Paylaşılan görsel: 460081810107546.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-924',
    title: '455860863862974.jpg',
    slug: '455860863862974jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998665-930555',
    content: {
      meal: `Paylaşılan görsel: 455860863862974.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-617696',
    title: '346647708117624.jpg',
    slug: '346647708117624jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998662-192208',
    content: {
      meal: `Paylaşılan görsel: 346647708117624.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-539106',
    title: '342728995176162.jpg',
    slug: '342728995176162jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998659-340718',
    content: {
      meal: `Paylaşılan görsel: 342728995176162.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-624291',
    title: '338584778923917.jpg',
    slug: '338584778923917jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998654-400207',
    content: {
      meal: `Paylaşılan görsel: 338584778923917.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-449325',
    title: '334444182671310.jpg',
    slug: '334444182671310jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998651-335132',
    content: {
      meal: `Paylaşılan görsel: 334444182671310.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-771658',
    title: '330716599710735.jpg',
    slug: '330716599710735jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998648-892085',
    content: {
      meal: `Paylaşılan görsel: 330716599710735.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-956850',
    title: '326946576754404.jpg',
    slug: '326946576754404jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998645-699486',
    content: {
      meal: `Paylaşılan görsel: 326946576754404.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-879200',
    title: '323150023800726.jpg',
    slug: '323150023800726jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998641-365490',
    content: {
      meal: `Paylaşılan görsel: 323150023800726.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-58795',
    title: '319378470844548.jpg',
    slug: '319378470844548jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998636-431934',
    content: {
      meal: `Paylaşılan görsel: 319378470844548.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-532962',
    title: '315650907883971.jpg',
    slug: '315650907883971jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998633-315522',
    content: {
      meal: `Paylaşılan görsel: 315650907883971.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-407868',
    title: '312058771576518.jpg',
    slug: '312058771576518jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998631-943143',
    content: {
      meal: `Paylaşılan görsel: 312058771576518.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-463440',
    title: '308156261966769.jpg',
    slug: '308156261966769jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998628-993439',
    content: {
      meal: `Paylaşılan görsel: 308156261966769.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-617310',
    title: '304158585699870.jpg',
    slug: '304158585699870jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998623-641965',
    content: {
      meal: `Paylaşılan görsel: 304158585699870.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-56215',
    title: '300636029385459.jpg',
    slug: '300636029385459jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998619-977019',
    content: {
      meal: `Paylaşılan görsel: 300636029385459.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-659184',
    title: '295936766522052.jpg',
    slug: '295936766522052jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998616-575252',
    content: {
      meal: `Paylaşılan görsel: 295936766522052.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-816532',
    title: '292179466897782.jpg',
    slug: '292179466897782jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998613-133593',
    content: {
      meal: `Paylaşılan görsel: 292179466897782.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-295589',
    title: '290861993696196.jpg',
    slug: '290861993696196jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998610-600059',
    content: {
      meal: `Paylaşılan görsel: 290861993696196.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-551600',
    title: '288223953960000.jpg',
    slug: '288223953960000jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998603-58041',
    content: {
      meal: `Paylaşılan görsel: 288223953960000.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-262554',
    title: '283886974393698.jpg',
    slug: '283886974393698jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998599-897667',
    content: {
      meal: `Paylaşılan görsel: 283886974393698.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-651701',
    title: '280057971443265.jpg',
    slug: '280057971443265jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998597-554452',
    content: {
      meal: `Paylaşılan görsel: 280057971443265.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-69518',
    title: '276430138472715.jpg',
    slug: '276430138472715jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998594-563459',
    content: {
      meal: `Paylaşılan görsel: 276430138472715.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-760204',
    title: '272873392161723.jpg',
    slug: '272873392161723jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998590-456659',
    content: {
      meal: `Paylaşılan görsel: 272873392161723.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-262737',
    title: '269185942530468.jpg',
    slug: '269185942530468jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998586-903138',
    content: {
      meal: `Paylaşılan görsel: 269185942530468.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-760727',
    title: '265477656234630.jpg',
    slug: '265477656234630jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998584-175872',
    content: {
      meal: `Paylaşılan görsel: 265477656234630.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-532202',
    title: '261645286617867.jpg',
    slug: '261645286617867jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998582-317277',
    content: {
      meal: `Paylaşılan görsel: 261645286617867.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-787229',
    title: '257801553668907.jpg',
    slug: '257801553668907jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998580-879193',
    content: {
      meal: `Paylaşılan görsel: 257801553668907.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-428816',
    title: '254236237358772.jpg',
    slug: '254236237358772jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998578-330470',
    content: {
      meal: `Paylaşılan görsel: 254236237358772.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-359669',
    title: '250435844405478.jpg',
    slug: '250435844405478jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998574-215850',
    content: {
      meal: `Paylaşılan görsel: 250435844405478.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-311525',
    title: '246364454812617.jpg',
    slug: '246364454812617jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998569-134889',
    content: {
      meal: `Paylaşılan görsel: 246364454812617.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-887361',
    title: '242108525238210.jpg',
    slug: '242108525238210jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998567-270155',
    content: {
      meal: `Paylaşılan görsel: 242108525238210.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-4656',
    title: '241127415336321.jpg',
    slug: '241127415336321jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998565-295477',
    content: {
      meal: `Paylaşılan görsel: 241127415336321.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-705540',
    title: '238076892308040.jpg',
    slug: '238076892308040jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998563-842608',
    content: {
      meal: `Paylaşılan görsel: 238076892308040.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-941738',
    title: '234103802705349.jpg',
    slug: '234103802705349jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998561-411366',
    content: {
      meal: `Paylaşılan görsel: 234103802705349.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-570261',
    title: '229768653138864.jpg',
    slug: '229768653138864jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998558-146689',
    content: {
      meal: `Paylaşılan görsel: 229768653138864.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-452494',
    title: '225626600219736.jpg',
    slug: '225626600219736jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998554-936939',
    content: {
      meal: `Paylaşılan görsel: 225626600219736.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-973529',
    title: '221586663957063.jpg',
    slug: '221586663957063jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998551-435329',
    content: {
      meal: `Paylaşılan görsel: 221586663957063.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-660272',
    title: '217325311049865.jpg',
    slug: '217325311049865jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998549-895558',
    content: {
      meal: `Paylaşılan görsel: 217325311049865.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-621221',
    title: '213275231454873.jpg',
    slug: '213275231454873jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998546-970433',
    content: {
      meal: `Paylaşılan görsel: 213275231454873.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-125980',
    title: '209114108537652.jpg',
    slug: '209114108537652jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998544-720208',
    content: {
      meal: `Paylaşılan görsel: 209114108537652.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-39169',
    title: '204831148965948.jpg',
    slug: '204831148965948jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998541-807992',
    content: {
      meal: `Paylaşılan görsel: 204831148965948.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-811597',
    title: '200805066035223.jpg',
    slug: '200805066035223jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998537-854314',
    content: {
      meal: `Paylaşılan görsel: 200805066035223.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-157986',
    title: '198462389602824.jpg',
    slug: '198462389602824jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998535-966254',
    content: {
      meal: `Paylaşılan görsel: 198462389602824.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-228818',
    title: '196641159784947.jpg',
    slug: '196641159784947jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998533-793843',
    content: {
      meal: `Paylaşılan görsel: 196641159784947.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-357857',
    title: '192647950184268.jpg',
    slug: '192647950184268jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998530-862835',
    content: {
      meal: `Paylaşılan görsel: 192647950184268.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-701545',
    title: '188721493910247.jpg',
    slug: '188721493910247jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998527-599636',
    content: {
      meal: `Paylaşılan görsel: 188721493910247.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-470319',
    title: '184840124298384.jpg',
    slug: '184840124298384jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998523-752814',
    content: {
      meal: `Paylaşılan görsel: 184840124298384.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-168312',
    title: '180708984711498.jpg',
    slug: '180708984711498jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998519-110302',
    content: {
      meal: `Paylaşılan görsel: 180708984711498.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-83124',
    title: '176652251783838.jpg',
    slug: '176652251783838jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998514-87396',
    content: {
      meal: `Paylaşılan görsel: 176652251783838.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-460736',
    title: '174578055324591.jpg',
    slug: '174578055324591jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998512-884266',
    content: {
      meal: `Paylaşılan görsel: 174578055324591.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-548820',
    title: '172435562205507.jpg',
    slug: '172435562205507jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998509-15238',
    content: {
      meal: `Paylaşılan görsel: 172435562205507.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-428590',
    title: '169148502534213.jpg',
    slug: '169148502534213jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998504-333057',
    content: {
      meal: `Paylaşılan görsel: 169148502534213.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-214949',
    title: '167527762696287.jpg',
    slug: '167527762696287jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998502-46214',
    content: {
      meal: `Paylaşılan görsel: 167527762696287.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-313134',
    title: '167327349382995.jpg',
    slug: '167327349382995jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998500-585496',
    content: {
      meal: `Paylaşılan görsel: 167327349382995.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-34778',
    title: '166823916100005.jpg',
    slug: '166823916100005jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998497-312794',
    content: {
      meal: `Paylaşılan görsel: 166823916100005.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-307002',
    title: '163982029717527.jpg',
    slug: '163982029717527jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998495-638335',
    content: {
      meal: `Paylaşılan görsel: 163982029717527.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-775662',
    title: '162394229876307.jpg',
    slug: '162394229876307jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998492-414708',
    content: {
      meal: `Paylaşılan görsel: 162394229876307.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-633397',
    title: '162222723226791.jpg',
    slug: '162222723226791jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200998487-815434',
    content: {
      meal: `Paylaşılan görsel: 162222723226791.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-882610',
    title: '813515291430861.webp',
    slug: '813515291430861webp',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875521-547326',
    content: {
      meal: `Paylaşılan görsel: 813515291430861.webp`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-105881',
    title: '807610795354644.webp',
    slug: '807610795354644webp',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875488-588756',
    content: {
      meal: `Paylaşılan görsel: 807610795354644.webp`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-237890',
    title: '801549422627448.jpg',
    slug: '801549422627448jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875463-476546',
    content: {
      meal: `Paylaşılan görsel: 801549422627448.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-894682',
    title: '795398339909223.jpg',
    slug: '795398339909223jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875442-541471',
    content: {
      meal: `Paylaşılan görsel: 795398339909223.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-797811',
    title: '788894297226294.jpg',
    slug: '788894297226294jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875407-239546',
    content: {
      meal: `Paylaşılan görsel: 788894297226294.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-857206',
    title: '783086291140428.jpg',
    slug: '783086291140428jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875375-438835',
    content: {
      meal: `Paylaşılan görsel: 783086291140428.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-717191',
    title: '777315991717458.jpg',
    slug: '777315991717458jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875350-240138',
    content: {
      meal: `Paylaşılan görsel: 777315991717458.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178873-128252',
    title: '771555698960154.jpg',
    slug: '771555698960154jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875338-594916',
    content: {
      meal: `Paylaşılan görsel: 771555698960154.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-809448',
    title: '766122239503500.jpg',
    slug: '766122239503500jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875318-546705',
    content: {
      meal: `Paylaşılan görsel: 766122239503500.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-884861',
    title: '765216362927421.jpg',
    slug: '765216362927421jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875302-872441',
    content: {
      meal: `Paylaşılan görsel: 765216362927421.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-480664',
    title: '760741210041603.jpg',
    slug: '760741210041603jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875292-637983',
    content: {
      meal: `Paylaşılan görsel: 760741210041603.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-52246',
    title: '755128400602884.jpg',
    slug: '755128400602884jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875278-833825',
    content: {
      meal: `Paylaşılan görsel: 755128400602884.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-616930',
    title: '749504267831964.jpg',
    slug: '749504267831964jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875268-209223',
    content: {
      meal: `Paylaşılan görsel: 749504267831964.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-563048',
    title: '743777015071356.jpg',
    slug: '743777015071356jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875255-196113',
    content: {
      meal: `Paylaşılan görsel: 743777015071356.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-860309',
    title: '738193428963048.jpg',
    slug: '738193428963048jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875229-239838',
    content: {
      meal: `Paylaşılan görsel: 738193428963048.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-90352',
    title: '732615582854166.jpg',
    slug: '732615582854166jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875192-937271',
    content: {
      meal: `Paylaşılan görsel: 732615582854166.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-406560',
    title: '727238666725191.jpg',
    slug: '727238666725191jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875166-708144',
    content: {
      meal: `Paylaşılan görsel: 727238666725191.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-967956',
    title: '725949893520735.jpg',
    slug: '725949893520735jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875155-619244',
    content: {
      meal: `Paylaşılan görsel: 725949893520735.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-695466',
    title: '725946700187721.jpg',
    slug: '725946700187721jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875140-14987',
    content: {
      meal: `Paylaşılan görsel: 725946700187721.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-145521',
    title: '725946216854436.jpg',
    slug: '725946216854436jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875128-901598',
    content: {
      meal: `Paylaşılan görsel: 725946216854436.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-97507',
    title: '725944926854565.jpg',
    slug: '725944926854565jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875111-853903',
    content: {
      meal: `Paylaşılan görsel: 725944926854565.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-620840',
    title: '725944540187937.jpg',
    slug: '725944540187937jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875103-251391',
    content: {
      meal: `Paylaşılan görsel: 725944540187937.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-629555',
    title: '725944346854623.jpg',
    slug: '725944346854623jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875089-583172',
    content: {
      meal: `Paylaşılan görsel: 725944346854623.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-38651',
    title: '725943870188004.jpg',
    slug: '725943870188004jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875077-893295',
    content: {
      meal: `Paylaşılan görsel: 725943870188004.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-952530',
    title: '725943610188030.jpg',
    slug: '725943610188030jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875061-599060',
    content: {
      meal: `Paylaşılan görsel: 725943610188030.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-843469',
    title: '725942926854765.jpg',
    slug: '725942926854765jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875043-160198',
    content: {
      meal: `Paylaşılan görsel: 725942926854765.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-549140',
    title: '725942696854788.jpg',
    slug: '725942696854788jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875030-506587',
    content: {
      meal: `Paylaşılan görsel: 725942696854788.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-107072',
    title: '725941433521581.jpg',
    slug: '725941433521581jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875025-700657',
    content: {
      meal: `Paylaşılan görsel: 725941433521581.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-554499',
    title: '725940766854981.jpg',
    slug: '725940766854981jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875018-290636',
    content: {
      meal: `Paylaşılan görsel: 725940766854981.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-730618',
    title: '725940450188346.jpg',
    slug: '725940450188346jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875010-81510',
    content: {
      meal: `Paylaşılan görsel: 725940450188346.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-851802',
    title: '725939723521752.jpg',
    slug: '725939723521752jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200875006-295846',
    content: {
      meal: `Paylaşılan görsel: 725939723521752.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-472764',
    title: '725939443521780.jpg',
    slug: '725939443521780jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874997-14828',
    content: {
      meal: `Paylaşılan görsel: 725939443521780.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-447148',
    title: '725938596855198.jpg',
    slug: '725938596855198jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874992-578883',
    content: {
      meal: `Paylaşılan görsel: 725938596855198.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-347868',
    title: '725938380188553.jpg',
    slug: '725938380188553jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874985-677025',
    content: {
      meal: `Paylaşılan görsel: 725938380188553.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-893314',
    title: '725938003521924.jpg',
    slug: '725938003521924jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874975-264582',
    content: {
      meal: `Paylaşılan görsel: 725938003521924.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-665615',
    title: '725937726855285.jpg',
    slug: '725937726855285jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874967-581139',
    content: {
      meal: `Paylaşılan görsel: 725937726855285.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-743778',
    title: '725937266855331.jpg',
    slug: '725937266855331jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874961-339852',
    content: {
      meal: `Paylaşılan görsel: 725937266855331.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-353907',
    title: '725937006855357.jpg',
    slug: '725937006855357jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874956-149432',
    content: {
      meal: `Paylaşılan görsel: 725937006855357.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-714497',
    title: '725936113522113.jpg',
    slug: '725936113522113jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874947-668155',
    content: {
      meal: `Paylaşılan görsel: 725936113522113.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-417130',
    title: '725935480188843.jpg',
    slug: '725935480188843jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874942-56782',
    content: {
      meal: `Paylaşılan görsel: 725935480188843.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-546580',
    title: '725935086855549.jpg',
    slug: '725935086855549jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874935-810489',
    content: {
      meal: `Paylaşılan görsel: 725935086855549.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-291516',
    title: '725934523522272.jpg',
    slug: '725934523522272jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874927-617197',
    content: {
      meal: `Paylaşılan görsel: 725934523522272.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-942662',
    title: '725934060188985.jpg',
    slug: '725934060188985jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874921-281362',
    content: {
      meal: `Paylaşılan görsel: 725934060188985.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-317454',
    title: '725932300189161.jpg',
    slug: '725932300189161jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874914-598109',
    content: {
      meal: `Paylaşılan görsel: 725932300189161.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-528071',
    title: '725544813561243.jpg',
    slug: '725544813561243jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874908-995144',
    content: {
      meal: `Paylaşılan görsel: 725544813561243.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-569647',
    title: '683688157746909.jpg',
    slug: '683688157746909jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874901-725578',
    content: {
      meal: `Paylaşılan görsel: 683688157746909.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-456425',
    title: '580086164773776.jpg',
    slug: '580086164773776jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874895-53406',
    content: {
      meal: `Paylaşılan görsel: 580086164773776.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-909065',
    title: '579732451475814.jpg',
    slug: '579732451475814jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874890-469908',
    content: {
      meal: `Paylaşılan görsel: 579732451475814.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-587533',
    title: '575109891938070.jpg',
    slug: '575109891938070jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874880-27024',
    content: {
      meal: `Paylaşılan görsel: 575109891938070.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-963520',
    title: '570244425757950.jpg',
    slug: '570244425757950jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874875-83170',
    content: {
      meal: `Paylaşılan görsel: 570244425757950.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-610129',
    title: '565329882916071.jpg',
    slug: '565329882916071jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874867-693714',
    content: {
      meal: `Paylaşılan görsel: 565329882916071.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-436210',
    title: '560685876713805.jpg',
    slug: '560685876713805jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874862-878580',
    content: {
      meal: `Paylaşılan görsel: 560685876713805.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-566451',
    title: '555917820523944.jpg',
    slug: '555917820523944jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874857-128323',
    content: {
      meal: `Paylaşılan görsel: 555917820523944.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-294686',
    title: '551208687661524.jpg',
    slug: '551208687661524jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874848-778825',
    content: {
      meal: `Paylaşılan görsel: 551208687661524.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-620323',
    title: '546475011468225.jpg',
    slug: '546475011468225jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874843-83266',
    content: {
      meal: `Paylaşılan görsel: 546475011468225.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-145755',
    title: '541296401986086.jpg',
    slug: '541296401986086jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874838-315977',
    content: {
      meal: `Paylaşılan görsel: 541296401986086.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-431729',
    title: '536385045810555.jpg',
    slug: '536385045810555jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874830-407727',
    content: {
      meal: `Paylaşılan görsel: 536385045810555.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-876427',
    title: '531311292984597.jpg',
    slug: '531311292984597jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874825-336295',
    content: {
      meal: `Paylaşılan görsel: 531311292984597.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-491591',
    title: '526287580153635.jpg',
    slug: '526287580153635jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874819-80846',
    content: {
      meal: `Paylaşılan görsel: 526287580153635.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-604768',
    title: '520927144023012.jpg',
    slug: '520927144023012jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874812-956132',
    content: {
      meal: `Paylaşılan görsel: 520927144023012.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-984791',
    title: '515676467881413.jpg',
    slug: '515676467881413jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874808-191028',
    content: {
      meal: `Paylaşılan görsel: 515676467881413.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-372418',
    title: '510385258410534.jpg',
    slug: '510385258410534jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874799-689151',
    content: {
      meal: `Paylaşılan görsel: 510385258410534.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-176778',
    title: '505007662281627.jpg',
    slug: '505007662281627jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874793-413059',
    content: {
      meal: `Paylaşılan görsel: 505007662281627.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-240190',
    title: '501092326006494.jpg',
    slug: '501092326006494jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874788-87902',
    content: {
      meal: `Paylaşılan görsel: 501092326006494.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-41305',
    title: '500014049447655.jpg',
    slug: '500014049447655jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874779-569375',
    content: {
      meal: `Paylaşılan görsel: 500014049447655.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-40987',
    title: '495434643238929.jpg',
    slug: '495434643238929jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874773-585310',
    content: {
      meal: `Paylaşılan görsel: 495434643238929.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-791445',
    title: '468476132601447.jpg',
    slug: '468476132601447jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874764-849086',
    content: {
      meal: `Paylaşılan görsel: 468476132601447.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-754796',
    title: '464319723017088.jpg',
    slug: '464319723017088jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874759-824768',
    content: {
      meal: `Paylaşılan görsel: 464319723017088.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-718463',
    title: '451502694298791.jpg',
    slug: '451502694298791jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874753-470492',
    content: {
      meal: `Paylaşılan görsel: 451502694298791.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-140540',
    title: '447165914732469.jpg',
    slug: '447165914732469jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874746-294903',
    content: {
      meal: `Paylaşılan görsel: 447165914732469.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-177013',
    title: '444124611703266.jpg',
    slug: '444124611703266jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874741-614890',
    content: {
      meal: `Paylaşılan görsel: 444124611703266.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-856690',
    title: '442945675154493.jpg',
    slug: '442945675154493jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874733-354118',
    content: {
      meal: `Paylaşılan görsel: 442945675154493.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-387400',
    title: '438774628904931.jpg',
    slug: '438774628904931jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874728-298104',
    content: {
      meal: `Paylaşılan görsel: 438774628904931.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-930964',
    title: '434578239324570.jpg',
    slug: '434578239324570jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874720-931111',
    content: {
      meal: `Paylaşılan görsel: 434578239324570.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-155893',
    title: '430502059732188.jpg',
    slug: '430502059732188jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874710-496946',
    content: {
      meal: `Paylaşılan görsel: 430502059732188.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-883793',
    title: '425915890190805.jpg',
    slug: '425915890190805jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874703-358722',
    content: {
      meal: `Paylaşılan görsel: 425915890190805.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-126329',
    title: '421507797298281.jpg',
    slug: '421507797298281jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874693-473008',
    content: {
      meal: `Paylaşılan görsel: 421507797298281.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-801449',
    title: '417177404397987.jpg',
    slug: '417177404397987jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874684-911606',
    content: {
      meal: `Paylaşılan görsel: 417177404397987.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-12243',
    title: '412733948175666.jpg',
    slug: '412733948175666jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874662-296486',
    content: {
      meal: `Paylaşılan görsel: 412733948175666.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-800924',
    title: '408392621943132.jpg',
    slug: '408392621943132jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874652-695420',
    content: {
      meal: `Paylaşılan görsel: 408392621943132.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-984235',
    title: '404223555693372.jpg',
    slug: '404223555693372jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874642-794715',
    content: {
      meal: `Paylaşılan görsel: 404223555693372.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-611831',
    title: '403125349136526.jpg',
    slug: '403125349136526jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874626-574469',
    content: {
      meal: `Paylaşılan görsel: 403125349136526.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178874-403247',
    title: '400152079433853.jpg',
    slug: '400152079433853jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874613-22077',
    content: {
      meal: `Paylaşılan görsel: 400152079433853.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-783344',
    title: '399976922784702.jpg',
    slug: '399976922784702jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874608-76640',
    content: {
      meal: `Paylaşılan görsel: 399976922784702.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-606510',
    title: '395609703221424.jpg',
    slug: '395609703221424jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874599-796288',
    content: {
      meal: `Paylaşılan görsel: 395609703221424.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-386539',
    title: '391355420313519.jpg',
    slug: '391355420313519jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874587-346680',
    content: {
      meal: `Paylaşılan görsel: 391355420313519.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-477920',
    title: '387455804036814.jpg',
    slug: '387455804036814jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874576-595217',
    content: {
      meal: `Paylaşılan görsel: 387455804036814.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-769297',
    title: '383599421089119.jpg',
    slug: '383599421089119jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874566-362427',
    content: {
      meal: `Paylaşılan görsel: 383599421089119.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-683978',
    title: '379647331484328.jpg',
    slug: '379647331484328jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874559-904425',
    content: {
      meal: `Paylaşılan görsel: 379647331484328.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-896669',
    title: '376623465120048.jpg',
    slug: '376623465120048jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874542-523524',
    content: {
      meal: `Paylaşılan görsel: 376623465120048.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },{
    id: 'post-1762452178875-915873',
    title: '375715375210857.jpg',
    slug: '375715375210857jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874526-732813',
    content: {
      meal: `Paylaşılan görsel: 375715375210857.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-590395',
    title: '372144402234621.jpg',
    slug: '372144402234621jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874519-993875',
    content: {
      meal: `Paylaşılan görsel: 372144402234621.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-668030',
    title: '367520436030351.jpg',
    slug: '367520436030351jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874513-581304',
    content: {
      meal: `Paylaşılan görsel: 367520436030351.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-563331',
    title: '366024949513233.jpg',
    slug: '366024949513233jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874508-264132',
    content: {
      meal: `Paylaşılan görsel: 366024949513233.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-755853',
    title: '363234719792256.jpg',
    slug: '363234719792256jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874502-770294',
    content: {
      meal: `Paylaşılan görsel: 363234719792256.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-828025',
    title: '358865156895879.jpg',
    slug: '358865156895879jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874496-551962',
    content: {
      meal: `Paylaşılan görsel: 358865156895879.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-875663',
    title: '354651283983933.jpg',
    slug: '354651283983933jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874491-653991',
    content: {
      meal: `Paylaşılan görsel: 354651283983933.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-946691',
    title: '350759784373083.jpg',
    slug: '350759784373083jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874483-326876',
    content: {
      meal: `Paylaşılan görsel: 350759784373083.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-598006',
    title: '350413437741051.jpg',
    slug: '350413437741051jpg',
    category: 'cuma-mesajlari',
    imageId: 'upload-1762200874478-263995',
    content: {
      meal: `Paylaşılan görsel: 350413437741051.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-919420',
    title: '350413437741051[1].jpg',
    slug: '3504134377410511jpg',
    category: 'cuma-mesajlari',
    imageId: 'new-1762200065863-0',
    content: {
      meal: `Paylaşılan görsel: 350413437741051[1].jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178875-178794',
    title: '1010940.jpg',
    slug: '1010940jpg',
    category: 'fotograflar',
    imageId: 'new-1762123769684',
    content: {
      meal: `Paylaşılan görsel: 1010940.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178875-38051',
    title: 'Ayasofya-i Kebir Cami-i Şerifi.jpg',
    slug: 'ayasofya-i-kebir-cami-i-erifijpg',
    category: 'fotograflar',
    imageId: 'new-1762114701769',
    content: {
      meal: `Paylaşılan görsel: Ayasofya-i Kebir Cami-i Şerifi.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  
  {
    id: 'post-1762452178875-214976',
    title: 'menu_alt.jpg',
    slug: 'menu_altjpg',
    category: 'fotograflar',
    imageId: 'new-1762114583279',
    content: {
      meal: `Paylaşılan görsel: menu_alt.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },{
    id: 'post-1762452178875-305161',
    title: 'IMG_20250715_234015.png',
    slug: 'img_20250715_234015png',
    category: 'cuma-mesajlari',
    imageId: 'new-1762092268894',
    content: {
      meal: `Paylaşılan görsel: IMG_20250715_234015.png`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-46823',
    title: 'IMG_20250715_232545.png',
    slug: 'img_20250715_232545png',
    category: 'cuma-mesajlari',
    imageId: 'new-1762076786861',
    content: {
      meal: `Paylaşılan görsel: IMG_20250715_232545.png`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-212589',
    title: 'IMG_20250715_233841.png',
    slug: 'img_20250715_233841png',
    category: 'cuma-mesajlari',
    imageId: 'new-1762065644794',
    content: {
      meal: `Paylaşılan görsel: IMG_20250715_233841.png`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-479591',
    title: '9)Cuma_9_10.jpg',
    slug: '9cuma_9_10jpg',
    category: 'cuma-mesajlari',
    imageId: 'new-1762033736211',
    content: {
      meal: `Paylaşılan görsel: 9)Cuma_9_10.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },
  {
    id: 'post-1762452178875-811575',
    title: '1)Yasin_60_61.jpg',
    slug: '1yasin_60_61jpg',
    category: 'cuma-mesajlari',
    imageId: 'new-1762033690287',
    content: {
      meal: `Paylaşılan görsel: 1)Yasin_60_61.jpg`,
      mealleri: '',
      tefsir: '',
      kisaTefsir: '',
    },
    createdAt: '2025-11-06T18:02:58.869Z',
    status: 'published'
  },];
