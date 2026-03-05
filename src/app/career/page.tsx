import Career from '@pages/Career';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '성장 과정',
  alternates: { canonical: 'https://youngjune.dev/career' },
};

export default function Page() {
  return <Career />;
}
