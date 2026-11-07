import { Link } from 'react-router-dom';
import HotelImage from './HotelImage';
import { Monogram } from './Logo';

export default function PageHero({ eyebrow, title, intro, image, imageNote, children }) {
  return (
    <section className={`page-hero ${image ? '' : 'page-hero--editorial'}`}>
      {image ? (
        <>
          <HotelImage image={image} eager sizes="100vw" className="page-hero__image" />
          <div className="page-hero__overlay" />
        </>
      ) : <Monogram className="page-hero__editorial-mark" />}
      <div className="container page-hero__content">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>{eyebrow}</span>
        </nav>
        <p className="eyebrow eyebrow--light">{eyebrow}</p>
        <h1>{title}</h1>
        {intro && <p className="page-hero__intro">{intro}</p>}
        {children}
        {imageNote && <p className="page-hero__image-note">{imageNote}</p>}
      </div>
    </section>
  );
}
