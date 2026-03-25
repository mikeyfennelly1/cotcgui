import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Activity, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import createLogger from "@/lib/logger"
import {NavItemNode} from "@/components/app-sidebar/NavItemNode";
import {Group} from "@/lib/types/Group";
import {getGroupByName, getGroups} from "@/lib/client/group/group";
import {CreateGroupSheet} from "@/components/app-sidebar/CreateGroupSheet";

const logger = createLogger("AppSidebar")

export type NavItem = {
  title: string
  href?: string
  children?: NavItem[]
}

function groupToNavItem(stream: Group): NavItem {
  return {
    title: stream.name,
    href: `/stream/${encodeURIComponent(stream.name)}`,
    children: stream.children.map(groupToNavItem),
  }
}

export async function AppSidebar() {
  const groups: Group[] = await getGroups()
  logger.info(`Fetched ${groups.length} groups`)

  const navItems: NavItem[] = groups.map(groupToNavItem)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 border-b flex items-center px-6">
        <div className="flex items-center gap-2 font-semibold overflow-hidden whitespace-nowrap">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="truncate">cotc</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Infrastructure</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="NATS">
                  <Link href="/nats">
                    <Activity />
                    <span>NATS</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Groups</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <NavItemNode key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        <CreateGroupSheet />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
