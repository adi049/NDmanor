import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import SEO from './components/SEO';
import ScrollProgress from './components/ScrollProgress';
import Home from './pages/Home';
import About from './pages/About';
import Rooms from './pages/Rooms';
import RoomDetail from './pages/RoomDetail';
import Dining from './pages/Dining';
import Events from './pages/Events';
import GalleryPage from './pages/GalleryPage';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      window.requestAnimationFrame(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <SEO path={location.pathname} />
      <ScrollProgress />
      <Header />
      <main id="main-content" className="page-transition" key={location.pathname} tabIndex={-1}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:slug" element={<RoomDetail />} />
          <Route path="/dining" element={<Dining />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/privacy" element={<Legal type="privacy" />} />
          <Route path="/terms" element={<Legal type="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
