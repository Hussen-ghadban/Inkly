// app/posts/layout.tsx
import React from "react";
import ProtectedRoute from '@/app/components/general/ProtectedRoute';
export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    // <ProtectedRoute>
    <div className="m-3">
      <h1 className="text-2xl font-semibold mb-4">Blog Posts</h1>
      {children}
    </div>
    // </ProtectedRoute>
  );
}

