'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`${baseUrl}/api/posts/${id}`);
      const data = await res.json();
      setTitle(data.title);
      setContent(data.content);
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    await fetch(`${baseUrl}/api/posts/update/${id}`, {
      method: 'PUT',
                headers: { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
      body: JSON.stringify({ title, content }),
    });
    router.push('/posts');
  };

  return (
    <form onSubmit={handleUpdate}>
      <h1 className="text-2xl font-bold">Edit Post</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea value={content} onChange={e => setContent(e.target.value)} required />
      <button type="submit">Update</button>
    </form>
  );
}
