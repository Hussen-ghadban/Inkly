'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { BookOpen, ArrowRight, AlertCircle } from 'lucide-react';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

interface Post {
  id: string;
  title: string;
  content: string;
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${baseUrl}/api/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export default function PostsPage() {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Latest Posts
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover insightful articles, tutorials, and stories from our community
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-600 mt-6 text-lg">Loading amazing content...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600">Failed to load posts. Please refresh the page or try again later.</p>
          </div>
        )}

        {/* Posts Grid */}
        {posts && posts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="group block"
              >
                <article className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:bg-white/90">
                  {/* Post Number Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-bold rounded-full">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  
                  {/* Post Title */}
                  <h2 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                  
                  {/* Post Preview */}
                  <p className="text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                    {post.content ? post.content.substring(0, 120) + '...' : 'Click to read more...'}
                  </p>
                  
                  {/* Read More */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-blue-600 group-hover:text-indigo-600 transition-colors duration-200">
                      Read Article →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {posts && posts.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No posts yet</h3>
            <p className="text-gray-500">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  );
}