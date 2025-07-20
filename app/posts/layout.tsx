// app/posts/layout.tsx
import React from "react";

export default function PostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Blog Posts</h1>
      {children}
    </div>
  );
}

