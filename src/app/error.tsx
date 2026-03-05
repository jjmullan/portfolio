'use client';

import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false } };

export default function GlobalError() {
  return (
    <>
      <h1>error Component</h1>
    </>
  );
}
