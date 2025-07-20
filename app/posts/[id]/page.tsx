'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

interface Post {
  id: string;
  title: string;
  content: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`${baseUrl}/api/posts/${id}`);
      const data = await res.json();
      setPost(data);
    };
    fetchPost();
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <p>{post.content}</p>
      <a href={`/posts/${post.id}/edit`} className="text-blue-500 underline">Edit</a>
    </div>
  );
}
