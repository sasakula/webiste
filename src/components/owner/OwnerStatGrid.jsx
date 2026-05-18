// Grid statistik kota di Ringkasan Kota.
import StatCard from '../ui/StatCard.jsx';
import { formatPercent } from '../../utils/formatter.js';

export default function OwnerStatGrid({ snapshot }) {
  const clock = `${String(snapshot.jam).padStart(2, '0')}:${String(snapshot.menit).padStart(2, '0')}`;

  // Ringkasan dari snapshot.
  const totalRumah = snapshot.buildings.filter(
    (b) => (b.type === 'rumah' || b.type === 'apartemen') && b.status !== 'Dibangun',
  ).length;

  const slotsKerja = snapshot.buildings.filter((b) =>
    ['kantor', 'kafe', 'toko', 'warung', 'klinik', 'polisi'].includes(b.type)
    && b.status !== 'Dibangun' && b.status !== 'Bangkrut',
  ).length;

  const pengangguran = snapshot.npcs.filter((n) => n.job === 'Pengangguran').length;
  const eventAktif = snapshot.eventLog.filter((e) => e.severity === 'warn' || e.severity === 'alert').length;
  const proyekAktif = snapshot.buildings.filter((b) => b.status === 'Dibangun').length;

  // Skor "kesehatan kota" — komposit ekonomi + (100-kriminalitas) + kebahagiaan.
  const kesehatanKota = Math.round(
    (snapshot.ekonomiIndex * 0.35
     + (100 - snapshot.kriminalitas) * 0.25
     + snapshot.kebahagiaan * 0.4)
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <StatCard label="Populasi"        value={`${snapshot.populasi} jiwa`}  hint={`Hari ${snapshot.hari} · ${clock}`}     accent="cyan"   />
      <StatCard label="Jumlah Rumah"    value={`${totalRumah}`}              hint="Termasuk apartemen"                     accent="violet" />
      <StatCard label="Pekerjaan"       value={`${slotsKerja}`}              hint="Bangunan aktif"                         accent="cyan"   />
      <StatCard label="Pengangguran"    value={`${pengangguran}`}            hint="Mencari kerja"                          accent="amber"  />
      <StatCard label="Ekonomi"         value={snapshot.ekonomi}             hint={`Indeks ${snapshot.ekonomiIndex}`}      accent="amber"  />
      <StatCard label="Cuaca"           value={snapshot.cuaca}               hint="Auto-update"                            accent="lime"   />
      <StatCard label="Kriminalitas"    value={formatPercent(snapshot.kriminalitas)} hint="Ringan = aman"                  accent="pink"   />
      <StatCard label="Kebahagiaan"     value={formatPercent(snapshot.kebahagiaan)}  hint="Indeks gabungan"                accent="pink"   />
      <StatCard label="Kesehatan Kota"  value={`${kesehatanKota}/100`}       hint="Skor komposit"                          accent="cyan"   />
      <StatCard label="Event Aktif"     value={`${eventAktif}`}              hint="Sedang penting"                         accent="violet" />
      <StatCard label="Proyek Bangunan" value={`${proyekAktif}`}             hint="Sedang dibangun"                        accent="violet" />
      <StatCard label="Status"          value={snapshot.paused ? 'Dijeda' : 'Berjalan'} hint={`Speed ${snapshot.speed}x`}  accent={snapshot.paused ? 'amber' : 'lime'} />
    </div>
  );
}
