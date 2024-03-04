'use client';

import {AddProductButton} from '@/app/(root)/components/AddProductButton';
import {Stock} from '@/app/(root)/components/Stock';
import {useProducts, useUpdateStock} from '@/app/(root)/components/hooks/useProducts';
import {Product} from '@/domain/model/Product';
import {Table, Breadcrumb, getColor} from 'akeneo-design-system';
import Image from 'next/image';
import {useCallback} from 'react';
import styled from 'styled-components';

const Spacer = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  color: ${getColor('brand', 120)};
`;

const Container = styled.div`
  margin: 10px 10px 10px 10px;
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

const StockCell = styled(Table.Cell)``;

const ImageCell = styled(Table.Cell)`
  width: 150px;
`;

export default function Home() {
  const {data} = useProducts();
  const updateStock = useUpdateStock();

  const updateProductStock = useCallback(
    (productId: string) => (stock: number) => updateStock(productId, stock),
    [updateStock]
  );

  return (
    <Container>
      <PageHeaderSticky>
        <PageTop>
          <Breadcrumb>
            <Breadcrumb.Step>Stock</Breadcrumb.Step>
          </Breadcrumb>
          <Spacer />

          <AddProductButton />
        </PageTop>
        <PageTitle>Product stock</PageTitle>
      </PageHeaderSticky>
      <Table>
        <Table.Header sticky={70}>
          <Table.HeaderCell>Illustration</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Format</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {data?.docs.map(doc => {
            const product = doc.data() as Product;

            return (
              <Table.Row key={product.id}>
                <ImageCell>
                  <Image src={product.image} alt="Illustration image" width={100} height={100} />
                </ImageCell>
                <Table.Cell rowTitle={true}>{product.name}</Table.Cell>
                <Table.Cell>{product.format}</Table.Cell>
                <StockCell>
                  <Stock value={product.stock} onChange={updateProductStock(product.id)} increment={4} />
                </StockCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Container>
  );
}
