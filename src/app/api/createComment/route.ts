import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
})

export async function POST(request: Request) {
  try {
    const { _id, name, email, comment } = await request.json()
    
    // بررسی وجود فیلدهای مورد نیاز
    if (!_id || !name || !email || !comment) {
      return NextResponse.json({ 
        message: 'Missing required fields',
        error: 'All fields (_id, name, email, comment) are required'
      }, { status: 400 })
    }

    // ایجاد کامنت جدید
    const newComment = await client.create({
      _type: 'comment',
      post: { 
        _ref: _id, 
        _type: 'reference' 
      },
      name,
      email,
      comment,
      approved: false, // کامنت ها به صورت پیش فرض تایید نشده هستند
    })

    console.log('Comment created successfully:', newComment)
    return NextResponse.json({ 
      message: 'Comment created successfully',
      comment: newComment
    }, { status: 201 })
    
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json({ 
      message: 'Error creating comment',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
