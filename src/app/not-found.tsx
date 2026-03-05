import type { Metadata } from 'next';

export const metadata: Metadata = { robots: { index: false } };

export default function NotFound() {
  return (
    <>
      <h1>not-found Component</h1>
    </>
  );
}
