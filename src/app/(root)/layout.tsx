'use client';

import {CommonStyle, sharedCatalogsTheme} from 'akeneo-design-system';

import styled, {ThemeProvider, createGlobalStyle} from 'styled-components';
import {ReactNode} from 'react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {MENU_WIDTH, Menu} from '@/app/(root)/components/Menu';
import {IS_MOBILE} from '@/app/(root)/components/theme';

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
  display: flex;
  flex-direction: row;
  height: 100vh;

  ${IS_MOBILE} {
    flex-direction: column-reverse;
  }
`;

const Content = styled.div`
  background-color: white;
  flex: 1;
  margin: 0 20px 0 ${MENU_WIDTH + 20}px;

  ${IS_MOBILE} {
    margin: 0 20px;
    overflow: hidden;
  }
`;

const Layout = ({children}: {children: ReactNode}) => {
  return (
    <ThemeProvider theme={sharedCatalogsTheme}>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Container>
          <Menu />
          <Content>{children}</Content>
        </Container>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Layout;
