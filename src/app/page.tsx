import Nav from '@/components/layout/Nav';
import FAQ from '@/components/sections/FAQ';
import HeroAnimations from '@/components/sections/HeroAnimations';
import Curtain from '@/components/home/Curtain';
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
import FloatingCta from '@/components/home/FloatingCta';

export default function Home() {
  return (
    <>
      <Curtain />
      <Nav />
      <Hero />
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
      <FloatingCta />
      <HeroAnimations />
    </>
  );
}
