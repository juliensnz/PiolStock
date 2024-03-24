import {useProducts} from '@/app/(root)/components/hooks/useProducts';
import {QuantityButton} from '@/app/(root)/market/[marketId]/components/QuantityButton';
import {Sale, addItem, createSale, removeItem} from '@/domain/model/Market';
import {Product} from '@/domain/model/Product';
import {Button, Modal, Search, Table, useBooleanState} from 'akeneo-design-system';
import Image from 'next/image';
import {useCallback, useMemo, useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  overflow: scroll;
  margin-top: 26px;
`;

const BottomButtons = styled(Modal.BottomButtons)`
  display: flex;
  justify-content: flex-end;
`;

const AddSaleButton = ({onAddSale}: {onAddSale: (sale: Sale) => void}) => {
  const [isOpen, open, close] = useBooleanState(false);

  return (
    <>
      <Button onClick={open}>Add a sale</Button>
      {isOpen && <AddSaleModal onAddSale={onAddSale} handleClose={close} />}
    </>
  );
};

const ImageCell = styled(Table.Cell)`
  width: 50px;
`;

const AddSaleModal = ({handleClose, onAddSale}: {handleClose: () => void; onAddSale: (sale: Sale) => void}) => {
  const [sale, setSale] = useState<Sale>(createSale());
  const {data} = useProducts();
  const [search, setSearch] = useState('');

  const products = useMemo(() => data?.docs.map(doc => doc.data() as Product), [data]);
  const filteredProducts = useMemo(
    () => products?.filter(product => product.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [],
    [products, search]
  );
  const handleCreateSale = useCallback(async () => {
    if (sale.items.length === 0) {
      return;
    }

    onAddSale(sale);
    handleClose();
  }, [onAddSale, sale, handleClose]);

  if (undefined === products) {
    return null;
  }

  return (
    <Modal closeTitle="Close modal" onClose={handleClose}>
      <Container>
        <Search sticky={0} onSearchChange={setSearch} placeholder="Search" searchValue={search} title="Search">
          <span>{filteredProducts.length} results</span>
        </Search>
        <Table>
          <Table.Header sticky={20}>
            <Table.HeaderCell>Illustration</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Format</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {filteredProducts.map(product => {
              return (
                <Table.Row key={product.id}>
                  <ImageCell>
                    <Image
                      src={`https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images%2F${product.image}?alt=media`}
                      alt="Illustration image"
                      width={50}
                      height={50}
                    />
                  </ImageCell>
                  <Table.Cell rowTitle={true}>{product.name}</Table.Cell>
                  <Table.Cell>{product.format}</Table.Cell>
                  <Table.Cell>
                    <QuantityButton
                      quantity={sale.items.reduce(
                        (total, item) => (item.product.id === product.id ? total + 1 : total),
                        0
                      )}
                      onAdd={() => setSale(addItem(sale, product))}
                      onRemove={() => setSale(removeItem(sale, product))}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </Container>
      <BottomButtons>
        <Button level="tertiary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleCreateSale}>Confirm</Button>
      </BottomButtons>
    </Modal>
  );
};

export {AddSaleButton};
