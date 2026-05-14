import ProductCard from '../components/ProductCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import products from '../data/products.js';

const ProductCatalog = () => (
  <section id="katalog" className="section bg-white">
    <div className="container-page flex flex-col gap-12">
      <SectionTitle
        eyebrow="Katalog Produk"
        title="Semua Kebutuhan Cetakmu, Satu Tempat"
        description="Mulai dari banner besar untuk toko, stiker logo, hingga ID card panitia, semua bisa kami cetak dengan kualitas premium."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, idx) => (
          <div
            key={product.id}
            className="reveal"
            style={{ transitionDelay: `${idx * 60}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductCatalog;
