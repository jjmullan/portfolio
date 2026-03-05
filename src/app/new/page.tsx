import Home from '@pages/Home';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: 'https://youngjune.dev/new' },
};

export default function Page() {
  return <Home />;
}
