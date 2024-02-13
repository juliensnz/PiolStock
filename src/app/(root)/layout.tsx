'use client';

import {CommonStyle, pimTheme} from 'akeneo-design-system';

import styled, {ThemeProvider, createGlobalStyle} from 'styled-components';
import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    ${CommonStyle};
  }

  * {
    box-sizing: border-box;
    font-family: 'Lato', sans-serif !important;
  }
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
`;

const Content = styled.div`
  overflow: hidden;
  height: 100%;
`;

const Layout = ({children}: {children: ReactNode}) => {
  return (
    <ThemeProvider theme={pimTheme}>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Container>
          <Content>{children}</Content>
        </Container>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Layout;
