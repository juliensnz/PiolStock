'use client';

import {AddProductButton} from '@/app/(root)/components/AddProductButton';
import {Stock} from '@/app/(root)/components/Stock';
import {PageHeaderSticky, PageTop} from '@/app/(root)/components/common/PageHeaderSticky';
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
  margin: 10px 10px 10px 0;
  background-color: white;
  flex: 1;
`;

const NameCell = styled(Table.Cell)``;

const StockCell = styled(Table.Cell)`
  width: 0.1%;
  white-space: nowrap;
  max-width: 1000px;
`;

const ImageCell = styled(Table.Cell)`
  width: 150px;
`;

export default function Home() {
  const updateStock = useUpdateStock();
  const [search, setSearch] = useState('');

  const updateProductStock = useCallback(
    (productId: string) => (stock: number) => updateStock(productId, stock),
    [updateStock]
  );

  const {data} = useProducts();
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
                <NameCell rowTitle={true}>{product.name}</NameCell>
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
