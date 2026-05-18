// Tampilan Live Vertical — layout 9:16 untuk livestream mobile/HP.
import PageHeader from '../components/ui/PageHeader.jsx';
import Panel from '../components/ui/Panel.jsx';
import CityCanvasPlaceholder from '../components/city/CityCanvasPlaceholder.jsx';

export default function LiveVertical() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        eyebrow="Live"
        title="Tampilan Kota Langsung — Vertical"
        subtitle="Layout 9:16 untuk livestream HP / TikTok."
        right={<span className="chip text-neon-cyan">LIVE</span>}
      />
      <div className="flex-1 flex justify-center p-4 overflow-hidden">
        <div className="w-full max-w-[420px] h-full flex flex-col gap-3">
          <Panel title="Status Dunia" accent="cyan" className="h-[120px]">
            <div className="px-3 py-3 text-[11px] font-mono text-slate-400">
              Ringkasan status dunia (populasi, cuaca, ekonomi).
            </div>
          </Panel>
          <CityCanvasPlaceholder mode="vertical" className="flex-1" />
          <Panel title="Feed Kejadian" accent="pink" className="h-[150px] overflow-y-auto">
            <div className="px-3 py-3 text-[11px] font-mono text-slate-400">
              Feed kejadian akan tampil di sini.
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
