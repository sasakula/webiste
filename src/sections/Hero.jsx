import Icon from '../components/Icon.jsx';
import { buildWhatsAppLink } from '../config/site.js';

const stats = [
  { value: '5+', label: 'Tahun Pengalaman' },
  { value: '10rb+', label: 'Order Selesai' },
  { value: '4.9/5', label: 'Rating Pelanggan' },
];

const Hero = () => (
  <section
    id="top"
    className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white"
  >
    {/* Decorative blobs */}
    <div className="pointer-events-none absolute -top-32 -left-32 h-72 w-72 rounded-full bg-accent-400/30 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl" />

    <div className="container-page relative pt-28 pb-20 sm:pt-32 sm:pb-24 lg:pt-36 lg:pb-32">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-accent-400 animate-pulse" />
            Buka & Melayani Hari Ini
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            Percetakan{' '}
            <span className="text-accent-400">Cepat</span>,{' '}
            <span className="text-accent-400">Murah</span>, dan{' '}
            <span className="text-accent-400">Profesional</span>.
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/80 leading-relaxed">
            Cetak banner, stiker, nota, undangan, ID card, akrilik, dan
            kebutuhan promosi lainnya untuk UMKM, sekolah, mahasiswa, hingga
            event organizer.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-primary"
            >
              <Icon name="whatsapp" className="w-5 h-5" />
              Pesan via WhatsApp
            </a>
            <a href="#katalog" className="btn-ghost">
              Lihat Katalog
              <Icon name="arrowRight" className="w-4 h-4" />
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-2xl sm:text-3xl font-bold text-accent-400">
                  {stat.value}
                </dt>
                <dd className="text-xs sm:text-sm text-white/70">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md animate-fade-up [animation-delay:120ms]">
            <div className="relative rounded-3xl bg-white p-3 shadow-2xl rotate-1">
              <img
                src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=900&q=70"
                alt="Mesin digital printing dan hasil cetak"
                className="rounded-2xl object-cover aspect-[4/5] w-full"
                loading="eager"
              />
              <div className="absolute -bottom-5 -left-5 rounded-2xl bg-white p-4 shadow-soft animate-float-slow">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-100 text-accent-600">
                    <Icon name="bolt" className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-xs text-brand-700/70">
                      Estimasi
                    </p>
                    <p className="text-sm font-bold text-brand-900">
                      Same Day Print
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-5 -right-5 rounded-2xl bg-brand-900 p-4 text-white shadow-soft animate-float-slow [animation-delay:600ms]">
                <div className="flex items-center gap-2">
                  <Icon
                    name="star"
                    className="w-4 h-4 text-accent-400"
                    strokeWidth={0}
                  />
                  <span className="text-sm font-semibold">4.9 Rating</span>
                </div>
                <p className="mt-1 text-xs text-white/70">
                  dari 1.200+ ulasan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      className="absolute bottom-0 left-0 right-0 h-12 bg-white"
      style={{
        clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 60%)',
      }}
    />
  </section>
);

export default Hero;
