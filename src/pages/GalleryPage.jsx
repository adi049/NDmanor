import Gallery from '../components/Gallery';
import PageHero from '../components/PageHero';
import Reveal from '../components/Reveal';
import { galleryItems } from '../data/gallery';

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="See ND Manor, frame by frame."
        intro="Browse genuine hotel photography by space. Select any image to open the full-screen viewer."
        image={{ src: '/images/exterior-hero.webp', thumbnail: '/images/exterior-hero-thumb.webp', alt: 'Illuminated entrance of Hotel ND Manor in the evening' }}
      />
      <section className="section-pad full-gallery">
        <div className="container">
          <Reveal className="full-gallery__intro"><p>From the arrival and guest rooms to the restaurant and banquet settings, explore the property through original ND Manor photography.</p><span>{galleryItems.length} photographs</span></Reveal>
          <Gallery items={galleryItems} filters />
        </div>
      </section>
    </>
  );
}
