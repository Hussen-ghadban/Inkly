'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { 
  BookOpen, 
  ArrowRight, 
  AlertCircle, 
  Search, 
  Grid3X3,
  List,
  Calendar,
  Eye,
  Plus,
  Users
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt?: string;
  views?: number;
  category?: string;
  author?: {
    name: string;
    email?: string;
  };
}

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch(`${baseUrl}/api/posts`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

export default function BlogDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    if (!posts) return [];
    
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const LoadingComponent = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-muted-foreground mt-6 text-lg">Loading dashboard...</p>
    </div>
  );

  const PostCard = ({ post }: { post: Post; }) => (
    <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2 leading-tight">
          {post.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {post.content ? post.content.substring(0, 120) + '...' : 'Click to read more...'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(post.createdAt)}
            </div>
            {post.views !== undefined && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {post.views.toLocaleString()}
              </div>
            )}
          </div>
          {post.category && (
            <Badge variant="outline" className="text-xs">
              {post.category}
            </Badge>
          )}
          <p className="hover:underline">
            <Link href={`/posts/user/${post.authorId}`}>
              {post.author?.name}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );

  const PostListItem = ({ post }: { post: Post;}) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              {post.category && (
                <Badge variant="outline" className="text-xs">
                  {post.category}
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors mb-2">
              {post.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2 mb-3">
              {post.content ? post.content.substring(0, 200) + '...' : 'Click to read more...'}
            </p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(post.createdAt)}
              </div>
              {post.views !== undefined && (
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {post.views.toLocaleString()} views
                </div>
              )}
              {post.author && (
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {post.author.name || 'Unknown Author'}
                </div>
              )}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ml-4 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <div className="flex items-center mb-4">
            <div className="ml-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Inkly
              </h1>
              <p className="text-muted-foreground text-lg">
                Discover inspiring stories, ideas, and insights.
              </p>
            </div>
            </div>
          </div>
        
        </div>
        {/* Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && <LoadingComponent />}

        {/* Error State */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load posts. Please refresh the page or try again later.
            </AlertDescription>
          </Alert>
        )}

        {/* Posts Content */}
        {posts && (
          <>
            {filteredPosts.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 ">
                    {filteredPosts.map((post) => (
                      <Link key={post.id} href={`/posts/${post.id}`} className="block h-full">
                        <PostCard post={post}  />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                      <Link key={post.id} href={`/posts/${post.id}`} className="block">
                        <PostListItem post={post}  />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-muted-foreground mb-2">
                    {searchQuery ? 'No posts found' : 'No posts yet'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery 
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating your first blog post!'
                    }
                  </p>
                  {!searchQuery && (
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}