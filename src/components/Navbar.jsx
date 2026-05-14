import { useEffect, useState } from 'react';
import { buildWhatsAppLink, SITE } from '../config/site.js';
import Icon from './Icon.jsx';

const NAV_LINKS = [
  { href: '#katalog', label: 'Katalog' },
  { href: '#keunggulan', label: 'Keunggulan' },
  { href: '#cara-order', label: 'Cara Order' },
  { href: '#promo', label: 'Promo' },
  { href: '#faq', label: 'FAQ' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => setOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <a
          href="#top"
          className="flex items-center gap-2 font-display text-lg font-bold text-brand-900"
          onClick={handleClick}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-800 text-accent-400 shadow-soft">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M7 4h10v4H7zM5 9h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2v-3H7v3H5a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2zm4 8h6v3H9z" />
            </svg>
          </span>
          {SITE.brand}
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-brand-800 hover:text-brand-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex">
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noreferrer noopener"
            className="btn-primary"
          >
            <Icon name="whatsapp" className="w-4 h-4" />
            WhatsApp
          </a>
        </div>

        <button
          type="button"
          aria-label={open ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-100 bg-white text-brand-800"
        >
          <Icon name={open ? 'close' : 'menu'} className="w-5 h-5" />
        </button>
      </div>

      <div
        className={`lg:hidden overflow-hidden bg-white border-t border-brand-100 transition-[max-height,opacity] duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container-page flex flex-col gap-1 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleClick}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-50"
            >
              {link.label}
            </a>
          ))}
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noreferrer noopener"
            onClick={handleClick}
            className="btn-primary mt-2"
          >
            <Icon name="whatsapp" className="w-4 h-4" />
            Pesan via WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
