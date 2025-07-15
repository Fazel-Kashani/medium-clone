import Header from '@/components/Header'
import { client } from '@/sanity/lib/client'
import type { Post } from '../../../../typing'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from 'next-sanity'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { set } from 'sanity'

interface IformInput {
    _id: string
    name: string;
    email: string;
    comment: string;
}
// 1. تعریف کامپوننت سروری و گرفتن پارامتر slug از props
interface Props {
    params: { slug: string }
}

export default function Post({ params }: Props) {

    const [submitted, setSubmitted] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm<IformInput>();

    const onSubmit = (data: IformInput) => {
        // 5. ارسال کامنت به سرور
        fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            setSubmitted(true)
            console.log('Comment submitted')
        }).catch((error) => {
            setSubmitted(false)
            console.error('Error submitting comment:', error)
        })
    }

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

    const post: Post = await client.fetch(query, { slug: params.slug })

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
                        className=""
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                        content={post.body}
                        Serializers={{
                            h1: (props: any) => <h1 className='text-2xl font-bold my-5' {...props} />,
                            h2: (props: any) => <h2 className='text-xl font-bold my-5' {...props} />,
                            li: ({ children }: any) => <li className='ml-4 list-disc'>{children}</li>,
                            link: ({ href, children }: any) => (
                                <a href={href} className='text-blue-500 hover:underline'>
                                    {children}
                                </a>
                            )
                        }}
                    />

                </div>
            </article>

            <hr className='max-w-lg my-5 mx-auto border border-yellow-500' />
            {submitted ? (
                <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
                    <h3 className='text-3xl font-bold text-yellow-500'>Thank you for your comment!</h3>
                    <p className='text-gray-500'>Once it has been approved, it will appear below!</p>
                </div>
            ) : (

                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 mx-auto max-w-2xl mb-10'>
                    <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
                    <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
                    <hr className='py-3 mt-2' />

                    <input type="hidden" {...register('_id')} name="_id" value={post._id} />


                    <label className='block mb-5'>
                        <span className='text-gray-700'>name</span>
                        <input {...register('name', { required: true })} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-amber-500' type="text" placeholder='john doe' />
                    </label>
                    <label className='block mb-5'>
                        <span className='text-gray-700'>email</span>
                        <input {...register('email', { required: true })} className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-amber-500' type="text" placeholder='example@gmail.com' />
                    </label>
                    <label className='block mb-5'>
                        <span className='text-gray-700'>comment</span>
                        <textarea {...register('comment', { required: true })} className='shadow border py-2 px-3 form-texterea mt-1 block w-full ring-yellow-500 outline-none focus:ring' rows={8} placeholder='write somthing...' />
                    </label>

                    <div className='flex flex-col p-5'>
                        {errors.name && (
                            <span className='text-red-500'>- The name field is required</span>
                        )}
                        {errors.email && (
                            <span className='text-red-500'>- The email field is required</span>
                        )}
                        {errors.comment && (
                            <span className='text-red-500'>- The comment field is required</span>
                        )}
                    </div>

                    <input type='submit' className='shadow bg-yellow-500
                q hover:bg-yellow-400 focus:shadow-outline
                focus: outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'></input>

                </form>
            )}

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