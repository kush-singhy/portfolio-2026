export function Hero() {
  return (
    <section className="py-16">
      <h1 className="font-serif text-4xl sm:text-5xl font-normal tracking-tight mb-4">
        Kush Singhy
      </h1>
      <p className="text-muted text-base leading-relaxed max-w-lg">
        Software engineer and runner. I build things for the web and chase
        personal bests on the road.
      </p>
      <div className="flex items-center gap-4 mt-6">
        <a
          href="https://github.com/kushsinghy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:text-accent-hover transition-colors underline underline-offset-4"
        >
          GitHub
        </a>
        <a
          href="https://linkedin.com/in/kushsinghy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent hover:text-accent-hover transition-colors underline underline-offset-4"
        >
          LinkedIn
        </a>
        <a
          href="mailto:kush@example.com"
          className="text-sm text-accent hover:text-accent-hover transition-colors underline underline-offset-4"
        >
          Email
        </a>
      </div>
    </section>
  );
}
