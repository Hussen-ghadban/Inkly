'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

type Post = {
  id: string
  title: string
  content: string
  createdAt: string
}

type Conversation = {
  id: string
  participants: string[]
  createdAt: string
}

type User = {
  id: string
  name?: string
  email: string
  createdAt: string
  updatedAt: string
  posts: Post[]
  conversationsInitiated: Conversation[]
  conversationsReceived: Conversation[]
}

type ApiError = {
  message: string
  status?: number
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const token = useSelector((state: RootState) => state.auth.token)

  const fetchUser = useCallback(async () => {
    if (!token) {
      setError('Authentication token not found. Please log in.')
      setLoading(false)
      return
    }

    try {
      setError(null)
      setLoading(true)

      const res = await fetch(`${baseUrl}/api/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(
          errorData.message || 
          `HTTP ${res.status}: ${res.statusText}` ||
          'Failed to fetch user data'
        )
      }

      const data = await res.json()
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid user data received from server')
      }

      setUser(data)
      setRetryCount(0) // Reset retry count on success
    } catch (err) {
      console.error('Failed to fetch user:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user data'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [token, baseUrl])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchUser()
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid date'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white shadow rounded-xl p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white shadow rounded-xl p-6">
          <div className="text-center">
            <div className="text-red-500 text-lg font-semibold mb-2">
              Error Loading Profile
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? 'Retrying...' : `Retry${retryCount > 0 ? ` (${retryCount})` : ''}`}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // No user state
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-gray-600">No user data available</p>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* User Info Card */}
      <div className="bg-white shadow rounded-xl p-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <button
            onClick={fetchUser}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg text-gray-900">{user.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg text-gray-900">{user.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Member Since</label>
              <p className="text-lg text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Last Updated</label>
              <p className="text-lg text-gray-900">{formatDateTime(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}