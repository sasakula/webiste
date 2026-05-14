import Icon from '../components/Icon.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import testimonials from '../data/testimonials.js';

const Testimonials = () => (
  <section className="section bg-white">
    <div className="container-page flex flex-col gap-12">
      <SectionTitle
        eyebrow="Testimoni"
        title="Kata Mereka yang Sudah Cetak Bareng Kami"
        description="Cerita nyata dari pelaku UMKM, sekolah, mahasiswa, dan event organizer yang sudah jadi langganan."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {testimonials.map((item, idx) => (
          <figure
            key={item.id}
            className="reveal card p-6 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-soft"
            style={{ transitionDelay: `${idx * 80}ms` }}
          >
            <div className="flex gap-1 text-accent-400">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Icon
                  key={i}
                  name="star"
                  className="w-4 h-4"
                  strokeWidth={0}
                />
              ))}
            </div>
            <blockquote className="text-sm text-brand-800 leading-relaxed">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto flex items-center gap-3 pt-2 border-t border-brand-100">
              <img
                src={item.avatar}
                alt={item.name}
                className="h-10 w-10 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-semibold text-brand-900">
                  {item.name}
                </p>
                <p className="text-xs text-brand-700/70">{item.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
