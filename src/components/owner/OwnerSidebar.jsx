// Sidebar khusus Owner Dashboard.
// 12 menu sesuai spec — single-page tab navigation di dalam /owner.
// Tampilan ala "control center cyberpunk".

const SECTIONS = [
  { group: 'Pemantauan', items: [
    { id: 'ringkasan',     label: 'Ringkasan Kota',      icon: '◉' },
    { id: 'warga',         label: 'Warga / NPC',         icon: '☻' },
    { id: 'bangunan',      label: 'Bangunan',            icon: '▥' },
    { id: 'pekerjaan',     label: 'Pekerjaan',           icon: '▤' },
    { id: 'ekonomi',       label: 'Ekonomi',             icon: '$' },
    { id: 'kriminalitas',  label: 'Kriminalitas',        icon: '⚠' },
  ]},
  { group: 'Sosial & Dunia', items: [
    { id: 'relasi',        label: 'Relasi & Drama',      icon: '♥' },
    { id: 'proyek',        label: 'Proyek Pembangunan',  icon: '▦' },
    { id: 'event',         label: 'Event Dunia',         icon: '⚡' },
  ]},
  { group: 'Sistem', items: [
    { id: 'live',          label: 'Live Control',        icon: '◎' },
    { id: 'audio',         label: 'Kontrol Audio',       icon: '♪' },
    { id: 'pengaturan',    label: 'Pengaturan',          icon: '⚙' },
    { id: 'log',           label: 'Log Sistem',          icon: '≡' },
  ]},
];

export default function OwnerSidebar({ activeTab, onChange }) {
  return (
    <aside className="w-[230px] min-w-[230px] border-r border-white/5 bg-ink-900/60 px-2 py-4 flex flex-col gap-1 overflow-y-auto">
      <div className="px-3 mb-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon-violet/80">
          Control Center
        </div>
        <div className="font-display text-sm text-white tracking-wider">
          Owner
        </div>
      </div>

      {SECTIONS.map((section, i) => (
        <div key={section.group} className="flex flex-col gap-0.5 mb-2">
          <div className="px-3 mt-3 mb-1 font-mono text-[9px] uppercase tracking-[0.25em] text-slate-500">
            {section.group}
          </div>
          {section.items.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChange(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-mono uppercase tracking-wider transition border ${
                  active
                    ? 'border-neon-cyan/50 bg-neon-cyan/5 text-neon-cyan'
                    : 'border-transparent text-slate-400 hover:border-neon-violet/40 hover:text-white'
                }`}
              >
                <span className={active ? 'text-neon-cyan' : 'text-neon-violet'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      ))}

      <div className="mt-auto px-3 pt-3 border-t border-white/5 font-mono text-[9px] text-slate-600 uppercase tracking-[0.25em]">
        v0.2 · pixel simulator
      </div>
    </aside>
  );
}
