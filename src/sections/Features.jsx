import Icon from '../components/Icon.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import features from '../data/features.js';

const Features = () => (
  <section id="keunggulan" className="section bg-brand-50/60">
    <div className="container-page flex flex-col gap-12">
      <SectionTitle
        eyebrow="Keunggulan Kami"
        title="Kenapa Pilih Cetakindo Print?"
        description="Kami fokus membuat proses cetak jadi mudah, cepat, dan tidak bikin pusing - bahkan untuk kamu yang baru pertama kali pesan."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, idx) => (
          <div
            key={feature.id}
            className="reveal card p-6 hover:-translate-y-1 hover:shadow-soft"
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent-100 text-accent-600">
              <Icon name={feature.icon} className="w-6 h-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-brand-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-brand-700/80 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
