'use client';
import { useState } from 'react';
import styles from './HowToVideo.module.css';

const VIDEO_ID = 'T9LWqEXDPhE';

/**
 * How-to video: a 16:9 still with a play button. The YouTube player (privacy-enhanced
 * domain) only loads when the visitor clicks play.
 */
export default function HowToVideo() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className={styles.frame}>
      {playing ? (
        <iframe
          className={styles.video}
          src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
          title="How to use breathEN"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button type="button" className={styles.poster} onClick={() => setPlaying(true)} aria-label="Play how-to video">
          {/* Remote YouTube still: a plain img avoids the optimiser's remote-image config. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className={styles.still}
            src={`https://i.ytimg.com/vi/${VIDEO_ID}/hqdefault.jpg`}
            alt=""
            loading="lazy"
          />
          <span className={styles.play} aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
