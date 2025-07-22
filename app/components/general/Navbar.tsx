"use client";

import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut,
  PlusCircle,
  Home,
  Info,
  FileText,
  Mail
} from 'lucide-react';
import { RootState } from '@/store';

const Navbar = () => {
  const dispatch = useDispatch();
  
  // Get user authentication state from Redux store
  // Replace with your actual auth selector
const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  console.log('Navbar user:', user?.name);
  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/auth';
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 text-white px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-xl font-bold tracking-wide">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            MyBlogs
          </Link>
        </div>
        
        {/* Navigation Links */}
        <ul className="hidden md:flex items-center space-x-6">
          <li>
            <Link 
              href="/" 
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <Home size={16} />
              Home
            </Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2 hover:text-blue-400 transition-colors"
              >
                {/* <Dashboard size={16} /> */}
                Dashboard
              </Link>
            </li>
          )}
          <li>
            <Link 
              href="/about" 
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <Info size={16} />
              About
            </Link>
          </li>
          <li>
            <Link 
              href="/posts" 
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <FileText size={16} />
              Blogs
            </Link>
          </li>
          <li>
            <Link 
              href="/contact" 
              className="flex items-center gap-2 hover:text-blue-400 transition-colors"
            >
              <Mail size={16} />
              Contact
            </Link>
          </li>
        </ul>
        
        {/* Hero Section - Profile or Get Started */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            // Profile Hero Section for logged-in users
            <div className="flex items-center gap-3">
              {/* User Badge/Status */}
              <Badge variant="secondary" className="hidden sm:flex">
                Welcome back!
              </Badge>
              
              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full border-2 border-blue-500 hover:border-blue-400 transition-colors"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage 
                        src={user?.avatar || user?.profileImage} 
                        alt={user?.name || user?.username || 'User'} 
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                        {getUserInitials(user?.name || user?.username)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-gray-800 border-gray-700 text-white" 
                  align="end" 
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || user?.username || 'User'}
                      </p>
                      <p className="text-xs leading-none text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                    <Link href="/dashboard" className="flex items-center w-full">
                      {/* <Dashboard className="mr-2 h-4 w-4" /> */}
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                    <Link href="/posts/create" className="flex items-center w-full">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Post
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                    <Link href="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                    <Link href="/settings" className="flex items-center w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-gray-700" />
                  
                  <DropdownMenuItem 
                    className="hover:bg-red-600 cursor-pointer text-red-400 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            // Get Started Hero Section for non-logged users
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm text-gray-300">Ready to share your story?</p>
                <p className="text-xs text-gray-400">Join our community</p>
              </div>
              
              <Button 
                asChild
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Link href="/auth">
                  <User className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;