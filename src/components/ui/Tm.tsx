import { Fragment, type ReactNode } from 'react';

/** Superscript trademark mark, sized relative to the surrounding text. */
export function Tm() {
  return (
    <sup className="ds-tm" aria-hidden="true">
      ™
    </sup>
  );
}

/** Returns the string with a ™ after every visible "breathEN". */
export function withTm(text: string): ReactNode {
  const parts = text.split('breathEN');
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <>
          breathEN
          <Tm />
        </>
      )}
    </Fragment>
  ));
}
