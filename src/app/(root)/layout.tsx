'use client';

import {CommonStyle, sharedCatalogsTheme} from 'akeneo-design-system';

import styled, {ThemeProvider, createGlobalStyle} from 'styled-components';
import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    ${CommonStyle};
    font-family: 'Lato', Helvetica Neue;
    background: white;
  }

  * {
    box-sizing: border-box;
    font-family: 'Lato', Helvetica Neue;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .firebase-emulator-warning {
    display: none;
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
`;

const Content = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Layout = ({children}: {children: ReactNode}) => {
  return (
    <ThemeProvider theme={sharedCatalogsTheme}>
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
