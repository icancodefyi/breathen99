import Image from 'next/image';

export default function Contact() {
  return (
    <section id="contact">
      <div className="contact-inner">
        <div className="contact-brand">
          <Image
            src="/assets/logo-white.jpg"
            className="contact-logo-img"
            alt="breathEN logo"
            width={160}
            height={48}
          />
          <p>
            The world&apos;s first nose breathing oxygen canister. 99% pure recreational oxygen for urban living,
            fitness, travel, and beyond.
          </p>
          <div className="contact-social">
            <a
              href="https://www.instagram.com/breathen_99"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>
            <a
              href="https://www.youtube.com/@breathENOXYGEN"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.97C18.88 4 12 4 12 4s-6.88 0-8.59.45A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.45a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" />
              </svg>
              YouTube
            </a>
            <a href="https://twitter.com/Breathen_99" target="_blank" rel="noopener noreferrer" className="social-link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
              X / Twitter
            </a>
          </div>
        </div>
        <div className="contact-col">
          <h4>Contact Us</h4>
          <a href="mailto:info@breathen99.com">info@breathen99.com</a>
          <a href="tel:+919819250202">+91 98192 50202</a>
          <p style={{ marginTop: 16 }}>
            Office no.01, 1st floor, B wing
            <br />
            Gami Industrial Park, Plot No. C-39A
            <br />
            Pawane MIDC, Navi Mumbai — 400705
          </p>
        </div>
        <div className="contact-col">
          <h4>Quick Links</h4>
          <a href="#about">About breathEN</a>
          <a href="#why">Why breathEN</a>
          <a href="#product">Product Details</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#faq">FAQ</a>
          <a href="https://www.youtube.com/shorts/T9LWqEXDPhE" target="_blank" rel="noopener noreferrer">
            How to Use (Video)
          </a>
        </div>
      </div>
    </section>
  );
}
