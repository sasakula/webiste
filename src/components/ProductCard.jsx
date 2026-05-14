import { buildWhatsAppLink, SITE } from '../config/site.js';
import { formatRupiah } from '../utils/format.js';
import Icon from './Icon.jsx';

const ProductCard = ({ product }) => {
  const message = `Halo ${SITE.brand}, saya ingin pesan ${product.name}. Mohon info detail harga dan pengerjaannya.`;
  const link = buildWhatsAppLink(message);

  return (
    <article className="card group overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-soft">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        <img
          src={product.image}
          alt={`Contoh produk ${product.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute left-4 top-4 rounded-full bg-accent-400 px-3 py-1 text-xs font-semibold text-brand-900 shadow-soft">
            {product.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-brand-900">
            {product.name}
          </h3>
          <span className="shrink-0 text-sm font-semibold text-brand-700">
            <span className="text-xs font-medium text-brand-500">
              mulai
            </span>{' '}
            {formatRupiah(product.priceFrom)}
            <span className="text-xs font-normal text-brand-500">
              {product.unit}
            </span>
          </span>
        </div>
        <p className="text-sm text-brand-700/80 leading-relaxed">
          {product.description}
        </p>
        <a
          href={link}
          target="_blank"
          rel="noreferrer noopener"
          className="btn-primary mt-auto w-full"
        >
          <Icon name="whatsapp" className="w-4 h-4" />
          Pesan {product.name}
        </a>
      </div>
    </article>
  );
};

export default ProductCard;
