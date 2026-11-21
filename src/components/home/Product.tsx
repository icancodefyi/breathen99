import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { benefitGroups, howToSteps } from '@/content/home';
import BenefitTabs from './BenefitTabs';
import HowToVideo from './HowToVideo';
import styles from './Product.module.css';

export default function Product() {
  return (
    <section id="product" className={styles.product} aria-labelledby="product-title">
      <div className="ds-container">
        <Reveal>
          <span className={styles.label}>The Product</span>
          <h2 id="product-title" className={styles.title}>
            Everything You Need. <span>Nothing You Don&apos;t.</span>
          </h2>
        </Reveal>

        {/* Product spotlight: the can with its two key features called out */}
        <Reveal className={styles.showcase}>
          <div className={`${styles.callout} ${styles.calloutA}`}>
            <div className={styles.calloutMedia}>
              <Image src="/assets/brand/shots/mouthpiece.png" alt="" fill sizes="(max-width: 900px) 90vw, 22vw" />
            </div>
            <span className={styles.calloutLabel}>Unique Design</span>
            <h4 className={styles.calloutTitle}>
              Nose Breathing <span>Technology</span>
            </h4>
            <p className={styles.calloutDesc}>
              Follows the body&apos;s natural breathing pathway. The specially designed mask delivers oxygen directly
              through nasal inhalation — the way nature intended.
            </p>
          </div>

          <div className={styles.canWrap}>
            <div className={styles.canImg}>
              <Image
                src="/assets/brand/shots/can-back.png"
                alt="breathEN nose breathing technology"
                fill
                sizes="(max-width: 900px) 90vw, 40vw"
              />
            </div>
          </div>

          <div className={`${styles.callout} ${styles.calloutB}`}>
            <span className={styles.calloutLabel}>Engineering</span>
            <h4 className={styles.calloutTitle}>
              Leak-Proof <span>Aluminium Can</span>
            </h4>
            <p className={styles.calloutDesc}>
              Sealed aluminium construction prevents oxygen leakage. Lightweight, recyclable, and built for on-the-go
              use. Each can holds 8.5L of 99% pure oxygen.
            </p>
          </div>
        </Reveal>

        {/* Benefits, from the brand's two benefit infographics */}
        <Reveal className={styles.benefits}>
          <div className={styles.benefitsHead}>
            <h3 className={styles.subTitle}>
              Product <span>Benefits</span>
            </h3>
            <BenefitTabs groups={benefitGroups} />
          </div>
        </Reveal>

        {/* How to use */}
        <Reveal className={styles.howto}>
          <span className={styles.label}>Instructions for Use</span>
          <h3 className={styles.subTitle}>
            Simple as <span>Taking a Breath.</span>
          </h3>
          <ol className={styles.steps}>
            {howToSteps.map((s) => (
              <li key={s.n} className={styles.step}>
                <span className={styles.stepDot} aria-hidden="true">
                  {s.n}
                </span>
                <h4 className={styles.stepTitle}>{s.h}</h4>
                <p className={styles.stepText}>{s.p}</p>
              </li>
            ))}
          </ol>
          <div className={styles.video}>
            <HowToVideo />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
