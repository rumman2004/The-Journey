import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout
 * - Wraps every page with the Navbar (fixed) and optional Footer.
 * - Adds `pt-16 md:pt-20` to <main> to compensate for the fixed navbar height.
 * - showFooter prop lets individual pages opt out (e.g., TheJourney has its own footer).
 */
const Layout = ({ children, showFooter = true }) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#080d1a', color: '#f0ece4' }}
    >
      <Navbar />

      {/* Offset for fixed navbar */}
      <main className="flex-grow pt-16 md:pt-20">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;