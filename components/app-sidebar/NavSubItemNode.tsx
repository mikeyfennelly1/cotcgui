import {
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem
} from "@/components/ui/sidebar";
import {ChevronRight} from "lucide-react";
import {NavItem} from "@/components/app-sidebar/AppSidebar";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";
import Link from "next/link";

function NavSubItemNode({ item }: { item: NavItem }) {
    if (item.children?.length) {
        return (
            <Collapsible asChild defaultOpen={false} className="group/collapsible">
                <SidebarMenuSubItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuSubButton>
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuSubButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.children.map((child) => (
                                <NavSubItemNode key={child.title} item={child} />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuSubItem>
            </Collapsible>
        )
    }

    return (
        <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
                <Link href={item.href ?? "#"}>
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    )
}

export {NavSubItemNode}