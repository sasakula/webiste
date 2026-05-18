// Dashboard Owner — admin "banyak data".
// Sekarang sudah tersambung ke simulation engine via useSimulation().
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader.jsx';
import Panel from '../components/ui/Panel.jsx';
import StatCard from '../components/ui/StatCard.jsx';
import CityCanvas from '../components/city/CityCanvas.jsx';
import { useSimulation } from '../hooks/useSimulation.js';
import { describeCrime } from '../simulation/crimeSystem.js';
import { formatRupiah, formatPercent } from '../utils/formatter.js';

const SPEEDS = [1, 2, 4, 8];

export default function OwnerDashboard() {
  const { snapshot, togglePause, setSpeed } = useSimulation();
  const crime = describeCrime(snapshot.kriminalitas);
  const clock = `${String(snapshot.jam).padStart(2, '0')}:${String(snapshot.menit).padStart(2, '0')}`;

  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        eyebrow="Owner"
        title="Dashboard Owner"
        subtitle="Pantau status kota, populasi, ekonomi, dan event terbaru — tampilan lengkap untuk admin."
        right={<span className="chip text-neon-cyan">{snapshot.paused ? 'Jeda' : `Live ${snapshot.speed}x`}</span>}
      />

      <div className="p-4 grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* === Baris 1: Kartu status (lebar 2 kolom) + kontrol simulasi === */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Populasi"       value={`${snapshot.populasi} jiwa`}      hint={`${snapshot.npcs.length} warga aktif`} accent="cyan"   />
          <StatCard label="Hari · Jam"     value={`H${snapshot.hari} · ${clock}`}    hint={snapshot.waktuHari}                    accent="violet" />
          <StatCard label="Cuaca"          value={snapshot.cuaca}                    hint="Auto-update"                            accent="lime"   />
          <StatCard label="Ekonomi"        value={snapshot.ekonomi}                  hint={`Indeks ${snapshot.ekonomiIndex}`}     accent="amber"  />
          <StatCard label="Kriminalitas"   value={crime.label}                       hint={formatPercent(snapshot.kriminalitas)}  accent={crime.label === 'Rendah' ? 'lime' : 'pink'} />
          <StatCard label="Kebahagiaan"    value={formatPercent(snapshot.kebahagiaan)} hint="Indeks gabungan"                     accent="pink"   />
          <StatCard label="Lapangan Kerja" value={`${snapshot.buildings.filter((b) => b.status !== 'Dibangun').length}`} hint="Bangunan aktif" accent="cyan" />
          <StatCard label="Event Aktif"    value={`${snapshot.eventLog.length}`}     hint="Di feed"                                accent="violet" />
        </div>
        <Panel title="Kontrol Simulasi" accent="violet">
          <div className="px-3 py-3 flex flex-col gap-3">
            <div className="grid grid-cols-5 gap-1">
              <button
                type="button"
                onClick={togglePause}
                data-active={snapshot.paused}
                className={`h-8 rounded-md border text-[11px] font-mono uppercase tracking-wider transition ${
                  snapshot.paused
                    ? 'border-neon-amber/70 bg-neon-amber/10 text-neon-amber'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-neon-amber/40'
                }`}
                title="Pause / Play (Spasi)"
              >
                {snapshot.paused ? '▶' : 'II'}
              </button>
              {SPEEDS.map((sp) => {
                const active = !snapshot.paused && snapshot.speed === sp;
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSpeed(sp)}
                    className={`h-8 rounded-md border text-[11px] font-mono uppercase tracking-wider transition ${
                      active
                        ? 'border-neon-cyan/70 bg-neon-cyan/10 text-neon-cyan'
                        : 'border-white/10 bg-white/5 text-slate-300 hover:border-neon-cyan/40'
                    }`}
                  >
                    {sp}x
                  </button>
                );
              })}
            </div>
            <div className="text-[10px] font-mono text-slate-500 leading-relaxed">
              Engine berjalan otomatis di latar. Semua halaman membaca state yang sama.
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Status</span>
              <span className={snapshot.paused ? 'text-neon-amber' : 'text-neon-lime'}>
                {snapshot.paused ? 'Dijeda' : 'Berjalan'}
              </span>
            </div>
          </div>
        </Panel>

        {/* === Preview kota pixel + log lengkap === */}
        <div className="lg:col-span-2 h-[420px]">
          <CityCanvas
            npcs={snapshot.npcs}
            buildings={snapshot.buildings}
            world={snapshot}
            cameraMode="orbit"
            showLabels
            liveMode={false}
          />
        </div>

        <Panel title="Log Kejadian Lengkap" accent="cyan" className="overflow-hidden">
          <div className="max-h-[420px] overflow-y-auto px-3 py-2 flex flex-col">
            {snapshot.eventLog.length === 0 ? (
              <div className="text-[11px] font-mono text-slate-500 italic">Belum ada kejadian.</div>
            ) : (
              snapshot.eventLog.map((e) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0"
                >
                  <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-0.5">[{e.time}]</span>
                  <span className={`text-[11px] leading-snug ${sevColor(e.severity)}`}>{e.text}</span>
                </motion.div>
              ))
            )}
          </div>
        </Panel>

        {/* === Tabel warga === */}
        <Panel
          title="Tabel Warga"
          accent="cyan"
          className="lg:col-span-2 overflow-hidden"
          right={<span className="font-mono text-[10px] text-slate-500">{snapshot.npcs.length} warga</span>}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono">
              <thead className="bg-white/[0.02] text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <Th>Nama</Th>
                  <Th>Umur</Th>
                  <Th>Pekerjaan</Th>
                  <Th>Mood</Th>
                  <Th>Uang</Th>
                  <Th>Lokasi</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {snapshot.npcs.map((n, i) => (
                  <tr key={n.id} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <Td className="text-white">{n.name}</Td>
                    <Td className="text-slate-400">{n.age}</Td>
                    <Td className="text-slate-300">{n.job}</Td>
                    <Td className={moodClass(n.mood)}>{n.mood}</Td>
                    <Td className="text-neon-lime">{formatRupiah(n.money)}</Td>
                    <Td className="text-slate-400">{n.location}</Td>
                    <Td className="text-slate-300">{n.status}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-2 text-[10px] font-mono text-slate-500 italic border-t border-white/5">
            Data warga akan otomatis ter-update saat AI NPC dipasang di tahap berikutnya.
          </div>
        </Panel>

        {/* === Tabel bangunan + log drama === */}
        <Panel title="Log Drama NPC" accent="pink" className="overflow-hidden">
          <div className="max-h-[420px] overflow-y-auto px-3 py-2 flex flex-col gap-1.5">
            {snapshot.dramaLog.length === 0 ? (
              <div className="text-[11px] font-mono text-slate-500 italic">Belum ada drama.</div>
            ) : (
              snapshot.dramaLog.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{d.time}</span>
                    <span className={`uppercase tracking-wider ${categoryClass(d.category)}`}>
                      {d.category}
                    </span>
                  </div>
                  <div className={`text-[11px] mt-0.5 ${sevColor(d.severity)}`}>{d.text}</div>
                </motion.div>
              ))
            )}
          </div>
        </Panel>

        <Panel
          title="Tabel Bangunan"
          accent="violet"
          className="lg:col-span-2 overflow-hidden"
          right={<span className="font-mono text-[10px] text-slate-500">{snapshot.buildings.length} bangunan</span>}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono">
              <thead className="bg-white/[0.02] text-slate-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <Th>Nama</Th>
                  <Th>Tipe</Th>
                  <Th>Distrik</Th>
                  <Th>Status</Th>
                  <Th>Progress</Th>
                </tr>
              </thead>
              <tbody>
                {snapshot.buildings.map((b, i) => (
                  <tr key={b.id} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <Td className="text-white">{b.name}</Td>
                    <Td className="text-slate-300">{b.type}</Td>
                    <Td className="text-slate-400">{b.district}</Td>
                    <Td className={statusClass(b.status)}>{b.status}</Td>
                    <Td className="text-neon-violet">
                      {b.progress < 1 ? `${Math.floor(b.progress * 100)}%` : '—'}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="text-left px-3 py-2 font-medium">{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-3 py-1.5 ${className}`}>{children}</td>;
}

function moodClass(mood) {
  switch (mood) {
    case 'Bahagia': return 'text-neon-lime';
    case 'Senang':  return 'text-neon-cyan';
    case 'Galau':   return 'text-neon-violet';
    case 'Stres':   return 'text-neon-amber';
    case 'Lelah':   return 'text-neon-amber';
    case 'Sedih':   return 'text-neon-blue';
    case 'Marah':   return 'text-neon-red';
    default:        return 'text-slate-300';
  }
}
function statusClass(status) {
  if (status.includes('Dibangun')) return 'text-neon-violet';
  if (status.includes('Penuh'))    return 'text-neon-blue';
  if (status === 'Ramai')          return 'text-neon-lime';
  if (status === 'Sepi')           return 'text-slate-500';
  if (status === 'Aktif')          return 'text-neon-cyan';
  if (status === 'Normal')         return 'text-neon-cyan';
  return 'text-slate-300';
}
function sevColor(sev) {
  switch (sev) {
    case 'alert': return 'text-neon-red';
    case 'warn':  return 'text-neon-amber';
    case 'good':  return 'text-neon-lime';
    default:      return 'text-slate-300';
  }
}
function categoryClass(cat) {
  switch (cat) {
    case 'KONFLIK':
    case 'KRIMINAL':    return 'text-neon-red';
    case 'CINTA':       return 'text-neon-pink';
    case 'DRAMA':       return 'text-neon-amber';
    case 'PRESTASI':    return 'text-neon-lime';
    case 'PEKERJAAN':   return 'text-neon-blue';
    case 'KEBAIKAN':    return 'text-neon-cyan';
    case 'EKONOMI':     return 'text-neon-amber';
    case 'CUACA':       return 'text-neon-blue';
    case 'PEMBANGUNAN': return 'text-neon-violet';
    default:            return 'text-slate-400';
  }
}
