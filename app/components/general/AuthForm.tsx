'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/authSlice';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function AuthForm() {
  const dispatch = useDispatch();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setMessage('');

    // Prepare payload depending on mode
    const payload =
      mode === 'register'
        ? { name: data.name, email: data.email, password: data.password }
        : { email: data.email, password: data.password };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const apiUrl = `${baseUrl}/api/auth/${mode}`;

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        setMessage(resData.message || 'Something went wrong');
        setIsLoading(false);
        return;
      }

      if (mode === 'login') {
          dispatch(loginSuccess({
        token: resData.token,
        user: resData.user
      }));
        setMessage('Login successful!');
        router.push('/');
      } else {
        setMessage('Registration successful!');
        router.push('/posts');
      }

      reset(); // Reset form after success
    } catch (error) {
      setMessage(`Network error. Please try again. ${error}`);
    }

    setIsLoading(false);
  };

  const switchMode = (newMode: 'login' | 'register') => {
    if (newMode !== mode) {
      setMode(newMode);
      setMessage('');
      reset();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with mode switcher */}
          <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex rounded-lg bg-white/10 backdrop-blur-sm p-1">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  mode === 'login'
                    ? 'bg-white text-blue-600 shadow-sm transform translate-x-0'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => switchMode('register')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  mode === 'register'
                    ? 'bg-white text-blue-600 shadow-sm transform translate-x-0'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {/* Form content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {mode === 'login' ? 'Welcome back' : 'Create account'}
              </h2>
              <p className="text-gray-600 text-sm">
                {mode === 'login'
                  ? 'Sign in to your account to continue'
                  : 'Join us and start your journey today'}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02]'
                } text-white shadow-lg`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {message && (
              <div
                className={`mt-6 p-4 rounded-lg text-sm text-center transition-all duration-300 ${
                  message.includes('successful')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {message}
              </div>
            )}

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
