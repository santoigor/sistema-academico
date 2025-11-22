'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function InstrutorPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/instrutor/painel');
  }, [router]);

  return null;
}
