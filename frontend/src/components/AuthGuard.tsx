'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }

    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    setChecked(true);
  }, [isLoginPage, pathname, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!checked) {
    return <div style={{ minHeight: '100vh' }} />;
  }

  return <>{children}</>;
}
