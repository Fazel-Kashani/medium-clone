import Header from '@/components/Header'
import { client } from '@/sanity/lib/client'
import type { Post } from '../../../../types'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from 'next-sanity'
import CommentForm from '@/components/CommentForm'

// 1. تعریف کامپوننت سروری و گرفتن پارامتر slug از props
interface Props {
    params: Promise<{ slug: string }>
}

export default async function Post({ params }: Props) {
    // Await params in Next.js 15
    const { slug } = await params

    // 2. واکشی داده پست از سرور با استفاده از slug
    const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author-> {
      name,
      image
    },
    'comments': *[_type == "comment" && post._ref == ^._id && approved == true],
    description,
    mainImage,
    slug,
    body
  }`

    const post: Post = await client.fetch(query, { slug })

    // 3. اگر پست پیدا نشد، نمایش پیام مناسب
    if (!post) {
        return <div>post not found</div>
    }

    // 4. رندر صفحه پست
    return (
        <main>
            <Header />
            <img className="w-full h-40 object-cover"
                src={urlFor(post.mainImage).url()} alt='post header'>
            </img>
            <article className='max-w-3xl mx-auto p-5'>
                <h1 className='text-3xl font-bold mt-10 mb-3'>
                    {post.title}</h1>
                <h2 className='text-xl font-light text-gray-500 mb-2'>
                    {post.description}</h2>
                <div className='flex items-center space-x-2'>
                    <img className='h-10 w-10 rounded-full object-cover'
                        src={urlFor(post.author.image).url()}
                        alt='author image'></img>
                    <p className='font-extralight text-sm'>
                        Blog post by <span className='font-bold'>{post.author.name}</span> -
                        published at {" "} {new Date(post._createdAt).toLocaleDateString()}

                    </p>
                </div>
                <div className='mt-10'>
                    <PortableText
                        value={post.body}
                        components={{
                            block: {
                                h1: ({ children }) => <h1 className='text-2xl font-bold my-5'>{children}</h1>,
                                h2: ({ children }) => <h2 className='text-xl font-bold my-5'>{children}</h2>,
                                normal: ({ children }) => <p className='my-2'>{children}</p>,
                            },
                            list: {
                                bullet: ({ children }) => <ul className='list-disc ml-4 my-2'>{children}</ul>,
                                number: ({ children }) => <ol className='list-decimal ml-4 my-2'>{children}</ol>,
                            },
                            listItem: {
                                bullet: ({ children }) => <li className='ml-4'>{children}</li>,
                                number: ({ children }) => <li className='ml-4'>{children}</li>,
                            },
                            marks: {
                                link: ({ children, value }) => (
                                    <a href={value.href} className='text-blue-500 hover:underline'>
                                        {children}
                                    </a>
                                ),
                            },
                        }}
                    />

                </div>
            </article>

            <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />
            
            {/* Comment Form Component */}
            <CommentForm postId={post._id} />

            { /* comments section */ }
            <div className='flex flex-col p-10 my-10 max-w-2xl mx-auto shadow space-y-2'>
                <h3>commnets</h3>
                <hr className='pb-2' />

                {post.comments.map((comment) => (
                    <div key={comment._id} className='border rounded-lg p-5 mb-5'>
                        <p>
                            <span className='text-yellow-500'>{comment.name}:</span> {comment.comment}
                        </p>
                        <p className='text-xs text-gray-400'>
                            {new Date(comment._createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>

        </main>
    )
}