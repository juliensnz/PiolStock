'use client';

import {InternalLink} from '@/app/(root)/components/common/InternalLink';
import {PageHeaderSticky, PageTop} from '@/app/(root)/components/common/PageHeaderSticky';
import {AddMarketButton} from '@/app/(root)/market/components/AddMarketButton';
import {useMarkets} from '@/app/(root)/market/components/hooks/useMarkets';
import {Market} from '@/domain/model/Market';
import {fromTimestamp} from '@/domain/model/common/date';
import {getColor, Breadcrumb, Table} from 'akeneo-design-system';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useMemo} from 'react';
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

const MarketsView = () => {
  const {data} = useMarkets();
  const markets = useMemo(() => data?.docs.map(doc => doc.data() as Market), [data]);
  const {push} = useRouter();
  if (undefined === markets) {
    return null;
  }

  return (
    <Container>
      <PageHeaderSticky>
        <PageTop>
          <Breadcrumb>
            <Breadcrumb.Step>Market</Breadcrumb.Step>
          </Breadcrumb>
          <Spacer />
          <AddMarketButton />
        </PageTop>
        <PageTitle>Market</PageTitle>
      </PageHeaderSticky>
      <Table>
        <Table.Header sticky={70}>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell>Revenue</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {markets.map(market => {
            return (
              <Table.Row onClick={() => push(`/market/${market.id}`)} key={market.id}>
                <Table.Cell rowTitle={true}>{market.name}</Table.Cell>
                <Table.Cell>{fromTimestamp(market.date)}</Table.Cell>
                <Table.Cell>12€</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
};

export default MarketsView;
