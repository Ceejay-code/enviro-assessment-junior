import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Wallet, FileText, BarChart3, Leaf, LogOut } from "lucide-react";

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
} from "@/components/ui/sidebar";
import { usePortal } from "@/lib/portal-store";
import { authService } from "@/lib/auth";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "My Portfolio", url: "/portfolio", icon: Wallet },
  { title: "Withdrawal Notices", url: "/withdrawals", icon: FileText },
  { title: "Reports", url: "/reports", icon: BarChart3 },
] as const;

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const { activeInvestor } = usePortal();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-5" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-tight">Enviro365</p>
            <p className="truncate text-xs text-muted-foreground">Investor Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={currentPath === item.url} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 dark:bg-red-950/40 dark:text-red-400 dark:hover:bg-red-900/60 font-medium"
            >
              <LogOut className="size-4 text-red-600 dark:text-red-400" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}