import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Sword } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(0_68%_32%_/_0.08)_0%,_transparent_70%)]" />

      {/* Decorative lines */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,hsl(var(--foreground))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground))_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full border border-primary/40 flex items-center justify-center glow-primary">
            <Sword className="w-7 h-7 text-primary" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-heading text-5xl md:text-7xl font-black tracking-[0.2em] text-foreground mb-3 uppercase">
          Berserk
        </h1>

        <p className="text-accent font-heading text-sm md:text-base tracking-[0.3em] uppercase mb-6">
          Forge Your Will — Conquer Your Limits
        </p>

        <p className="text-muted-foreground text-base md:text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Uma ferramenta de produtividade forjada para aqueles que recusam a mediocridade.
          Discipline. Focus. Conquest.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-heading tracking-widest uppercase glow-primary">
            <Link href="/onboarding">
              Iniciar Jornada
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="font-heading tracking-widest uppercase"
          >
            <Link href="/dashboard">Acessar Dashboard</Link>
          </Button>
        </div>
      </div>

      {/* Quote footer */}
      <footer className="absolute bottom-8 left-0 right-0 px-6 text-center">
        <p className="text-muted-foreground/50 text-xs font-heading tracking-widest italic">
          &ldquo;In this world, is the destiny of mankind controlled by some transcendental entity or law?&rdquo;
        </p>
      </footer>
    </main>
  )
}
