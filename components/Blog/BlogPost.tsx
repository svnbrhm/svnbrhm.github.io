import React from 'react';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    date: string;
    content: string;
    image?: string;
  };
}

const BlogPost: React.FC<BlogPostProps> = ({ post }) => {
  return (
    <article className="blog-post max-w-3xl mx-auto p-6">
      {post.image && <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded" />}
      <h1 className="text-4xl font-bold mt-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mt-1">{post.date}</p>
      {/* skipcq: JS-0440 - dangerouslySetInnerHTML is necessary here to render dynamic blog post content that may contain HTML formatting */}
      <div className="mt-4 prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
};

export default BlogPost;