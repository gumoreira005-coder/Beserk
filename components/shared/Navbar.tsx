import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-48"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon">
          <Bell className="w-4 h-4" />
        </Button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-black font-heading">
          G
        </div>
      </div>
    </header>
  )
}
