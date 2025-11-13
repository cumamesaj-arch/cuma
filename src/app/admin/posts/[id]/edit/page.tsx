import EditPostPageClient from "./edit-client";

export async function generateStaticParams() {
  // Admin sayfaları için boş array döndür - static olarak generate edilmez
  return [];
}

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditPostPageClient params={Promise.resolve({ id })} />;
}
