import Icon from '../components/Icon.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { buildWhatsAppLink } from '../config/site.js';
import orderSteps from '../data/orderSteps.js';

const HowToOrder = () => (
  <section id="cara-order" className="section bg-white">
    <div className="container-page flex flex-col gap-12">
      <SectionTitle
        eyebrow="Cara Order"
        title="5 Langkah Mudah Pesan Cetakan"
        description="Tidak perlu ribet. Kamu cukup chat WhatsApp, sisanya kami yang urus."
      />

      <div className="relative">
        {/* Connector line on desktop */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute left-0 right-0 top-7 h-0.5 bg-gradient-to-r from-brand-100 via-brand-300 to-brand-100"
        />

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {orderSteps.map((step, idx) => (
            <li
              key={step.id}
              className="reveal relative card p-6 text-center flex flex-col items-center"
              style={{ transitionDelay: `${idx * 80}ms` }}
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-800 text-accent-400 font-display text-xl font-bold shadow-soft">
                {step.id}
              </div>
              <h3 className="mt-4 text-base font-semibold text-brand-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-brand-700/80 leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="reveal mx-auto">
        <a
          href={buildWhatsAppLink('Halo, saya mau mulai order cetakan.')}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-primary"
        >
          <Icon name="whatsapp" className="w-5 h-5" />
          Mulai Pesan Sekarang
        </a>
      </div>
    </div>
  </section>
);

export default HowToOrder;
