import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Bell, LogOut } from "lucide-react"
import CustomerDetail from "@/components/customer-detail"

interface CustomerPageProps {
  params: {
    id: string
  }
}

export default function CustomerPage({ params }: CustomerPageProps) {
  return (
    <SidebarProvider>
      <AppSidebar activePage="admin" setActivePage={() => {}} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-4">
            <span className="text-sm text-muted-foreground">Admin Dashboard</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <CustomerDetail customerId={params.id} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
