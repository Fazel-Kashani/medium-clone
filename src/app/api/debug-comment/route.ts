import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  ignoreBrowserTokenWarning: true,
})

// Create a write-enabled client
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  ignoreBrowserTokenWarning: true,
})

export async function POST(request: Request) {
  try {
    const { _id, name, email, comment } = await request.json()
    
    console.log('=== DEBUG COMMENT CREATION ===')
    console.log('Received data:', { _id, name, email, comment })
    console.log('Environment variables:')
    console.log('- Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    console.log('- Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
    console.log('- Token exists:', !!process.env.SANITY_API_TOKEN)
    console.log('- Token length:', process.env.SANITY_API_TOKEN?.length)
    
    // بررسی اینکه post ID معتبر است
    const post = await client.fetch('*[_type == "post" && _id == $id][0]', { id: _id })
    console.log('Post exists:', !!post)
    console.log('Post data:', post)
    
    if (!post) {
      return NextResponse.json({ 
        success: false,
        error: 'Post not found with the given ID'
      }, { status: 404 })
    }
    
    // تست ایجاد کامنت
    const commentData = {
      _type: 'comment',
      post: { 
        _ref: _id, 
        _type: 'reference' 
      },
      name,
      email,
      comment,
      approved: false,
    }
    
    console.log('Creating comment with data:', commentData)
    
    const newComment = await client.create(commentData)
    console.log('Comment created successfully:', newComment)
    
    return NextResponse.json({ 
      success: true,
      message: 'Comment created successfully',
      comment: newComment
    })
    
  } catch (error) {
    console.error('=== ERROR CREATING COMMENT ===')
    console.error('Error:', error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
