// Wrapper panel umum dengan header opsional.
export default function Panel({ title, accent = 'cyan', right, children, className = '' }) {
  const dot =
    accent === 'cyan'   ? 'bg-neon-cyan'   :
    accent === 'violet' ? 'bg-neon-violet' :
    accent === 'pink'   ? 'bg-neon-pink'   :
    accent === 'lime'   ? 'bg-neon-lime'   :
    'bg-neon-cyan';
  return (
    <section className={`panel ${className}`}>
      {title ? (
        <header className="panel-header">
          <div className="flex items-center gap-2">
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot} animate-pulseSoft`} />
            <span className="panel-title">{title}</span>
          </div>
          {right}
        </header>
      ) : null}
      {children}
    </section>
  );
}
