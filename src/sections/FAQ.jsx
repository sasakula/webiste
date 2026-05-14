import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import faqs from '../data/faqs.js';

const FAQ = () => {
  const [openId, setOpenId] = useState(faqs[0]?.id ?? null);

  const toggle = (id) => setOpenId((current) => (current === id ? null : id));

  return (
    <section id="faq" className="section bg-brand-50/60">
      <div className="container-page grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <SectionTitle
            eyebrow="FAQ"
            title="Pertanyaan yang Sering Ditanyakan"
            description="Belum nemu jawabannya? Langsung tanya kami via WhatsApp, kami balas cepat."
            align="left"
          />
        </div>

        <div className="lg:col-span-7 flex flex-col gap-3">
          {faqs.map((faq, idx) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="reveal card overflow-hidden"
                style={{ transitionDelay: `${idx * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold text-brand-900">
                    {faq.question}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 transition-transform ${
                      isOpen ? 'rotate-180 bg-brand-800 text-accent-400' : ''
                    }`}
                  >
                    <Icon
                      name={isOpen ? 'minus' : 'plus'}
                      className="w-4 h-4"
                    />
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm text-brand-700/85 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
