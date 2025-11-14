import { getAllPostsData } from "@/lib/data";
import EditPostPageClient from "./edit-client";

export async function generateStaticParams() {
  // Firebase'den tüm post ID'lerini getir
  // Static export için tüm post ID'lerini döndür
  try {
    const posts = await getAllPostsData();
    return posts.map(post => ({ id: post.id }));
  } catch (error) {
    console.error('Error generating static params for edit page:', error);
    return [];
  }
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditPostPageClient params={Promise.resolve({ id })} />;
}
