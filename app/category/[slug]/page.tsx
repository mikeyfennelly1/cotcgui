import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeSeriesStream } from "@/components/time-series-stream"
import { Tag } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import createLogger from "@/lib/logger"

interface Source {
  id: number
  name: string
}

interface Group {
  id: number
  name: string
  children: Group[]
  sources: Source[]
}

const logger = createLogger("SubjectPage")

async function getHierarchy(): Promise<Group[]> {
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/reporting/streams/hierarchy`,
      { next: { revalidate: 60 } }
    )
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

function findGroupById(groups: Group[], id: number): Group | null {
  for (const group of groups) {
    if (group.id === id) return group
    const found = findGroupById(group.children, id)
    if (found) return found
  }
  return null
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const id = Number(slug)

  if (isNaN(id)) notFound()

  const hierarchy = await getHierarchy()
  const group = findGroupById(hierarchy, id)

  if (!group) {
    logger.debug(`no group found for id=${id}`)
    notFound()
  }

  logger.info(`rendering subject page for group id=${id} name=${group.name}`)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>
          <p className="text-muted-foreground">
            {group.children.length} child{group.children.length === 1 ? "" : "ren"}
          </p>
        </div>
      </div>

      {group.children.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {group.children.map((child) => (
            <Link key={child.id} href={`/category/${child.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-medium">{child.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {child.children.length} child{child.children.length === 1 ? "" : "ren"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {group.sources.length > 0 && (
        <div className="flex flex-col gap-4">
          {group.sources.map((source) => (
            <Card key={source.id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{source.name}</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TimeSeriesStream streamId={source.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {group.children.length === 0 && group.sources.length === 0 && (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
          <p className="text-muted-foreground italic">No data for {group.name}</p>
        </div>
      )}
    </div>
  )
}
