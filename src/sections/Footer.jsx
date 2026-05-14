import Icon from '../components/Icon.jsx';
import { buildWhatsAppLink, SITE } from '../config/site.js';

const Footer = () => (
  <footer className="bg-brand-950 text-white">
    {/* CTA banner */}
    <div className="container-page -mt-12 sm:-mt-16">
      <div className="reveal rounded-3xl bg-gradient-to-br from-accent-400 to-accent-500 p-8 sm:p-10 text-brand-900 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold">
            Siap mulai pesan cetakanmu?
          </h3>
          <p className="mt-2 max-w-xl text-sm sm:text-base text-brand-900/80">
            Konsultasi gratis bersama tim kami via WhatsApp. Cepat, ramah, dan
            tanpa biaya.
          </p>
        </div>
        <a
          href={buildWhatsAppLink()}
          target="_blank"
          rel="noreferrer noopener"
          className="btn bg-brand-900 text-white hover:bg-brand-800 shadow-soft"
        >
          <Icon name="whatsapp" className="w-5 h-5" />
          Chat Sekarang
        </a>
      </div>
    </div>

    <div className="container-page pt-16 pb-10">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5 flex flex-col gap-4">
          <a href="#top" className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-400 text-brand-900">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M7 4h10v4H7zM5 9h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v-3H7v3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zm4 8h6v3H9z" />
              </svg>
            </span>
            {SITE.brand}
          </a>
          <p className="text-sm text-white/70 leading-relaxed max-w-md">
            {SITE.tagline}. Melayani UMKM, sekolah, mahasiswa, dan event
            organizer di seluruh Indonesia dengan kualitas digital printing
            modern.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon name="instagram" className="w-5 h-5" />
            </a>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#25D366]/90 hover:bg-[#25D366] transition-colors"
            >
              <Icon name="whatsapp" className="w-5 h-5" strokeWidth={0} />
            </a>
            <a
              href={`mailto:${SITE.email}`}
              aria-label="Email"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Icon name="mail" className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="md:col-span-3">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent-300">
            Navigasi
          </h4>
          <ul className="mt-4 flex flex-col gap-2 text-sm text-white/75">
            <li><a href="#katalog" className="hover:text-white">Katalog Produk</a></li>
            <li><a href="#keunggulan" className="hover:text-white">Keunggulan</a></li>
            <li><a href="#cara-order" className="hover:text-white">Cara Order</a></li>
            <li><a href="#promo" className="hover:text-white">Paket Promo</a></li>
            <li><a href="#faq" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-accent-300">
            Hubungi Kami
          </h4>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-white/80">
            <li className="flex items-start gap-3">
              <Icon name="pin" className="w-5 h-5 mt-0.5 text-accent-300" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="clock" className="w-5 h-5 mt-0.5 text-accent-300" />
              <span>{SITE.hours}</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="whatsapp" className="w-5 h-5 mt-0.5 text-accent-300" strokeWidth={0} />
              <a
                href={buildWhatsAppLink()}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-white"
              >
                +{SITE.whatsappNumber}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="instagram" className="w-5 h-5 mt-0.5 text-accent-300" />
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-white"
              >
                @cetakindo.print
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-white/60">
        <p>
          &copy; {new Date().getFullYear()} {SITE.brand}. All rights reserved.
        </p>
        <p>Dibuat dengan teliti untuk hasil cetak terbaik.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
