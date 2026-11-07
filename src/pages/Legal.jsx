import { Link } from 'react-router-dom';
import { site } from '../data/site';

const content = {
  privacy: {
    title: 'Privacy Policy',
    intro: 'This policy explains what happens to the information you enter on the Hotel ND Manor website.',
    sections: [
      ['1. Overview', <p>This website is designed to help visitors learn about Hotel ND Manor and prepare direct inquiries. It does not require an account, take payments or operate a guest-profile database.</p>],
      ['2. Information you enter', <p>Depending on the form you use, you may enter your name, phone number, email address, stay dates, guest counts, room preference, event details or special requests. Please share only information that is necessary for your inquiry.</p>],
      ['3. How inquiry forms work', <p>Form entries are processed in your browser to create a prefilled WhatsApp message. Your information is not sent to the hotel by the website itself. You must review and send that message in WhatsApp to complete your inquiry.</p>],
      ['4. Storage and analytics', <p>The website does not intentionally store your form submissions in local storage or a website database. No advertising or analytics trackers have been configured in this version. The hosting provider may process standard technical logs needed to deliver and secure the website.</p>],
      ['5. External services', <p>WhatsApp, Google Maps, Instagram, Facebook and telephone links are external services. When you follow those links or interact with the embedded map, their own privacy policies and technical practices apply. You can use the direct address and telephone number instead of the embedded map if you prefer.</p>],
      ['6. Security', <p>Reasonable care has been taken to keep inquiry handling transparent and to avoid unnecessary data collection. No internet transmission or external service can be guaranteed to be completely secure.</p>],
      ['7. Your choices', <p>You can browse without submitting a form. If you have sent information to the hotel through WhatsApp or another channel, contact the hotel directly to ask about access, correction or deletion, subject to applicable requirements.</p>],
      ['8. Updates and contact', <p>This policy may be updated when the website or its inquiry workflows change. The revised date will be shown on this page. For a privacy question, call or WhatsApp the hotel using the verified number below.</p>],
    ],
  },
  terms: {
    title: 'Terms & Conditions',
    intro: 'These terms apply to your use of the Hotel ND Manor website and its inquiry features.',
    sections: [
      ['1. Website information', <p>The website presents Hotel ND Manor, its location and publicly supported accommodation, dining and event information. Specific room layouts, features, menus, event arrangements and policies can change and should be confirmed directly before you make a decision.</p>],
      ['2. Reservation inquiries', <p>The reservation form is an inquiry tool, not a real-time booking engine. Preparing or sending an inquiry does not guarantee availability or create a confirmed reservation. A stay is confirmed only when the hotel explicitly confirms it to you.</p>],
      ['3. Rates and payment', <p>No room rates, event packages or payment transactions are offered through this website. Any applicable price, tax, deposit, cancellation condition or payment arrangement will be communicated by the hotel directly. Review those terms before agreeing to a booking.</p>],
      ['4. Event inquiries', <p>Event spaces, capacities, menus, décor, outside-vendor rules and other arrangements are subject to direct discussion and hotel confirmation. Submitting an event form does not reserve a date or venue.</p>],
      ['5. Photography and room preferences', <p>Photographs show the actual ND Manor property. Individual room configurations and assigned features may vary. A room preference submitted through the website is a request, not a guarantee of a particular layout or feature.</p>],
      ['6. Acceptable use', <p>Do not misuse the website, attempt to disrupt its operation, submit unlawful content or use its contact channels for unsolicited bulk messaging. You are responsible for the accuracy of the information you choose to send.</p>],
      ['7. External links and services', <p>External maps, messaging and social platforms are provided for convenience. Their availability and terms are controlled by their respective operators.</p>],
      ['8. Intellectual property', <p>The ND Manor name, website design, text and imagery may not be reused for misleading or unauthorised commercial purposes. Rights in photographs remain with their respective owners.</p>],
      ['9. Liability and changes', <p>The website is provided for general information and direct communication. To the extent permitted by law, Hotel ND Manor is not liable for decisions made solely from unconfirmed website information. These terms may be updated as services evolve.</p>],
      ['10. Contact', <p>Questions about these terms or a direct inquiry can be raised with the hotel by phone or WhatsApp using the verified contact number below.</p>],
    ],
  },
};

export default function Legal({ type }) {
  const page = content[type];
  return (
    <>
      <section className="legal-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><span>{page.title}</span></nav>
          <p className="eyebrow">Hotel ND Manor</p>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          <small>Last updated: 4 November 2026</small>
        </div>
      </section>
      <section className="section-pad legal-page">
        <div className="container legal-layout">
          <aside><p>Need clarification?</p><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a><Link to="/contact" className="text-link">Contact page</Link></aside>
          <div className="legal-content">
            {page.sections.map(([title, body]) => <section key={title}><h2>{title}</h2>{body}</section>)}
            <div className="legal-contact"><p>Hotel ND Manor</p><address>{site.address}</address><a href={`tel:${site.phone}`}>{site.phoneDisplay}</a></div>
          </div>
        </div>
      </section>
    </>
  );
}
