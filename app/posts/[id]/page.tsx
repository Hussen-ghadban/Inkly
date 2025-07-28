'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit3, Calendar, Clock, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt?: string;
  author: {
    name: string;
    email?: string;
  };
  readTime?: number;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${baseUrl}/api/posts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(`Failed to load post,${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);
  
  useEffect(() => {
    const fetchPostAndIncrementViews = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/posts/view/${id}`)
        if (!res.ok) throw new Error('Failed to fetch post')

        // const data = await res.json()
      } catch (err) {
        console.error(err)
      }
    }

    fetchPostAndIncrementViews()
  }, [id])
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            {/* Back button skeleton */}
            <div className="h-10 w-32 bg-gray-200 rounded-full mb-8"></div>
            
            {/* Title skeleton */}
            <div className="h-12 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 w-3/4 bg-gray-200 rounded-lg mb-8"></div>
            
            {/* Meta info skeleton */}
            <div className="flex space-x-6 mb-8">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-4 w-20 bg-gray-200 rounded"></div>
            </div>
            
            {/* Content skeleton */}
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`h-4 bg-gray-200 rounded ${i % 3 === 0 ? 'w-5/6' : 'w-full'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">😕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/posts')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Posts
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate estimated read time (rough estimate: 200 words per minute)
  const estimatedReadTime = post.readTime || Math.max(1, Math.ceil(post.content.split(' ').length / 200));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/posts"
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-full transition-all duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Posts
          </Link>
        </nav>

        {/* Article */}
        <article className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
          {/* Header */}
          <header className="px-8 py-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                {post.title}
              </h1>
              
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-6 text-blue-100">
                {post.author && (
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-2">
                      <span className="text-sm font-bold">{post.author.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <span>{post.author.name}</span>
                  </div>
                )}
                
                {post.createdAt && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{estimatedReadTime} min read</span>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </header>

          {/* Action buttons */}
          <div className="px-8 py-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-full transition-all duration-200">
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </button>
            </div>
            
            <Link
              href={`/posts/${post.id}/edit`}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 hover:shadow-lg transition-all duration-200 group"
            >
              <Edit3 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
              Edit Post
            </Link>
          </div>

          {/* Content */}
          <div className="px-8 py-12">
            <div className="prose prose-lg prose-gray max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-lg">
                {post.content}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated: {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown'}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Was this helpful?</span>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-green-100 hover:bg-green-200 text-green-600 transition-colors duration-200 flex items-center justify-center">
                    👍
                  </button>
                  <button className="w-8 h-8 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors duration-200 flex items-center justify-center">
                    👎
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}