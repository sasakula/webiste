import { buildWhatsAppLink } from '../config/site.js';
import Icon from './Icon.jsx';

const FloatingWhatsApp = () => (
  <a
    href={buildWhatsAppLink()}
    target="_blank"
    rel="noreferrer noopener"
    aria-label="Hubungi kami via WhatsApp"
    className="fixed bottom-5 right-5 z-50 flex items-center gap-2 group"
  >
    <span className="hidden sm:inline-flex rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-brand-800 shadow-soft transition-opacity group-hover:opacity-100 opacity-90">
      Chat via WhatsApp
    </span>
    <span className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform group-hover:scale-105">
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-ring" />
      <Icon name="whatsapp" className="relative w-7 h-7" strokeWidth={0} />
    </span>
  </a>
);

export default FloatingWhatsApp;
