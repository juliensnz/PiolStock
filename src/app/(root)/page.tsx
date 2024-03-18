'use client';

import {AddProductButton} from '@/app/(root)/components/AddProductButton';
import {Stock} from '@/app/(root)/components/Stock';
import {useProducts, useUpdateStock} from '@/app/(root)/components/hooks/useProducts';
import {Product} from '@/domain/model/Product';
import {Table, Breadcrumb, getColor, Search} from 'akeneo-design-system';
import Image from 'next/image';
import {useCallback, useMemo, useState} from 'react';
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
  const [search, setSearch] = useState('');

  const updateProductStock = useCallback(
    (productId: string) => (stock: number) => updateStock(productId, stock),
    [updateStock]
  );

  const products = useMemo(() => data?.docs.map(doc => doc.data() as Product), [data]);
  const filteredProducts = useMemo(
    () => products?.filter(product => product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [],
    [products, search]
  );

  const handleAddProduct = useCallback(
    (productName: string) => {
      setSearch(productName);
    },
    [setSearch]
  );

  if (undefined === products) {
    return null;
  }

  return (
    <Container>
      <PageHeaderSticky>
        <PageTop>
          <Breadcrumb>
            <Breadcrumb.Step>Stock</Breadcrumb.Step>
          </Breadcrumb>
          <Spacer />

          <AddProductButton onAddProduct={handleAddProduct} />
        </PageTop>
        <PageTitle>Product stock</PageTitle>
      </PageHeaderSticky>
      <Search onSearchChange={setSearch} placeholder="Search" searchValue={search} title="Search">
        <span>{filteredProducts.length} results</span>
      </Search>
      <Table>
        <Table.Header sticky={70}>
          <Table.HeaderCell>Illustration</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Format</Table.HeaderCell>
          <Table.HeaderCell>Stock</Table.HeaderCell>
        </Table.Header>
        <Table.Body>
          {filteredProducts.map(product => {
            return (
              <Table.Row key={product.id}>
                <ImageCell>
                  <Image
                    src={`https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F${product.image}?alt=media`}
                    alt="Illustration image"
                    width={100}
                    height={100}
                  />
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
