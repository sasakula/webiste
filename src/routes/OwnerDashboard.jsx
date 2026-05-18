// Dashboard Owner — placeholder ringkas untuk fondasi.
// Menampilkan kartu status dunia, log kejadian dummy, dan ringkasan warga.
import { motion } from 'framer-motion';
import PageHeader from '../components/ui/PageHeader.jsx';
import Panel from '../components/ui/Panel.jsx';
import StatCard from '../components/ui/StatCard.jsx';

const DUMMY_EVENTS = [
  { time: '06:10', text: 'Rian bangun tidur dan bersiap kerja.' },
  { time: '06:45', text: 'Salsa membeli sarapan di warung.' },
  { time: '07:30', text: 'Budi berangkat kuliah.' },
  { time: '08:10', text: 'Udin diterima kerja sebagai tukang bangunan.' },
];

export default function OwnerDashboard() {
  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        eyebrow="Owner"
        title="Dashboard Owner"
        subtitle="Pantau status kota, populasi, ekonomi, dan event terbaru."
        right={<span className="chip text-neon-cyan">Foundation</span>}
      />
      <div className="p-4 grid gap-4 grid-cols-1 lg:grid-cols-3">
        {/* Kolom kiri: status dunia */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Populasi"      value="0 jiwa"    hint="Belum ada warga"       accent="cyan" />
          <StatCard label="Hari Simulasi" value="—"         hint="Belum dimulai"         accent="violet" />
          <StatCard label="Cuaca"         value="Cerah"     hint="Default"               accent="lime" />
          <StatCard label="Ekonomi"       value="Stabil"    hint="Indeks 100"            accent="amber" />
          <StatCard label="Kriminalitas"  value="Rendah"    hint="0%"                    accent="lime" />
          <StatCard label="Kebahagiaan"   value="—"         hint="Menunggu data"         accent="pink" />
          <StatCard label="Lapangan Kerja" value="—"         hint="Menunggu data"         accent="cyan" />
          <StatCard label="Event Aktif"   value="0"         hint="Belum ada event"       accent="violet" />
        </div>

        {/* Kolom kanan: feed kejadian dummy */}
        <Panel title="Feed Kejadian Langsung" accent="cyan">
          <div className="px-3 py-2 flex flex-col">
            {DUMMY_EVENTS.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-2 py-1.5 border-b border-white/5 last:border-0"
              >
                <span className="font-mono text-[10px] text-slate-500 shrink-0 mt-0.5">[{e.time}]</span>
                <span className="text-[11px] leading-snug text-slate-300">{e.text}</span>
              </motion.div>
            ))}
            <div className="mt-3 text-[10px] font-mono text-slate-500 italic">
              * Data masih placeholder. Engine simulasi akan dipasang di tahap berikutnya.
            </div>
          </div>
        </Panel>

        {/* Bawah: panel placeholder */}
        <Panel title="Status Bangunan" accent="violet" className="lg:col-span-2">
          <div className="px-3 py-3 text-xs text-slate-400">
            Belum ada bangunan. Saat sistem kota dipasang, daftar bangunan akan muncul di sini.
          </div>
        </Panel>
        <Panel title="Log Drama NPC" accent="pink">
          <div className="px-3 py-3 text-xs text-slate-400">
            Belum ada drama. Log akan terisi otomatis setelah NPC mulai berjalan.
          </div>
        </Panel>
      </div>
    </div>
  );
}
