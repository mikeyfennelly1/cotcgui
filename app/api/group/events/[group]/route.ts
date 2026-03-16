import { NextRequest, NextResponse } from "next/server"
import createLogger from "@/lib/logger";

const groupEventsUrl = "api/group/events"
const logger = createLogger(groupEventsUrl)

export async function GET(request: NextRequest, { params }: { params: Promise<{ group: string }> }): Promise<NextResponse | Response> {
  const { group } = await params
  const upstreamUrl = `http://localhost:8082/api/group/events?group=${encodeURIComponent(group)}`

  const upstreamResponse = await fetch(upstreamUrl, { signal: request.signal })

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return NextResponse.json({ error: 'Failed to connect to upstream' }, { status: 502 })
  }

  return new Response(upstreamResponse.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
