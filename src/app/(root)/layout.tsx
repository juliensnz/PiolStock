'use client';

import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

const Layout = ({children}: {children: ReactNode}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className="flex h-screen w-screen flex-col">
        <div className="flex h-screen flex-col">{children}</div>
      </div>
    </QueryClientProvider>
  );
};

export default Layout;
