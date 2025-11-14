'use client';

import { PostCard } from './PostCard';
import type { Post } from '@/lib/types';

interface PostCardListProps {
  posts: Post[];
  priorityCount?: number; // Number of posts to prioritize (for priority prop)
}

export function PostCardList({ posts, priorityCount = 0 }: PostCardListProps) {
  return (
    <>
      {posts.map((post, index) => (
        <PostCard 
          key={post.id} 
          post={post} 
          priority={index < priorityCount}
        />
      ))}
    </>
  );
}


