export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-6 px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <span className="font-heading text-sm tracking-[0.2em] uppercase text-muted-foreground font-bold">
          Berserk App
        </span>
        <p className="text-xs text-muted-foreground/60 text-center italic">
          &ldquo;In this world, is the destiny of mankind controlled by some transcendental entity or law?&rdquo;
        </p>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
