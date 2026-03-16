import createLogger, {Logger} from "@/lib/logger"
import { StreamView } from "@/components/stream-view"
import {Group} from "@/lib/types/Group";
import {getGroupByName} from "@/lib/client/group/group";
import {ProducerCountCard} from "@/components/ProducerCountCard";
import {producerListToNameSet} from "@/lib/translate/Translators";

const logger: Logger = createLogger("GroupPage")

export default async function GroupPage({params}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const groupName: string = decodeURIComponent(slug);
  let group: Group;
  try {
    group = await getGroupByName(groupName);
  } catch {
    console.error("error getting group: ", groupName)
    return (<></>)
  }

  logger.info(`rendering group page for name=${group.name} producers=${group.producers.length}`)

  return (
    <div className="flex flex-col gap-6">
      {ProducerCountCard(groupName, producerListToNameSet(group.producers))}

      {group.producers.length > 0 ? (<StreamView producers={group.producers} streamName={group.name} />) : (
        <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed bg-muted/50">
          <p className="text-muted-foreground italic">No producers for {group.name}</p>
        </div>
      )}
    </div>
  )
}
