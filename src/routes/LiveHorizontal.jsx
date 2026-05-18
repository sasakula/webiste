// Tampilan Live Horizontal — layout 16:9 untuk livestream desktop.
// Untuk fondasi, hanya rangka kosong dengan canvas placeholder.
import PageHeader from '../components/ui/PageHeader.jsx';
import Panel from '../components/ui/Panel.jsx';
import CityCanvasPlaceholder from '../components/city/CityCanvasPlaceholder.jsx';

export default function LiveHorizontal() {
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        eyebrow="Live"
        title="Tampilan Kota Langsung — Horizontal"
        subtitle="Layout 16:9 untuk livestream desktop."
        right={<span className="chip text-neon-cyan">LIVE</span>}
      />
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 overflow-hidden">
        <Panel title="Status Dunia" accent="cyan" className="col-span-3 overflow-y-auto">
          <div className="px-3 py-3 text-[11px] font-mono text-slate-400 leading-relaxed">
            Panel kiri akan berisi populasi, cuaca, ekonomi, kriminalitas,
            kebahagiaan, lapangan kerja, dan kontrol simulasi.
          </div>
        </Panel>
        <div className="col-span-6 flex flex-col gap-3 min-h-0">
          <CityCanvasPlaceholder mode="horizontal" className="flex-1" />
          <Panel title="Daftar Warga" accent="violet" className="h-[180px]">
            <div className="px-3 py-3 text-[11px] font-mono text-slate-400">
              Kartu NPC akan tampil di sini saat populasi tersedia.
            </div>
          </Panel>
        </div>
        <Panel title="Feed Kejadian" accent="pink" className="col-span-3 overflow-y-auto">
          <div className="px-3 py-3 text-[11px] font-mono text-slate-400 leading-relaxed">
            Feed kejadian dan drama NPC akan tampil di sini secara realtime.
          </div>
        </Panel>
      </div>
    </div>
  );
}
