import FloatingWhatsApp from './components/FloatingWhatsApp.jsx';
import Navbar from './components/Navbar.jsx';
import useScrollReveal from './hooks/useScrollReveal.js';
import FAQ from './sections/FAQ.jsx';
import Features from './sections/Features.jsx';
import Footer from './sections/Footer.jsx';
import Hero from './sections/Hero.jsx';
import HowToOrder from './sections/HowToOrder.jsx';
import ProductCatalog from './sections/ProductCatalog.jsx';
import PromoPackages from './sections/PromoPackages.jsx';
import Testimonials from './sections/Testimonials.jsx';

const App = () => {
  useScrollReveal();

  return (
    <div className="min-h-screen bg-white text-brand-900">
      <Navbar />
      <main>
        <Hero />
        <ProductCatalog />
        <Features />
        <HowToOrder />
        <PromoPackages />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default App;
