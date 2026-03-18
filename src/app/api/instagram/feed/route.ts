import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 3600;

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data: tokenSetting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "instagram_access_token")
      .single();

    const { data: userIdSetting } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "instagram_user_id")
      .single();

    if (!tokenSetting?.value || !userIdSetting?.value) {
      return NextResponse.json({ posts: [] });
    }

    const accessToken = tokenSetting.value;
    const userId = userIdSetting.value;

    const response = await fetch(
      `https://graph.instagram.com/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${accessToken}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      console.error("Instagram API error:", response.status, response.statusText);
      return NextResponse.json({ posts: [] });
    }

    const data = await response.json();
    return NextResponse.json({ posts: data.data || [] });
  } catch (error) {
    console.error("Instagram feed error:", error);
    return NextResponse.json({ posts: [] });
  }
}
