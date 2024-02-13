'use client';

import {Stock} from '@/app/(root)/components/Stock';
import {useAddProducts, useProducts, useUpdateStock} from '@/app/(root)/components/hooks/useProducts';
import {Product, createProducts} from '@/domain/model/Product';
import {Table, Breadcrumb, getColor, Button} from 'akeneo-design-system';
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

const StockCell = styled(Table.Cell)`
  width: 270px;
  padding-right: 20px;
`;

export default function Home() {
  const {data} = useProducts();
  const addProducts = useAddProducts();
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
          <Button
            onClick={() => {
              const productName = window.prompt('Product name', 'My product');
              if (null === productName) return;
              const productImage = window.prompt(
                'Product image',
                'https://scontent.cdninstagram.com/v/t51.2885-15/427172601_392548660150973_4785277053165070796_n.jpg?stp=dst-jpg_e35&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE0Mzkuc2RyIn0&_nc_ht=scontent.cdninstagram.com&_nc_cat=105&_nc_ohc=ITX5LORhlfkAX_awrz4&edm=APs17CUBAAAA&ccb=7-5&ig_cache_key=MzMwMTk5MzY0MjI1NTAxNTQ2NQ%3D%3D.2-ccb7-5&oh=00_AfA-Ph98Fl_xGvJ0C6apwhJWCdPdhb7W3YeWnvIvjAXiuQ&oe=65D0B718&_nc_sid=10d13b'
              );
              if (null === productImage) return;

              addProducts(createProducts(productName, productImage));
            }}
          >
            Add product
          </Button>
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
                <Table.Cell>
                  <Image src={product.image} alt="Illustration image" width={100} height={100} />
                </Table.Cell>
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
