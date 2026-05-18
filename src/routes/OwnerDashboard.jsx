// Dashboard Owner — tampilan admin "banyak data".
// Berisi: status dunia, kontrol simulasi, tabel warga, tabel bangunan, log lengkap.
// Belum tersambung ke engine simulasi (placeholder data).
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader.jsx';
import Panel from '../components/ui/Panel.jsx';
import StatCard from '../components/ui/StatCard.jsx';

const DUMMY_NPCS = [
  { id: 'npc_1', name: 'Rian Saputra',     age: 24, job: 'Programmer',      mood: 'Senang',  money: 'Rp450.000', loc: 'Kantor Utama',     status: 'Sedang bekerja' },
  { id: 'npc_2', name: 'Salsa Pratama',    age: 22, job: 'Barista',         mood: 'Galau',   money: 'Rp280.000', loc: 'Kafe Salsa',       status: 'Jaga kafe' },
  { id: 'npc_3', name: 'Udin Hartono',     age: 30, job: 'Tukang Bangunan', mood: 'Lelah',   money: 'Rp320.000', loc: 'Proyek Rumah',     status: 'Bangun rumah' },
  { id: 'npc_4', name: 'Kevin Wijaya',     age: 25, job: 'Pengangguran',    mood: 'Sedih',   money: 'Rp20.000',  loc: 'Taman Kota',       status: 'Cari kerja' },
  { id: 'npc_5', name: 'Linda Lestari',    age: 23, job: 'Pegawai Kantor',  mood: 'Bahagia', money: 'Rp380.000', loc: 'Kantor Utama',     status: 'Pulang kerja' },
  { id: 'npc_6', name: 'Maya Permata',     age: 28, job: 'Pemilik Usaha',   mood: 'Stres',   money: 'Rp1.200.000', loc: 'Warung Maya',    status: 'Buka usaha' },
];

const DUMMY_BUILDINGS = [
  { id: 'bld_1', name: 'Rumah Rian',         type: 'Rumah Warga',     district: 'Selatan', status: 'Dihuni',    progress: '—'    },
  { id: 'bld_2', name: 'Kafe Salsa',         type: 'Kafe',            district: 'Tengah',  status: 'Ramai',     progress: '—'    },
  { id: 'bld_3', name: 'Proyek Rumah Udin',  type: 'Rumah Warga',     district: 'Selatan', status: 'Dibangun',  progress: '45%'  },
  { id: 'bld_4', name: 'Kantor Utama',       type: 'Kantor',          district: 'Utara',   status: 'Normal',    progress: '—'    },
  { id: 'bld_5', name: 'Toko Serba Ada',     type: 'Toko',            district: 'Tengah',  status: 'Sepi',      progress: '—'    },
  { id: 'bld_6', name: 'Apartemen Neon',     type: 'Apartemen',       district: 'Utara',   status: 'Penuh 80%', progress: '—'    },
  { id: 'bld_7', name: 'Klinik Sehat',       type: 'Klinik',          district: 'Barat',   status: 'Normal',    progress: '—'    },
  { id: 'bld_8', name: 'Kantor Polisi',      type: 'Kantor Polisi',   district: 'Timur',   status: 'Aktif',     progress: '—'    },
];

const DUMMY_EVENTS = [
  { time: '06:10', sev: 'info',  text: 'Rian bangun tidur dan bersiap kerja.' },
  { time: '06:45', sev: 'info',  text: 'Salsa membeli sarapan di warung.' },
  { time: '07:30', sev: 'info',  text: 'Budi berangkat kuliah.' },
  { time: '08:10', sev: 'good',  text: 'Udin diterima kerja sebagai tukang bangunan.' },
  { time: '09:20', sev: 'info',  text: 'Maya membuka warung kecil.' },
  { time: '10:15', sev: 'info',  text: 'Proyek Rumah Rian dimulai.' },
  { time: '11:40', sev: 'warn',  text: 'Hujan membuat pembangunan tertunda.' },
  { time: '13:00', sev: 'info',  text: 'Kafe Salsa mulai ramai.' },
  { time: '14:25', sev: 'warn',  text: 'Kevin kehilangan pekerjaan.' },
  { time: '15:10', sev: 'warn',  text: 'Dinda menolak cinta Kevin.' },
  { time: '16:30', sev: 'good',  text: 'Rumah baru Udin selesai dibangun.' },
  { time: '18:00', sev: 'alert', text: 'Polisi menangkap pencuri di toko.' },
];

const SPEED_OPTIONS = ['II', '1x', '2x', '4x', '8x'];

export default function OwnerDashboard() {
  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        eyebrow="Owner"
        title="Dashboard Owner"
        subtitle="Pantau status kota, populasi, ekonomi, dan event terbaru — tampilan lengkap untuk admin."
        right={<span className="chip text-neon-cyan">Foundation</span>}
      />

      <div className="p-4 grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* === Baris 1: Kartu status (lebar 2 kolom) + kontrol simulasi === */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Populasi"       value="0 jiwa"    hint="Belum ada warga"     accent="cyan"   />
          <StatCard label="Hari Simulasi"  value="—"         hint="Belum dimulai"       accent="violet" />
          <StatCard label="Cuaca"          value="Cerah"     hint="Default"             accent="lime"   />
          <StatCard label="Ekonomi"        value="Stabil"    hint="Indeks 100"          accent="amber"  />
          <StatCard label="Kriminalitas"   value="Rendah"    hint="0%"                  accent="lime"   />
          <StatCard label="Kebahagiaan"    value="—"         hint="Menunggu data"       accent="pink"   />
          <StatCard label="Lapangan Kerja" value="—"         hint="Menunggu data"       accent="cyan"   />
          <StatCard label="Event Aktif"    value="0"         hint="Belum ada event"     accent="violet" />
        </div>
        <Panel title="Kontrol Simulasi" accent="violet">
          <div className="px-3 py-3 flex flex-col gap-3">
            <div className="grid grid-cols-5 gap-1">
              {SPEED_OPTIONS.map((sp, i) => (
                <button
                  key={i}
                  type="button"
                  disabled
                  className={`h-8 rounded-md border text-[11px] font-mono uppercase tracking-wider transition ${
                    i === 1
                      ? 'border-neon-cyan/70 bg-neon-cyan/10 text-neon-cyan'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {sp}
                </button>
              ))}
            </div>
            <div className="text-[10px] font-mono text-slate-500 leading-relaxed">
              * Tombol kontrol akan aktif setelah engine simulasi terpasang
              di tahap berikutnya.
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button disabled className="h-8 rounded-md border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-wider text-slate-500 disabled:opacity-60">
                Reset Kamera
              </button>
              <button disabled className="h-8 rounded-md border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-wider text-slate-500 disabled:opacity-60">
                Mode Sinematik
              </button>
            </div>
          </div>
        </Panel>

        {/* === Tabel warga (lebar 2 kolom) + log lengkap === */}
        <Panel
          title="Tabel Warga"
          accent="cyan"
          className="lg:col-span-2 overflow-hidden"
          right={<span className="font-mono text-[10px] text-slate-500">{DUMMY_NPCS.length} sampel</span>}
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
                {DUMMY_NPCS.map((n, i) => (
                  <tr key={n.id} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <Td className="text-white">{n.name}</Td>
                    <Td className="text-slate-400">{n.age}</Td>
                    <Td className="text-slate-300">{n.job}</Td>
                    <Td className={moodClass(n.mood)}>{n.mood}</Td>
                    <Td className="text-neon-lime">{n.money}</Td>
                    <Td className="text-slate-400">{n.loc}</Td>
                    <Td className="text-slate-300">{n.status}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-2 text-[10px] font-mono text-slate-500 italic border-t border-white/5">
            * Data di atas masih placeholder. Akan otomatis ter-isi setelah engine NPC aktif.
          </div>
        </Panel>

        <Panel title="Log Kejadian Lengkap" accent="cyan" className="overflow-hidden">
          <div className="max-h-[420px] overflow-y-auto px-3 py-2 flex flex-col">
            {DUMMY_EVENTS.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0"
              >
                <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-0.5">[{e.time}]</span>
                <span className={`text-[11px] leading-snug ${sevColor(e.sev)}`}>{e.text}</span>
              </motion.div>
            ))}
          </div>
        </Panel>

        {/* === Tabel bangunan + log drama === */}
        <Panel
          title="Tabel Bangunan"
          accent="violet"
          className="lg:col-span-2 overflow-hidden"
          right={<span className="font-mono text-[10px] text-slate-500">{DUMMY_BUILDINGS.length} sampel</span>}
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
                {DUMMY_BUILDINGS.map((b, i) => (
                  <tr key={b.id} className={`border-t border-white/5 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                    <Td className="text-white">{b.name}</Td>
                    <Td className="text-slate-300">{b.type}</Td>
                    <Td className="text-slate-400">{b.district}</Td>
                    <Td className={statusClass(b.status)}>{b.status}</Td>
                    <Td className="text-neon-violet">{b.progress}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-3 py-2 text-[10px] font-mono text-slate-500 italic border-t border-white/5">
            * Data placeholder. Bangunan akan dibuat procedural saat sistem kota dipasang.
          </div>
        </Panel>

        <Panel title="Log Drama NPC" accent="pink" className="overflow-hidden">
          <div className="px-3 py-3 text-xs text-slate-400 leading-relaxed">
            Belum ada drama. Log akan terisi otomatis setelah NPC mulai berjalan
            dan saling berinteraksi.
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
