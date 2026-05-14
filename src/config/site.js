// Central place to tweak business info, contact links, and color tokens.
export const SITE = {
  brand: 'Cetakindo Print',
  tagline: 'Percetakan Cepat, Murah, dan Profesional',
  whatsappNumber: '6281234567890', // ganti dengan nomor asli
  whatsappDefaultMessage:
    'Halo Cetakindo Print, saya ingin bertanya tentang layanan percetakan.',
  instagram: 'https://instagram.com/cetakindo.print',
  email: 'halo@cetakindoprint.id',
  address: 'Jl. Merdeka No. 123, Bandung, Jawa Barat',
  hours: 'Senin - Sabtu, 08.00 - 20.00 WIB',
};

export const buildWhatsAppLink = (message) => {
  const text = encodeURIComponent(message ?? SITE.whatsappDefaultMessage);
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
};
