import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Layout
 * - Wraps every page with the Navbar (fixed) and optional Footer.
 * - Adds `pt-16 md:pt-20` to <main> to compensate for the fixed navbar height.
 * - showFooter prop lets individual pages opt out (e.g., TheJourney has its own footer).
 */
const Layout = ({ children, showFooter = true, noPaddingTop = false }) => {
  return (
    <div
      className="min-h-screen flex flex-col font-body-md text-on-surface bg-background dark:bg-background transition-colors duration-300"
    >
      <Navbar/>

      {/* Offset for fixed navbar */}
      <main className={`flex-grow ${noPaddingTop ? '' : 'pt-16 md:pt-20'}`}>
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;