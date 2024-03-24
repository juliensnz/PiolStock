'use client';

import {useMarketUpdater, useMarkets} from '@/app/(root)/market/components/hooks/useMarkets';
import {Market, Sale} from '@/domain/model/Market';
import {useCallback, useMemo} from 'react';
import styled from 'styled-components';
import {getColor, Breadcrumb, Table} from 'akeneo-design-system';
import {fromTimestamp} from '@/domain/model/common/date';
import {PageHeaderSticky, PageTop} from '@/app/(root)/components/common/PageHeaderSticky';
import {AddSaleButton} from '@/app/(root)/market/[marketId]/components/AddSaleButton';

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

const MarketView = ({params: {marketId}}: {params: {marketId: string}}) => {
  const {data} = useMarkets();
  const markets = useMemo(() => data?.docs.map(doc => doc.data() as Market), [data]);
  const market = markets?.find(market => market.id === marketId);
  const {addSale} = useMarketUpdater();

  const handleAddSale = useCallback(
    async (sale: Sale) => {
      if (undefined === market) return;

      await addSale(market.id, sale);
    },
    [market, addSale]
  );

  if (undefined === market) {
    return null;
  }

  return (
    <Container>
      <PageHeaderSticky>
        <PageTop>
          <Breadcrumb>
            <Breadcrumb.Step href="/market">Market</Breadcrumb.Step>
            <Breadcrumb.Step>{market.name}</Breadcrumb.Step>
          </Breadcrumb>
          <Spacer />
          <AddSaleButton onAddSale={handleAddSale} />
        </PageTop>
        <PageTitle>
          {market.name} - {fromTimestamp(market.date)}
        </PageTitle>
      </PageHeaderSticky>
      <Table>
        <Table.Header sticky={70}>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell>Products</Table.HeaderCell>
          <Table.HeaderCell>Revenue</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {market.sales.map(sale => {
            return (
              <Table.Row key={sale.id}>
                <Table.Cell rowTitle={true}>
                  {sale.items.map(item => `${item.product.name} (${item.product.format})`).join(', ')}
                </Table.Cell>
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

export default MarketView;
