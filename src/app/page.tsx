import Header from '@/components/Header';
import { client } from '@/sanity/lib/client';
import Link from 'next/link';
import React from 'react';
import { Post } from '../../types';
import { urlFor } from '@/sanity/lib/image';

export default async function Home() {

  const query = `*[_type == "post"]{
    _id,
    title,
    author-> {
      name,
      image
      },
    description,
    mainImage,
    slug
    }`;

  const posts = await client.fetch(query)

  console.log(posts)

  return (
    <div className="max-w-7xl mx-auto">
      <Header />

      <div className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:">
        <div className="px-10 space-y-5">
          <h1 className="text-6xl max-w-xl font-serif">
            <span className="underline decoration-4">Medium</span> is a place to read, write and connect.
          </h1>
          <h2>
            its easy and free to post your thinking on any topic and connect with millions of readers.
          </h2>
        </div>
        <img
          className="hidden md:inline-flex h-36 w-36 mr-10 lg:h-72 w-auto "
          src="/iconmonstr-medium-1.svg"
          alt="Medium Logo"
        />
      </div>

      {/* posts */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-3'>
        {posts.map((post: Post) => (
          <Link key={post._id} href={`/post/${post.slug.current}`}>
            <div className='group cursor-pointer border-1 border-gray-300 rounded-xl overflow-hidden'>
              <img className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out' src={urlFor(post.mainImage).url()!} alt="" />
              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-sm text-gray-500'>
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img className="h-12 w-12 rounded-full object-cover " src={urlFor(post.author.image).url()!} alt='author image'></img>
              </div>
            </div>
          </Link>

        ))}
      </div>
    </div>
  );
}

