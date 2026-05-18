export default function PanelHeader({ title, accent = 'cyan', right }) {
  const dot =
    accent === 'cyan'   ? 'bg-neon-cyan' :
    accent === 'violet' ? 'bg-neon-violet' :
    accent === 'pink'   ? 'bg-neon-pink' :
    accent === 'amber'  ? 'bg-neon-amber' :
    'bg-neon-cyan';
  return (
    <div className="panel-header">
      <div className="flex items-center gap-2">
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot} animate-pulseSoft`} />
        <span className="panel-title">{title}</span>
      </div>
      {right}
    </div>
  );
}
