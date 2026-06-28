import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!token) {
      return NextResponse.json({ data: [], error: 'Token missing' }, { status: 400 });
    }

    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink&access_token=${token}`;
    const res = await fetch(url);
    const json = await res.json();

    if (json.error) {
      return NextResponse.json({ data: [], error: json.error.message }, { status: 400 });
    }

    const data = json.data?.filter((item: any) => item.media_url) || [];
    
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ data: [], error: 'Failed to fetch Instagram feed' }, { status: 500 });
  }
}
