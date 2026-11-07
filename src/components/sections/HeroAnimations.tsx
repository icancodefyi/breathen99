'use client';
import { useEffect } from 'react';

/**
 * Landing-page scroll reveals, marquee pause and sticky buy bar.
 * (The hero and nav animate themselves with CSS; this file shrinks as sections are redesigned.)
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

    const initGSAP = async () => {
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const { ScrollToPlugin } = await import('gsap/ScrollToPlugin');
      if (cancelled) return; // effect was cleaned up while the modules were loading
      gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

      // Everything inside the context is killed and reverted by ctx.revert().
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>('.testimonial-card, .faq-item').forEach((el) => {
          gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            opacity: 0,
            y: 30,
            duration: 0.7,
            ease: 'power2.out',
          });
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

    return () => {
      cancelled = true;
      revertGsap?.();
      timers.forEach(clearTimeout);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
