import { createClient } from "next-sanity";
import { NextResponse } from "next/server";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
})

export async function GET() {
  try {
    console.log('Testing Sanity connection...')
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
    console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET)
    console.log('Token exists:', !!process.env.SANITY_API_TOKEN)
    
    // تست اتصال با یک query ساده
    const result = await client.fetch('*[_type == "post"][0]')
    console.log('Query result:', result)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sanity connection successful',
      post: result
    })
  } catch (error) {
    console.error('Sanity connection error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
