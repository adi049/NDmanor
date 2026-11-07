export default function SectionHeading({ eyebrow, title, copy, align = 'left', as: Tag = 'h2' }) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag>{title}</Tag>
      {copy && <p className="section-heading__copy">{copy}</p>}
    </div>
  );
}
