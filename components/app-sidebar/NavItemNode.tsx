import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
} from "@/components/ui/sidebar";
import {ChevronRight, Tag} from "lucide-react";
import Link from "next/link";
import {NavItem} from "@/components/app-sidebar/AppSidebar";
import {NavSubItemNode} from "@/components/app-sidebar/NavSubItemNode";

function NavItemNode({ item }: { item: NavItem }) {
    if (item.children?.length) {
        return (
            <Collapsible asChild defaultOpen={false} className="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                            <Tag />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.children.map((child) => (<NavSubItemNode key={child.title} item={child} />))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip={item.title}>
                <Link href={item.href ?? "#"}>
                    <Tag />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export {NavItemNode}