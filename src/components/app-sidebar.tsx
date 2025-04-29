import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { Box, List, Calendar, Cog } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "/assets/logo.png";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Box },
  { title: "Items", url: "/items", icon: List },
  { title: "Categories", url: "/categories", icon: Box },
  { title: "Stock History", url: "/stock-history", icon: Calendar },
  { title: "Settings", url: "/settings", icon: Cog },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar className="bg-sidebar p-0 min-h-screen">
      <SidebarContent>
        <div className="flex flex-col items-center mt-8 mb-4">
        <img src={logo} alt="Logo" className="w-12 h-12 mb-2" />
          <span className="text-2xl font-bold text-primary tracking-wide">
            Storage<br/><span className="text-sm text-muted-foreground">Management</span>
          </span>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className={location.pathname === item.url ? "bg-accent/50 text-primary rounded-md" : ""}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex gap-2 items-center">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
