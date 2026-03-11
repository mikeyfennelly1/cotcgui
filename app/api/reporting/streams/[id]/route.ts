import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse | Response> {
  const { id: groupName } = await params
  const upstream = await fetch(
    `${process.env.SUBSCRIBER_URL}/api/group/events/${groupName}`,
    {
      headers: { Accept: "text/event-stream" },
      // @ts-expect-error — Node fetch needs this to disable response buffering
      duplex: "half",
    }
  )

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
