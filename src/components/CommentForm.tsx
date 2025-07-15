'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'

interface IformInput {
    _id: string
    name: string;
    email: string;
    comment: string;
}

interface Props {
    postId: string
}

export default function CommentForm({ postId }: Props) {
    const [submitted, setSubmitted] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset } = useForm<IformInput>();

    const onSubmit = async (data: IformInput) => {
        try {
            console.log('Submitting comment with data:', {
                ...data,
                _id: postId
            })
            
            const response = await fetch('/api/debug-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    _id: postId
                }),
            })
            
            const result = await response.json()
            console.log('Response:', result)
            
            if (!response.ok) {
                throw new Error(result.error || result.message || 'Failed to submit comment')
            }
            
            setSubmitted(true)
            reset()
            console.log('Comment submitted successfully')
            
        } catch (error) {
            console.error('Error submitting comment:', error)
            alert('خطا در ارسال کامنت: ' + (error instanceof Error ? error.message : 'خطای نامشخص'))
        }
    }

    if (submitted) {
        return (
            <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
                <h3 className='text-3xl font-bold'>Thank you for your comment!</h3>
                <p className='text-gray-100'>Once it has been approved, it will appear below!</p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className='mt-4 bg-white text-yellow-500 px-4 py-2 rounded hover:bg-gray-100'
                >
                    Add another comment
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-5 mx-auto max-w-2xl mb-10'>
            <h3 className='text-sm text-yellow-500'>Enjoyed this article?</h3>
            <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
            <hr className='py-3 mt-2' />

            <input type="hidden" {...register('_id')} name="_id" value={postId} />

            <label className='block mb-5'>
                <span className='text-gray-700'>Name</span>
                <input 
                    {...register('name', { required: true })} 
                    className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-amber-500 focus:ring focus:outline-none' 
                    type="text" 
                    placeholder='John Doe' 
                />
            </label>
            
            <label className='block mb-5'>
                <span className='text-gray-700'>Email</span>
                <input 
                    {...register('email', { required: true })} 
                    className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-amber-500 focus:ring focus:outline-none' 
                    type="email" 
                    placeholder='example@gmail.com' 
                />
            </label>
            
            <label className='block mb-5'>
                <span className='text-gray-700'>Comment</span>
                <textarea 
                    {...register('comment', { required: true })} 
                    className='shadow border py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
                    rows={8} 
                    placeholder='Write something...' 
                />
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

            <input 
                type='submit' 
                className='shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded cursor-pointer'
                value="Submit Comment"
            />
        </form>
    )
}
