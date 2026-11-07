'use client';
import { useEffect } from 'react';

/**
 * Landing-page intro, scroll reveals, counters, marquee pause and slideshow.
 *
 * Everything started here is undone in the cleanup. React Strict Mode (dev) runs effects
 * twice; without cleanup the GSAP `from()` tweens were created twice and the second set
 * captured the already-hidden state as its end value, leaving the hero invisible.
 */
export default function HeroAnimations() {
  useEffect(() => {
    let cancelled = false;
    let revertGsap: (() => void) | undefined;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cleanups: Array<() => void> = [];

    // Curtain dismiss
    const curtainEl = document.getElementById('curtain');
    const dismissCurtain = () => {
      if (!curtainEl) return;
      curtainEl.classList.add('fade-out');
      timers.push(setTimeout(() => curtainEl.remove(), 550));
    };
    if (document.readyState === 'complete') {
      timers.push(setTimeout(dismissCurtain, 300));
    } else {
      const onLoad = () => timers.push(setTimeout(dismissCurtain, 300));
      window.addEventListener('load', onLoad);
      cleanups.push(() => window.removeEventListener('load', onLoad));
      timers.push(setTimeout(dismissCurtain, 3000));
    }

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
      if (cancelled) return; // effect was cleaned up while the modules were loading
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      // Everything inside the context is killed and reverted by ctx.revert().
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ delay: 0.4 });
        tl.from('.hero-eyebrow', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' })
          .from('.hero-h1', { opacity: 0, y: 40, duration: 0.8, ease: 'power3.out' }, '-=0.3')
          .from('.hero-body', { opacity: 0, y: 20, duration: 0.6, ease: 'power2.out' }, '-=0.4')
          .from('.hero-price', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .from('.hero-ctas', { opacity: 0, y: 20, duration: 0.5, ease: 'power2.out' }, '-=0.3')
          .from('.hero-trust', { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' }, '-=0.2')
          .from('.product-stage', { opacity: 0, scale: 0.92, duration: 0.9, ease: 'power3.out' }, 0.3);

        gsap.to('#product-wrap', { y: -14, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });

        gsap.utils.toArray<HTMLElement>('.why-card, .callout-card, .testimonial-card, .faq-item').forEach((el) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: 'power2.out',
          });
        });

        gsap.utils.toArray<HTMLElement>('[data-target]').forEach((el) => {
          const target = parseInt(el.dataset.target || '0', 10);
          const suffix = el.dataset.suffix || '';
          gsap.fromTo(
            el,
            { innerText: 0 },
            {
              innerText: target,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 1 },
              scrollTrigger: { trigger: el, start: 'top 80%', once: true },
              onUpdate() {
                el.innerText = Math.round(parseFloat(el.innerText)) + suffix;
              },
            },
          );
        });

        gsap.to('.orbit-ring', { rotation: 360, duration: 20, repeat: -1, ease: 'none', transformOrigin: '50% 50%' });
        gsap.to('.orbit-ring-2', {
          rotation: -360,
          duration: 14,
          repeat: -1,
          ease: 'none',
          transformOrigin: '50% 50%',
        });

        const stickyBar = document.querySelector('.sticky-buy-bar') as HTMLElement;
        if (stickyBar) {
          ScrollTrigger.create({
            trigger: '#hero',
            start: 'bottom 60%',
            onEnter: () => stickyBar.classList.add('visible'),
            onLeaveBack: () => stickyBar.classList.remove('visible'),
          });
        }
      });
      revertGsap = () => ctx.revert();

      document.querySelectorAll('.marquee-wrap').forEach((wrap) => {
        const track = wrap.querySelector('.marquee-track') as HTMLElement | null;
        const pause = () => track?.style.setProperty('animation-play-state', 'paused');
        const play = () => track?.style.setProperty('animation-play-state', 'running');
        wrap.addEventListener('mouseenter', pause);
        wrap.addEventListener('mouseleave', play);
        cleanups.push(() => {
          wrap.removeEventListener('mouseenter', pause);
          wrap.removeEventListener('mouseleave', play);
        });
      });
    };

    initGSAP();

    // Slideshow
    const track = document.getElementById('slideshow-track');
    if (track) {
      let current = 0;
      const slides = Array.from(track.querySelectorAll<HTMLElement>('.slide'));
      const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('.slide-dot'));

      const goTo = (idx: number) => {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
      };

      const next = document.querySelector('.slide-next');
      const prev = document.querySelector('.slide-prev');
      const onNext = () => goTo(current + 1);
      const onPrev = () => goTo(current - 1);
      next?.addEventListener('click', onNext);
      prev?.addEventListener('click', onPrev);
      cleanups.push(() => {
        next?.removeEventListener('click', onNext);
        prev?.removeEventListener('click', onPrev);
      });
      dots.forEach((d) => {
        const onDot = () => goTo(parseInt(d.dataset.index || '0'));
        d.addEventListener('click', onDot);
        cleanups.push(() => d.removeEventListener('click', onDot));
      });

      const autoTimer = setInterval(() => goTo(current + 1), 5000);
      cleanups.push(() => clearInterval(autoTimer));
    }

    return () => {
      cancelled = true;
      revertGsap?.();
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
