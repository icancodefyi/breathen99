import Nav from '@/components/layout/Nav';
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import WhoItHelps from '@/components/home/WhoItHelps';
import Product from '@/components/home/Product';
import Gallery from '@/components/home/Gallery';
import Testimonials from '@/components/home/Testimonials';
import Faq from '@/components/home/Faq';
import FinalCta from '@/components/home/FinalCta';
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
      <main>
        <Hero layout={layout} />
        <About />
        <WhoItHelps />
        <Product />
        <Gallery />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyBuyBar />
    </>
  );
}
