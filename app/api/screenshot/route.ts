import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    // 1200x675 produces crisp 16:9 full HD desktop landing page captures
    const screenshotUrl = `https://image.thum.io/get/width/1200/crop/675/noanimate/${targetUrl}`;

    const res = await fetch(screenshotUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      // Cache server-side for 24 hours
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return new NextResponse(`Screenshot fetch failed: ${res.statusText}`, {
        status: res.status,
      });
    }

    const imageBuffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/png";

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return new NextResponse("Failed to capture screenshot", { status: 500 });
  }
}
