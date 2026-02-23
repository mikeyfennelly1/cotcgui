import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import createLogger from "@/lib/logger";

interface Subcategory {
  id: string
  name: string
}

const logger = createLogger("CategoryPage")

async function getCategoryWithSubcategories(
  categoryName: string
): Promise<Subcategory[] | null> {
  try {
    logger.debug(`attepmting to fetch subcategories for category name=${categoryName}`)
    const res = await fetch(
      `${process.env.API_BASE_URL}/api/categories/subcategories?category=${encodeURIComponent(categoryName)}`,
      { next: { revalidate: 60 } }
    )

    const data = await res.json()
    return Object.assign(data, { json() { return JSON.stringify(data) } })
  } catch {
    return null
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const categoryName = decodeURIComponent(slug)
  const subcategories = await getCategoryWithSubcategories(slug)

  if (!subcategories) {
    logger.debug(`an error occurred fetching categories for category=${slug}`)
    notFound()
  }

  logger.info(`successfully fetched ${subcategories!.length} subcategories for category=${slug}`)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Tag className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
          <p className="text-muted-foreground">
            {subcategories!.length} subcategor{subcategories!.length === 1 ? "y" : "ies"}
          </p>
        </div>
      </div>

      {subcategories!.length === 0 ? (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
          <p className="text-muted-foreground italic">No subcategories for {categoryName}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subcategories!.map((sub) => (
            <Link key={sub.id} href={`/category/${slug}/${encodeURIComponent(sub.id)}`}>
              <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 shrink-0">
                    <Tag className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-sm font-medium">{sub.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{sub.id}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
