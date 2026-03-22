'use client';

import {ReactNode, useState} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {Sidebar} from '@/app/(root)/components/Sidebar';
import {Toaster} from '@/components/ui/sonner';

const Layout = ({children}: {children: ReactNode}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className="flex h-screen w-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-auto">{children}</div>
      </div>
      <Toaster position="bottom-right" duration={8000} />
    </QueryClientProvider>
  );
};

export default Layout;
