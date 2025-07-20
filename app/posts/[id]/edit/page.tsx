'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, AlertCircle, Loader2, FileEdit, Type, AlignLeft } from 'lucide-react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

// interface Post {
//   id: string;
//   title: string;
//   content: string;
// }

export default function EditPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${baseUrl}/api/posts/${id}`);
        if (!res.ok) throw new Error('Failed to fetch post');
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
      } catch (err) {
        setError(`Failed to load post for editing,${err}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchPost();
  }, [id]);

  // Track unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [title, content]);

  // Warn about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && !isSaving) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, isSaving]);

const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!title.trim() || !content.trim()) {
    setError('Both title and content are required');
    return;
  }

  try {
    setIsSaving(true);
    setError(null);

    const res = await fetch(`${baseUrl}/api/posts/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) throw new Error('Failed to update post');

    setHasUnsavedChanges(false);
    router.push(`/posts/${id}`);
  } catch (err) {
    setError(`Failed to update post. Please try again.,${err}`);
  } finally {
    setIsSaving(false);
  }
};


  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push(`/posts/${id}`);
      }
    } else {
      router.push(`/posts/${id}`);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="h-10 w-32 bg-gray-200 rounded-full mb-8"></div>
            <div className="bg-white/80 rounded-3xl p-8">
              <div className="h-12 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-8 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
              <div className="h-12 w-32 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-white/50 rounded-full transition-all duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Cancel
            </button>
            <div className="flex items-center gap-2">
              <FileEdit className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-800">Edit Post</h1>
              {hasUnsavedChanges && (
                <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-600 text-xs font-medium rounded-full">
                  Unsaved changes
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`inline-flex items-center px-4 py-2 font-medium rounded-full transition-all duration-200 ${
                showPreview 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200'
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit Mode' : 'Preview'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Type className="w-5 h-5" />
                  {showPreview ? 'Preview' : 'Editor'}
                </h2>
              </div>
              
              <div className="p-8 space-y-6">
                {!showPreview ? (
                  <>
                    {/* Title Input */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Type className="w-4 h-4" />
                        Post Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter your post title..."
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium"
                      />
                    </div>

                    {/* Content Textarea */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <AlignLeft className="w-4 h-4" />
                        Content
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here..."
                        required
                        rows={16}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                      />
                      <div className="mt-2 text-sm text-gray-500 flex justify-between">
                        <span>Write in Markdown or plain text</span>
                        <span>{content.split(' ').length} words</span>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Preview Mode */
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                        {title || 'Untitled Post'}
                      </h2>
                    </div>
                    <div className="prose prose-lg max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {content || 'No content yet...'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Post Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{title.length}</div>
                    <div className="text-sm text-gray-600">Title Characters</div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-indigo-600">{content.split(' ').length}</div>
                    <div className="text-sm text-gray-600">Words</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{content.split('\n').length}</div>
                    <div className="text-sm text-gray-600">Paragraphs</div>
                  </div>
                  <div className="bg-pink-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-pink-600">{Math.ceil(content.split(' ').length / 200)}</div>
                    <div className="text-sm text-gray-600">Min Read</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSaving || !title.trim() || !content.trim()}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        Update Post
                      </>
                    )}
                  </button>
                  
                  <Link
                    href={`/posts/${id}`}
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    View Post
                  </Link>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">✨ Writing Tips</h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li>• Use clear, descriptive titles</li>
                  <li>• Break content into paragraphs</li>
                  <li>• Preview your post before saving</li>
                  <li>• Your changes are saved automatically</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}