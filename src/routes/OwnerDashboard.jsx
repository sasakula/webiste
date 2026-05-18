// =============================================================================
// /owner — Owner Dashboard lengkap (control center cyberpunk).
//
// Layout:
//   - Owner Sidebar (12 menu)  ← hanya muncul di route ini
//   - Workspace area, isi tergantung tab aktif
//
// 12 tab: ringkasan, warga, bangunan, pekerjaan, ekonomi, kriminalitas,
// relasi, proyek, event, live (kontrol simulasi), audio, pengaturan, log.
// =============================================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import OwnerSidebar from '../components/owner/OwnerSidebar.jsx';
import OwnerStatGrid from '../components/owner/OwnerStatGrid.jsx';
import OwnerSimControls from '../components/owner/OwnerSimControls.jsx';
import OwnerAudioPanel from '../components/owner/OwnerAudioPanel.jsx';

import PageHeader from '../components/ui/PageHeader.jsx';
import Panel from '../components/ui/Panel.jsx';
import CityCanvas from '../components/city/CityCanvas.jsx';

import { useSimulation } from '../hooks/useSimulation.js';
import { describeCrime } from '../simulation/crimeSystem.js';
import { formatRupiah, formatPercent } from '../utils/formatter.js';

export default function OwnerDashboard() {
  const sim = useSimulation();
  const { snapshot, togglePause, setSpeed, reset } = sim;
  const [tab, setTab] = useState('ringkasan');

  return (
    <div className="h-full w-full flex overflow-hidden">
      {/* Owner sidebar khusus halaman ini */}
      <OwnerSidebar activeTab={tab} onChange={setTab} />

      {/* Workspace */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        <PageHeader
          eyebrow="Owner Dashboard"
          title={titleFor(tab)}
          subtitle={subtitleFor(tab)}
          right={
            <span className={`chip ${snapshot.paused ? 'text-neon-amber border-neon-amber/40' : 'text-neon-cyan border-neon-cyan/40'}`}>
              {snapshot.paused ? 'Jeda' : `Live ${snapshot.speed}x`}
            </span>
          }
        />

        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-4"
        >
          {renderTab(tab, snapshot, { togglePause, setSpeed, reset })}
        </motion.div>
      </div>
    </div>
  );
}

// === Title / subtitle per tab ===
function titleFor(t) {
  switch (t) {
    case 'ringkasan':     return 'Ringkasan Kota';
    case 'warga':         return 'Warga / NPC';
    case 'bangunan':      return 'Daftar Bangunan';
    case 'pekerjaan':     return 'Pekerjaan & Lapangan Kerja';
    case 'ekonomi':       return 'Ekonomi Kota';
    case 'kriminalitas':  return 'Kriminalitas';
    case 'relasi':        return 'Relasi & Drama';
    case 'proyek':        return 'Proyek Pembangunan';
    case 'event':         return 'Event Dunia';
    case 'live':          return 'Live Control';
    case 'audio':         return 'Kontrol Audio';
    case 'pengaturan':    return 'Pengaturan';
    case 'log':           return 'Log Sistem';
    default:              return 'Dashboard';
  }
}
function subtitleFor(t) {
  switch (t) {
    case 'ringkasan':     return 'Statistik kota, preview pixel-art, dan kontrol simulasi.';
    case 'warga':         return 'Tabel lengkap semua warga kota.';
    case 'bangunan':      return 'Tabel bangunan dengan tipe, distrik, status, dan kapasitas.';
    case 'pekerjaan':     return 'Pekerjaan tersedia dan distribusi profesi.';
    case 'ekonomi':       return 'Indeks ekonomi, kebahagiaan, dan kondisi pasar.';
    case 'kriminalitas':  return 'Tingkat kriminalitas kota dan kasus aktif.';
    case 'relasi':        return 'Drama warga, konflik, cinta, dan persahabatan.';
    case 'proyek':        return 'Bangunan yang sedang dibangun dan progress.';
    case 'event':         return 'Feed kejadian seluruh kota.';
    case 'live':          return 'Kontrol simulasi dan akses cepat ke /live.';
    case 'audio':         return 'Atur musik, ambient, efek suara, dan mode otomatis.';
    case 'pengaturan':    return 'Tema, kecepatan default, parameter dunia.';
    case 'log':           return 'Catatan internal sistem untuk debugging.';
    default:              return '';
  }
}

// === Renderer tab ===
function renderTab(tab, snapshot, actions) {
  switch (tab) {
    case 'ringkasan':    return <TabRingkasan    snapshot={snapshot} actions={actions} />;
    case 'warga':        return <TabWarga        snapshot={snapshot} />;
    case 'bangunan':     return <TabBangunan     snapshot={snapshot} />;
    case 'pekerjaan':    return <TabPekerjaan    snapshot={snapshot} />;
    case 'ekonomi':      return <TabEkonomi      snapshot={snapshot} />;
    case 'kriminalitas': return <TabKriminalitas snapshot={snapshot} />;
    case 'relasi':       return <TabRelasi       snapshot={snapshot} />;
    case 'proyek':       return <TabProyek       snapshot={snapshot} />;
    case 'event':        return <TabEvent        snapshot={snapshot} />;
    case 'live':         return <TabLive         snapshot={snapshot} actions={actions} />;
    case 'audio':        return <OwnerAudioPanel />;
    case 'pengaturan':   return <TabPengaturan />;
    case 'log':          return <TabLog          snapshot={snapshot} />;
    default:             return null;
  }
}

// =============================================================================
// Tab implementations
// =============================================================================

function TabRingkasan({ snapshot, actions }) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      {/* Statistik */}
      <div className="lg:col-span-2">
        <OwnerStatGrid snapshot={snapshot} />
      </div>

      {/* Kontrol mini di kanan */}
      <OwnerSimControls
        snapshot={snapshot}
        onTogglePause={actions.togglePause}
        onSetSpeed={actions.setSpeed}
        onReset={actions.reset}
      />

      {/* Preview kota */}
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

      {/* Event terbaru */}
      <Panel title="Event Terbaru" accent="cyan" className="overflow-hidden">
        <div className="max-h-[420px] overflow-y-auto px-3 py-2 flex flex-col">
          {snapshot.eventLog.length === 0 ? (
            <Empty>Belum ada kejadian.</Empty>
          ) : snapshot.eventLog.slice(0, 25).map((e) => (
            <div key={e.id} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
              <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-0.5">[{e.time}]</span>
              <span className={`text-[11px] leading-snug ${sevColor(e.severity)}`}>{e.text}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function TabWarga({ snapshot }) {
  return (
    <Panel
      title="Tabel Warga / NPC"
      accent="cyan"
      className="overflow-hidden"
      right={<span className="font-mono text-[10px] text-slate-500">{snapshot.npcs.length} warga</span>}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-[11px] font-mono">
          <thead className="bg-white/[0.02] text-slate-500 uppercase tracking-wider text-[10px]">
            <tr>
              <Th>Nama</Th>
              <Th>Pekerjaan</Th>
              <Th>Status</Th>
              <Th>Lokasi</Th>
              <Th>Mood</Th>
              <Th>Lapar</Th>
              <Th>Energi</Th>
              <Th>Kesehatan</Th>
              <Th>Uang</Th>
              <Th>Rumah</Th>
              <Th>Risiko Drama</Th>
            </tr>
          </thead>
          <tbody>
            {snapshot.npcs.map((n, i) => (
              <tr key={n.id} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                <Td className="text-white">{n.name}</Td>
                <Td className="text-slate-300">{n.job}</Td>
                <Td className="text-slate-400">{n.status}</Td>
                <Td className="text-slate-400">{n.location}</Td>
                <Td className={moodClass(n.mood)}>{n.mood}</Td>
                <Td><MeterMini value={n.hunger}    color="#fbbf24" /></Td>
                <Td><MeterMini value={n.energy}    color="#22d3ee" /></Td>
                <Td><MeterMini value={n.health}    color="#a3e635" /></Td>
                <Td className="text-neon-lime">{formatRupiah(n.money)}</Td>
                <Td className="text-slate-400">{n.home ?? '—'}</Td>
                <Td className={riskClass(n.stress)}>{riskLabel(n.stress)}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function TabBangunan({ snapshot }) {
  return (
    <Panel
      title="Tabel Bangunan"
      accent="violet"
      className="overflow-hidden"
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
              <Th>Pemilik</Th>
              <Th>Kapasitas</Th>
              <Th>Keramaian</Th>
              <Th>Risiko</Th>
              <Th>Event Aktif</Th>
            </tr>
          </thead>
          <tbody>
            {snapshot.buildings.map((b, i) => {
              const occupancy = occupancyOf(b, snapshot.npcs);
              const cap = capacityOf(b);
              return (
                <tr key={b.id} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <Td className="text-white">{b.name}</Td>
                  <Td className="text-slate-300">{b.type}</Td>
                  <Td className="text-slate-400">{b.district}</Td>
                  <Td className={statusClass(b.status)}>
                    {b.status}
                    {b.status === 'Dibangun' && b.progress != null
                      ? ` (${Math.floor(b.progress * 100)}%)`
                      : ''}
                  </Td>
                  <Td className="text-slate-400">{ownerOf(b, snapshot.npcs)}</Td>
                  <Td className="text-slate-300">{cap}</Td>
                  <Td><MeterMini value={(occupancy / cap) * 100} color="#22d3ee" /></Td>
                  <Td className={riskClass(b.status === 'Dibangun' ? 60 : 25)}>
                    {b.status === 'Dibangun' ? 'Sedang' : 'Rendah'}
                  </Td>
                  <Td className="text-slate-400">
                    {b.status === 'Ramai' ? 'Promo aktif' : '—'}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function TabPekerjaan({ snapshot }) {
  // Hitung distribusi profesi.
  const counts = {};
  for (const n of snapshot.npcs) counts[n.job] = (counts[n.job] || 0) + 1;
  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Panel title="Distribusi Profesi" accent="cyan">
        <div className="px-3 py-3 flex flex-col gap-1.5">
          {rows.map(([job, n]) => (
            <div key={job} className="flex items-center gap-3">
              <span className="w-40 text-[11px] font-mono text-slate-300 truncate">{job}</span>
              <div className="flex-1"><MeterMini value={(n / snapshot.npcs.length) * 100} color="#22d3ee" /></div>
              <span className="w-10 text-right text-[11px] font-mono text-neon-cyan">{n}</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Lapangan Kerja Tersedia" accent="violet">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px] font-mono">
            <thead className="bg-white/[0.02] text-slate-500 uppercase tracking-wider text-[10px]">
              <tr>
                <Th>Bangunan</Th>
                <Th>Tipe</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {snapshot.buildings
                .filter((b) => ['kantor', 'kafe', 'toko', 'warung', 'klinik', 'polisi'].includes(b.type))
                .map((b, i) => (
                  <tr key={b.id} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <Td className="text-white">{b.name}</Td>
                    <Td className="text-slate-300">{b.type}</Td>
                    <Td className={statusClass(b.status)}>{b.status}</Td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

function TabEkonomi({ snapshot }) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Panel title="Indeks Ekonomi" accent="amber" className="lg:col-span-2">
        <div className="px-3 py-4 flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl text-neon-amber">{snapshot.ekonomiIndex}</span>
            <span className={`chip ${ekoStatusColor(snapshot.ekonomi)}`}>{snapshot.ekonomi}</span>
          </div>
          <MeterMini value={snapshot.ekonomiIndex / 1.8} color="#fbbf24" />
          <div className="text-[11px] font-mono text-slate-400 leading-relaxed mt-2">
            Indeks 100 = baseline. Naik di atas 120, Krisis di bawah 50.
            Ekonomi mempengaruhi gaji NPC, kebahagiaan, dan kemungkinan toko bangkrut.
          </div>
        </div>
      </Panel>
      <Panel title="Kebahagiaan" accent="pink">
        <div className="px-3 py-4 flex flex-col gap-3">
          <div className="font-display text-3xl text-neon-pink">{formatPercent(snapshot.kebahagiaan)}</div>
          <MeterMini value={snapshot.kebahagiaan} color="#ec4899" />
          <div className="text-[11px] font-mono text-slate-400">
            Indeks komposit ekonomi + (100−kriminalitas).
          </div>
        </div>
      </Panel>
    </div>
  );
}

function TabKriminalitas({ snapshot }) {
  const crime = describeCrime(snapshot.kriminalitas);
  const recent = snapshot.dramaLog.filter((d) => d.category === 'KRIMINAL' || d.category === 'KONFLIK').slice(0, 12);
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <Panel title="Tingkat Kriminalitas" accent="pink" className="lg:col-span-1">
        <div className="px-3 py-4 flex flex-col gap-3">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl" style={{ color: crime.color }}>{crime.label}</span>
          </div>
          <MeterMini value={snapshot.kriminalitas} color={crime.color} />
          <div className="text-[11px] font-mono text-slate-400">
            Skor saat ini: {formatPercent(snapshot.kriminalitas)}.
          </div>
        </div>
      </Panel>
      <Panel title="Drama Kriminal & Konflik" accent="pink" className="lg:col-span-2 overflow-hidden">
        <div className="px-3 py-2 flex flex-col gap-1.5">
          {recent.length === 0 ? <Empty>Tidak ada kasus saat ini.</Empty> :
            recent.map((d) => (
              <div key={d.id} className="rounded-md border border-neon-red/20 bg-neon-red/5 px-2 py-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>[{d.time}]</span>
                  <span className="text-neon-red uppercase tracking-wider">{d.category}</span>
                </div>
                <div className="text-[11px] mt-0.5 text-slate-200">{d.text}</div>
              </div>
            ))}
        </div>
      </Panel>
    </div>
  );
}

function TabRelasi({ snapshot }) {
  return (
    <Panel title="Drama & Relasi Warga" accent="pink" className="overflow-hidden">
      <div className="max-h-[640px] overflow-y-auto px-3 py-2 flex flex-col gap-1.5">
        {snapshot.dramaLog.length === 0 ? <Empty>Belum ada drama.</Empty> :
          snapshot.dramaLog.map((d) => (
            <div key={d.id} className="rounded-md border border-white/5 bg-white/[0.02] px-2 py-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>[{d.time}] · Hari {d.hari ?? '—'}</span>
                <span className={`uppercase tracking-wider ${categoryClass(d.category)}`}>{d.category}</span>
              </div>
              <div className={`text-[11px] mt-0.5 ${sevColor(d.severity)}`}>{d.text}</div>
            </div>
          ))}
      </div>
    </Panel>
  );
}

function TabProyek({ snapshot }) {
  const proyek = snapshot.buildings.filter((b) => b.status === 'Dibangun');
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Panel title="Proyek Aktif" accent="violet">
        <div className="px-3 py-3 flex flex-col gap-2">
          {proyek.length === 0 ? <Empty>Tidak ada proyek aktif.</Empty> :
            proyek.map((b) => (
              <div key={b.id} className="rounded-md border border-neon-violet/30 bg-neon-violet/5 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm text-white">{b.name}</span>
                  <span className="font-mono text-[11px] text-neon-violet">
                    {Math.floor((b.progress || 0) * 100)}%
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-500 mb-1">
                  {b.type} · {b.district}
                </div>
                <MeterMini value={(b.progress || 0) * 100} color="#a855f7" />
              </div>
            ))}
        </div>
      </Panel>
      <Panel title="Bangunan Selesai" accent="cyan">
        <div className="px-3 py-3 text-[11px] font-mono text-slate-400">
          {snapshot.buildings.filter((b) => b.status !== 'Dibangun').length} bangunan
          beroperasi penuh saat ini.
        </div>
      </Panel>
    </div>
  );
}

function TabEvent({ snapshot }) {
  return (
    <Panel
      title="Feed Kejadian Lengkap"
      accent="cyan"
      className="overflow-hidden"
      right={<span className="font-mono text-[10px] text-slate-500">{snapshot.eventLog.length} entri</span>}
    >
      <div className="max-h-[640px] overflow-y-auto px-3 py-2 flex flex-col">
        {snapshot.eventLog.length === 0 ? <Empty>Belum ada kejadian.</Empty> :
          snapshot.eventLog.map((e) => (
            <div key={e.id} className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0">
              <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-0.5">[{e.time}]</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-slate-500 shrink-0 mt-0.5 w-24">
                {e.category}
              </span>
              <span className={`text-[11px] leading-snug ${sevColor(e.severity)}`}>{e.text}</span>
            </div>
          ))}
      </div>
    </Panel>
  );
}

function TabLive({ snapshot, actions }) {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <OwnerSimControls
          snapshot={snapshot}
          onTogglePause={actions.togglePause}
          onSetSpeed={actions.setSpeed}
          onReset={actions.reset}
        />
      </div>
      <Panel title="Akses Cepat" accent="cyan">
        <div className="px-3 py-3 flex flex-col gap-2 text-[11px] font-mono">
          <Link to="/live" target="_blank" rel="noopener" className="chip text-neon-cyan border-neon-cyan/40 hover:bg-neon-cyan/10 justify-between">
            <span>Live · 16:9</span><span>↗</span>
          </Link>
          <Link to="/live-vertical" target="_blank" rel="noopener" className="chip text-neon-pink border-neon-pink/40 hover:bg-neon-pink/10 justify-between">
            <span>Live · 9:16</span><span>↗</span>
          </Link>
          <Link to="/" className="chip text-slate-400 hover:text-white justify-between">
            <span>Halaman Pemilihan Mode</span><span>→</span>
          </Link>
        </div>
      </Panel>
    </div>
  );
}

function TabPengaturan() {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 max-w-4xl">
      <Panel title="Tampilan" accent="violet">
        <div className="px-3 py-3 flex flex-col gap-3 text-xs">
          <Row label="Tema" value="Cyberpunk Gelap (default)" />
          <Row label="Mode Sinematik (Live)" value="Aktif" />
          <Row label="Kamera Otomatis" value="Aktif" />
        </div>
      </Panel>
      <Panel title="Simulasi" accent="cyan">
        <div className="px-3 py-3 flex flex-col gap-3 text-xs">
          <Row label="Kecepatan Default" value="1x" />
          <Row label="Populasi Awal" value="20 warga" />
          <Row label="Bahasa UI" value="Bahasa Indonesia" />
        </div>
      </Panel>
      <Panel title="Catatan" accent="pink" className="md:col-span-2">
        <div className="px-3 py-3 text-xs text-slate-400 leading-relaxed">
          Pengaturan ini sudah berlaku otomatis. Slider/input editor live akan
          dipasang di tahap berikutnya seiring fitur AI dunia diperluas.
        </div>
      </Panel>
    </div>
  );
}

function TabLog({ snapshot }) {
  // "Log Sistem" = ringkasan internal — populasi, total event, dll.
  const lines = [
    `world.hari       = ${snapshot.hari}`,
    `world.jam.menit  = ${String(snapshot.jam).padStart(2,'0')}:${String(snapshot.menit).padStart(2,'0')}`,
    `world.waktuHari  = "${snapshot.waktuHari}"`,
    `world.cuaca      = "${snapshot.cuaca}"`,
    `world.ekonomi    = "${snapshot.ekonomi}" (idx ${snapshot.ekonomiIndex})`,
    `world.kriminalitas = ${snapshot.kriminalitas.toFixed(1)}`,
    `world.kebahagiaan  = ${snapshot.kebahagiaan.toFixed(1)}`,
    `world.populasi   = ${snapshot.populasi}`,
    `world.npcs.length        = ${snapshot.npcs.length}`,
    `world.buildings.length   = ${snapshot.buildings.length}`,
    `world.eventLog.length    = ${snapshot.eventLog.length}`,
    `world.dramaLog.length    = ${snapshot.dramaLog.length}`,
    `world.paused / speed     = ${snapshot.paused} / ${snapshot.speed}x`,
  ];
  return (
    <Panel title="Log Sistem (Realtime)" accent="cyan">
      <div className="px-3 py-3 font-mono text-[11px] text-slate-300 leading-relaxed bg-black/20 rounded-md mx-3 my-3">
        {lines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </Panel>
  );
}

// =============================================================================
// Helpers
// =============================================================================

function MeterMini({ value, color = '#22d3ee' }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className="h-full rounded-full transition-[width]"
        style={{
          width: `${v}%`,
          background: `linear-gradient(90deg, ${color}, ${color}aa)`,
          boxShadow: `0 0 6px ${color}55`,
        }}
      />
    </div>
  );
}

function Th({ children }) {
  return <th className="text-left px-3 py-2 font-medium">{children}</th>;
}
function Td({ children, className = '' }) {
  return <td className={`px-3 py-1.5 ${className}`}>{children}</td>;
}
function Empty({ children }) {
  return <div className="text-[11px] font-mono text-slate-500 italic">{children}</div>;
}
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px]">{label}</span>
      <span className="text-slate-200 font-mono">{value}</span>
    </div>
  );
}

function moodClass(mood) {
  switch (mood) {
    case 'Bahagia': return 'text-neon-lime';
    case 'Senang':  return 'text-neon-cyan';
    case 'Galau':   return 'text-neon-violet';
    case 'Sedih':   return 'text-neon-blue';
    case 'Marah':   return 'text-neon-red';
    case 'Lelah':   return 'text-neon-amber';
    default:        return 'text-slate-300';
  }
}
function statusClass(status) {
  if (!status) return 'text-slate-300';
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
function ekoStatusColor(s) {
  switch (s) {
    case 'Naik':   return 'text-neon-lime border-neon-lime/40 bg-neon-lime/10';
    case 'Stabil': return 'text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10';
    case 'Turun':  return 'text-neon-amber border-neon-amber/40 bg-neon-amber/10';
    case 'Krisis': return 'text-neon-red border-neon-red/40 bg-neon-red/10';
    default:       return 'text-slate-300 border-white/10';
  }
}
function riskClass(stress) {
  if (stress >= 70) return 'text-neon-red';
  if (stress >= 40) return 'text-neon-amber';
  return 'text-slate-400';
}
function riskLabel(stress) {
  if (stress >= 70) return 'Tinggi';
  if (stress >= 40) return 'Sedang';
  return 'Rendah';
}

function occupancyOf(building, npcs) {
  return npcs.filter((n) => n.location === building.name).length;
}
function capacityOf(b) {
  switch (b.type) {
    case 'apartemen': return 12;
    case 'kafe': case 'kantor': case 'toko': return 8;
    case 'rumah': case 'warung': return 4;
    case 'klinik': return 6;
    case 'polisi': return 5;
    default: return 5;
  }
}
function ownerOf(b, npcs) {
  // Pemilik = NPC pertama yang lokasi-nya bangunan ini DAN profesinya cocok.
  if (b.type === 'rumah') {
    const r = npcs.find((n) => n.home === b.name);
    return r?.name ?? '—';
  }
  if (b.type === 'kafe' || b.type === 'warung' || b.type === 'toko') {
    const r = npcs.find((n) => n.employer === b.name);
    return r?.name ?? 'Kota';
  }
  return 'Kota';
}
