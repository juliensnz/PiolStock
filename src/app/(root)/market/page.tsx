'use client';

import {getColor, Breadcrumb} from 'akeneo-design-system';
import styled from 'styled-components';

const Spacer = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  color: ${getColor('brand', 120)};
`;

const Container = styled.div`
  margin: 10px 10px 10px 0;
  background-color: white;
  flex: 1;
`;

const PageHeaderSticky = styled.div`
  display: flex;
  justify-content: space-between;
  position: sticky;
  flex-direction: column;
  top: 0;
  background: white;
  margin-bottom: 30px;
  padding-top: 20px;
`;

const PageTop = styled.div`
  display: flex;
  width: 100%;
`;

const Market = () => {
  return (
    <Container>
      <PageHeaderSticky>
        <PageTop>
          <Breadcrumb>
            <Breadcrumb.Step>Market</Breadcrumb.Step>
          </Breadcrumb>
          <Spacer />
          <AddSaleButton />
        </PageTop>
        <PageTitle>Market</PageTitle>
      </PageHeaderSticky>
    </Container>
  );
};

export default Market;
