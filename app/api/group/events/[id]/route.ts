import { NextRequest, NextResponse } from "next/server"
import createLogger from "@/lib/logger";

const groupEventsUrl = "api/group/events"
const logger = createLogger(groupEventsUrl)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse | Response> {
  const { id: groupName } = await params
  const upstream = await fetch(
    `${process.env.SUBSCRIBER_URL}/${groupEventsUrl}/${groupName}`,
    {
      headers: { Accept: "text/event-stream" },
      // @ts-expect-error — Node fetch needs this to disable response buffering
      duplex: "half",
    })
  logger.debug(`returning text/event-stream stream for group ${groupName}`)

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
