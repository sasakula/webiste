import Icon from '../components/Icon.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { buildWhatsAppLink } from '../config/site.js';
import promoPackages from '../data/promoPackages.js';

const PromoPackages = () => (
  <section
    id="promo"
    className="section bg-brand-900 text-white relative overflow-hidden"
  >
    <div className="pointer-events-none absolute -top-32 -right-20 h-80 w-80 rounded-full bg-accent-400/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />

    <div className="container-page relative flex flex-col gap-12">
      <div className="reveal flex flex-col gap-4 max-w-2xl mx-auto text-center items-center">
        <span className="eyebrow bg-white/10 text-accent-300">
          Paket Promo
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold leading-tight">
          Hemat dengan Paket Hemat Kami
        </h2>
        <p className="text-base sm:text-lg text-white/75 leading-relaxed">
          Pilih paket yang paling sesuai dengan kebutuhanmu, atau request paket
          custom langsung lewat WhatsApp.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promoPackages.map((pack, idx) => (
          <div
            key={pack.id}
            className={`reveal relative rounded-3xl p-7 flex flex-col gap-5 backdrop-blur transition-transform duration-300 hover:-translate-y-1 ${
              pack.featured
                ? 'bg-white text-brand-900 shadow-2xl ring-2 ring-accent-400 lg:scale-[1.03]'
                : 'bg-white/5 border border-white/10 text-white'
            }`}
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            {pack.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-400 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-900 shadow-soft">
                {pack.highlight}
              </span>
            )}

            <div>
              <h3 className="font-display text-2xl font-bold">{pack.name}</h3>
              <p
                className={`mt-1 text-sm ${
                  pack.featured ? 'text-brand-700/80' : 'text-white/70'
                }`}
              >
                {pack.description}
              </p>
            </div>

            <p className="font-display text-3xl font-bold">
              <span className={pack.featured ? 'text-brand-700' : 'text-accent-300'}>
                {pack.price}
              </span>
            </p>

            <ul className="flex flex-col gap-3 text-sm">
              {pack.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full ${
                      pack.featured
                        ? 'bg-brand-100 text-brand-700'
                        : 'bg-white/15 text-accent-300'
                    }`}
                  >
                    <Icon name="check" className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href={buildWhatsAppLink(
                `Halo, saya tertarik dengan ${pack.name}. Mohon info lebih lanjut.`
              )}
              target="_blank"
              rel="noreferrer noopener"
              className={
                pack.featured
                  ? 'btn-primary mt-auto'
                  : 'btn bg-white/10 text-white hover:bg-white/20 mt-auto'
              }
            >
              <Icon name="whatsapp" className="w-4 h-4" />
              Pesan Paket Ini
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PromoPackages;
