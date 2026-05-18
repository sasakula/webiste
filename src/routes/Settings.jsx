// Halaman Pengaturan — tema, kecepatan, populasi awal (placeholder).
import PageHeader from '../components/ui/PageHeader.jsx';
import Panel from '../components/ui/Panel.jsx';

export default function Settings() {
  return (
    <div className="h-full overflow-y-auto">
      <PageHeader
        eyebrow="Pengaturan"
        title="Pengaturan Simulasi"
        subtitle="Atur tema, kecepatan default, dan parameter dunia."
      />
      <div className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 max-w-4xl">
        <Panel title="Tampilan" accent="violet">
          <div className="px-3 py-3 flex flex-col gap-3 text-xs">
            <Row label="Tema" value="Cyberpunk Gelap (default)" />
            <Row label="Mode Sinematik" value="Aktif" />
            <Row label="Kamera Otomatis" value="Aktif" />
          </div>
        </Panel>
        <Panel title="Simulasi" accent="cyan">
          <div className="px-3 py-3 flex flex-col gap-3 text-xs">
            <Row label="Kecepatan Default" value="1x" />
            <Row label="Populasi Awal" value="24 warga" />
            <Row label="Bahasa UI" value="Bahasa Indonesia" />
          </div>
        </Panel>
        <Panel title="Catatan" accent="pink" className="md:col-span-2">
          <div className="px-3 py-3 text-xs text-slate-400 leading-relaxed">
            Halaman ini masih bersifat placeholder. Setelah engine simulasi terpasang,
            seluruh opsi di sini akan terhubung ke state global aplikasi.
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 last:pb-0">
      <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px]">{label}</span>
      <span className="text-slate-200 font-mono">{value}</span>
    </div>
  );
}
