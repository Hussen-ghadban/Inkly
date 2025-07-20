'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

export default function CreatePostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseUrl}/api/posts/create`, {
      method: 'POST',
          headers: { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
      body: JSON.stringify({ title, content }),
    });
    if (res.ok) {
      router.push('/posts');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-2xl font-bold">Create Post</h1>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
      <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Content" required />
      <button type="submit">Submit</button>
    </form>
  );
}
