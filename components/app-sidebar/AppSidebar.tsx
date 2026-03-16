"use strict";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar"
import { LayoutDashboard } from "lucide-react"
import createLogger from "@/lib/logger"
import {NavItemNode} from "@/components/app-sidebar/NavItemNode";
import {Group} from "@/lib/types/Group";
import {getGroups} from "@/lib/client/group/group";

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
  const groups = await getGroups()
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
      <SidebarRail />
    </Sidebar>
  )
}
