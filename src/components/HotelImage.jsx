import { useState } from 'react';
import imageManifest from '../data/image-manifest.json';

export const responsiveImage = (src) => {
  const name = src?.match(/\/images\/([^/]+)\.webp$/)?.[1];
  return name ? imageManifest[name] : undefined;
};

export const responsiveSrcSet = (src) => responsiveImage(src)?.sources
   .map((source) => `${import.meta.env.BASE_URL}${source.src.replace(/^\//, '')} ${source.width}w`)
  .join(', ');

export default function HotelImage({ image, className = '', thumbnail = false, eager = false, sizes, ...props }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const source = typeof image === 'string' ? { src: image, thumbnail: image, alt: '' } : image;
  const responsive = responsiveImage(source.src);
  const defaultSizes = thumbnail
    ? '(max-width: 680px) 100vw, (max-width: 1200px) 50vw, 33vw'
    : '100vw';

  return (
    <div className={`hotel-image ${loaded ? 'is-loaded' : ''} ${failed ? 'has-error' : ''} ${className}`}>
      {!failed ? (
        <img
          src={thumbnail ? source.thumbnail : source.src}
          srcSet={responsiveSrcSet(source.src)}
          alt={source.alt}
          width={responsive?.width}
          height={responsive?.height}
          loading={eager ? 'eager' : 'lazy'}
          fetchPriority={eager ? 'high' : 'auto'}
          decoding="async"
          sizes={sizes || defaultSizes}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          {...props}
        />
      ) : (
        <div className="image-fallback" role="img" aria-label={source.alt || 'Hotel photograph unavailable'}>
          <span>Photograph unavailable</span>
        </div>
      )}
    </div>
  );
}
