import Image from "next/image";
import { prisma } from "./utils/db";

async function getBlogs(){
  const data=await prisma.blogPost.findMany({ 
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
  return data;
}

export default function Home() {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Latest Blog</h1>
      <div>
        <ul className="mt-4 space-y-4">
          {getBlogs().then(blogs => 
            blogs.map(blog => (
              <li key={blog.id} className="border p-4 rounded-lg">
                <h2 className="text-xl font-semibold">{blog.title}</h2>
                <p className="text-gray-600">{blog.content}</p>
                <p className="text-sm text-gray-500">Posted on {new Date(blog.createdAt).toLocaleDateString()}</p>
              </li>
            ))
          )}
        </ul>
      </div>

    </div>
  );
}
