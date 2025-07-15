import { client } from "@/sanity/lib/client";
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { use } from "react";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
}

const client = createClient(config)

export async function POST(request: Request) {
  const { _id, name, email, comment } = await request.json()
  try {
    await client.create({
      _type: 'comment',
      post: { _ref: _id, _type: 'reference' },
      name,
      email,
      comment,
    })
    return NextResponse.json({ message: 'Comment created successfully' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}