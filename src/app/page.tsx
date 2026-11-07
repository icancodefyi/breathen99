import Nav from '@/components/layout/Nav';
import FAQ from '@/components/sections/FAQ';
import HeroAnimations from '@/components/sections/HeroAnimations';
import Hero from '@/components/home/Hero';
import CroStripOne from '@/components/home/CroStripOne';
import About from '@/components/home/About';
import BrandMarquee from '@/components/home/BrandMarquee';
import WhoItHelps from '@/components/home/WhoItHelps';
import Product from '@/components/home/Product';
import CroStripTwo from '@/components/home/CroStripTwo';
import QuoteMarquee from '@/components/home/QuoteMarquee';
import Testimonials from '@/components/home/Testimonials';
import FinalCta from '@/components/home/FinalCta';
import Contact from '@/components/home/Contact';
import SiteFooter from '@/components/home/SiteFooter';
import StickyBuyBar from '@/components/home/StickyBuyBar';

const LAYOUTS = ['overlap', 'stagger'] as const;

// ?hero=stagger switches the headline layout. Default is 'overlap'. Remove once one is chosen.
export default async function Home({ searchParams }: { searchParams: Promise<{ hero?: string }> }) {
  const { hero } = await searchParams;
  const layout = LAYOUTS.find((l) => l === hero) ?? 'overlap';
  return (
    <>
      <Nav />
      <Hero layout={layout} />
      <CroStripOne />
      <About />
      <BrandMarquee />
      <WhoItHelps />
      <Product />
      <CroStripTwo />
      <QuoteMarquee />
      <Testimonials />
      <FAQ />
      <FinalCta />
      <Contact />
      <SiteFooter />
      <StickyBuyBar />
      <HeroAnimations />
    </>
  );
}
