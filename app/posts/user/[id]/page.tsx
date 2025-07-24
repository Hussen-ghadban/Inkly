'use client';

import { useState, useMemo, use } from 'react';
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
  TrendingUp,
  User,
  MapPin,
  Globe,
  Twitter,
  Github,
  Linkedin,
  MessageCircle,
  Mail,
  Heart,
  Share2,
  Clock,
  Award,
  Users,
  MoreHorizontal,
  Edit3,
  Settings
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

interface Post {
  id: string;
  title: string;
  content: string;
  views?: number;
  likes?: number;
  category?: string;
  author?: string;
  createdAt?: string;
  readTime?: number;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  joinedAt: string;
  followers?: number;
  following?: number;
  isFollowing?: boolean;
}

export default function UserProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = useState('posts');
  
  const fetchUserProfile = async (): Promise<UserProfile> => {
    const res = await fetch(`${baseUrl}/api/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    const data = await res.json();
    return data || {};
  };

  const fetchPosts = async (): Promise<Post[]> => {
    const res = await fetch(`${baseUrl}/api/posts/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) throw new Error('Failed to fetch posts');
    const data = await res.json();
    return data.posts || [];
  };

  const { data: userProfile, isLoading: profileLoading, error: profileError } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: fetchUserProfile,
  });
// console.log('User Profile:', userProfile);
  const { data: posts, isLoading: postsLoading, error: postsError } = useQuery({
    queryKey: ['user-posts', id],
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

  // Get unique categories
  const categories = useMemo(() => {
    if (!posts) return [];
    const cats = [...new Set(posts.map(post => post.category).filter(Boolean))];
    return cats as string[];
  }, [posts]);

  // Stats calculations
  const stats = useMemo(() => {
    if (!posts) return { total: 0, totalViews: 0, totalLikes: 0, avgViews: 0 };
    
    const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    return {
      total: posts.length,
      totalViews,
      totalLikes,
      avgViews: posts.length > 0 ? Math.round(totalViews / posts.length) : 0
    };
  }, [posts]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleChatWithUser = () => {
    // This would typically open a chat modal or navigate to a chat page
    console.log('Opening chat with user:', userProfile?.username);
    // You can implement your chat logic here
  };

  const handleFollowUser = () => {
    // This would handle following/unfollowing the user
    console.log('Following/unfollowing user:', userProfile?.username);
  };

  const LoadingComponent = () => (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-muted-foreground mt-6 text-lg">Loading profile...</p>
    </div>
  );

  const PostCard = ({ post, index }: { post: Post; index: number }) => (
    <Card className="h-full group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            #{String(index + 1).padStart(2, '0')}
          </Badge>
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
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDate(post.createdAt)}
            </div>
            {post.readTime && (
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {post.readTime} min
              </div>
            )}
          </div>
          {post.category && (
            <Badge variant="outline" className="text-xs">
              {post.category}
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-3">
            {post.views !== undefined && (
              <div className="flex items-center">
                <Eye className="w-3 h-3 mr-1" />
                {post.views.toLocaleString()}
              </div>
            )}
            {post.likes !== undefined && (
              <div className="flex items-center">
                <Heart className="w-3 h-3 mr-1" />
                {post.likes.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const PostListItem = ({ post, index }: { post: Post; index: number }) => (
    <Card className="group hover:shadow-md transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="secondary" className="text-xs">
                #{String(index + 1).padStart(2, '0')}
              </Badge>
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
              {post.readTime && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.readTime} min read
                </div>
              )}
              {post.views !== undefined && (
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {post.views.toLocaleString()} views
                </div>
              )}
              {post.likes !== undefined && (
                <div className="flex items-center">
                  <Heart className="w-3 h-3 mr-1" />
                  {post.likes.toLocaleString()} likes
                </div>
              )}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 ml-4 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );

  if (profileLoading || postsLoading) return <LoadingComponent />;

  if (profileError || postsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 p-6">
        <Alert variant="destructive" className="max-w-2xl mx-auto mt-20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load user profile. Please refresh the page or try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="border-0 bg-gradient-to-r from-white to-gray-50/50 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-24 h-24 lg:w-32 lg:h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={userProfile?.avatar} alt={userProfile?.name} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                      {userProfile?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      {userProfile?.name || 'Unknown User'}
                    </h1>
                    <p className="text-lg text-muted-foreground mb-3">
                      @{userProfile?.username || 'username'}
                    </p>
                    {userProfile?.bio && (
                      <p className="text-gray-700 mb-4 max-w-2xl">
                        {userProfile.bio}
                      </p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                      {userProfile?.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {userProfile.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Joined {formatJoinDate(userProfile?.joinedAt || '')}
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center gap-3 mb-4">
                      {userProfile?.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={userProfile.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {userProfile?.twitter && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`https://twitter.com/${userProfile.twitter}`} target="_blank" rel="noopener noreferrer">
                            <Twitter className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {userProfile?.github && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={`https://github.com/${userProfile.github}`} target="_blank" rel="noopener noreferrer">
                            <Github className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {userProfile?.linkedin && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={userProfile.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>

                    {/* Follower Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span className="font-semibold">{userProfile?.followers?.toLocaleString() || 0}</span>
                        <span className="text-muted-foreground">followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">{userProfile?.following?.toLocaleString() || 0}</span>
                        <span className="text-muted-foreground">following</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 lg:ml-auto">
                  <Button 
                    onClick={handleChatWithUser}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat with {userProfile?.name?.split(' ')[0] || 'User'}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={handleFollowUser}
                    className="border-blue-200 hover:bg-blue-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {userProfile?.isFollowing ? 'Unfollow' : 'Follow'}
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        {posts && posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Posts</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm font-medium">Total Views</p>
                    <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
                  </div>
                  <Eye className="w-8 h-8 text-indigo-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Likes</p>
                    <p className="text-3xl font-bold">{stats.totalLikes.toLocaleString()}</p>
                  </div>
                  <Heart className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Avg Views</p>
                    <p className="text-3xl font-bold">{stats.avgViews.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="posts">Posts ({posts?.length || 0})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                
                {categories.length > 0 && (
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
                    <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      {categories.slice(0, 3).map((category) => (
                        <TabsTrigger key={category} value={category} className="hidden sm:flex">
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                )}
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

            {/* Posts Content */}
            {posts && filteredPosts.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">
                    {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post, index) => (
                      <Link key={post.id} href={`/posts/${post.id}`} className="block h-full">
                        <PostCard post={post} index={index} />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.map((post, index) => (
                      <Link key={post.id} href={`/posts/${post.id}`} className="block">
                        <PostListItem post={post} index={index} />
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
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? 'Try adjusting your search or filter criteria.'
                      : `${userProfile?.name || 'This user'} hasn't published any posts yet.`
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {userProfile?.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {userProfile?.bio ? (
                  <p className="text-gray-700 leading-relaxed">{userProfile.bio}</p>
                ) : (
                  <p className="text-muted-foreground italic">No bio available.</p>
                )}
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      {userProfile?.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{userProfile.email}</span>
                        </div>
                      )}
                      {userProfile?.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                          <span>{userProfile.location}</span>
                        </div>
                      )}
                      {userProfile?.website && (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                          <a href={userProfile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {userProfile.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Member since:</span>
                        <span>{formatJoinDate(userProfile?.joinedAt || '')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total posts:</span>
                        <span>{stats.total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total views:</span>
                        <span>{stats.totalViews.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total likes:</span>
                        <span>{stats.totalLikes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest actions and achievements by {userProfile?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Published {stats.total} blog posts</p>
                      <p className="text-xs text-muted-foreground">Total content created</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Eye className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Received {stats.totalViews.toLocaleString()} total views</p>
                      <p className="text-xs text-muted-foreground">Across all posts</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Heart className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Earned {stats.totalLikes.toLocaleString()} likes</p>
                      <p className="text-xs text-muted-foreground">Community appreciation</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <Users className="w-4 h-4 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{userProfile?.followers?.toLocaleString() || 0} followers</p>
                      <p className="text-xs text-muted-foreground">People following this user</p>
                    </div>
                  </div>

                  {userProfile?.joinedAt && (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-indigo-100 rounded-full">
                        <Award className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Joined {formatJoinDate(userProfile.joinedAt)}</p>
                        <p className="text-xs text-muted-foreground">Member of the community</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}