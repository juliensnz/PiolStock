import {useInstagramUrl} from '@/app/(root)/components/hooks/useInstagramUrl';
import {useAddProducts} from '@/app/(root)/components/hooks/useProducts';
import {createProduct, createProducts} from '@/domain/model/Product';
import {
  BooleanInput,
  Button,
  ChannelsIllustration,
  Field,
  Modal,
  TextInput,
  useBooleanState,
} from 'akeneo-design-system';
import Image from 'next/image';
import {useCallback, useState} from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BottomButtons = styled(Modal.BottomButtons)`
  display: flex;
  justify-content: flex-end;
`;

const AddProductButton = () => {
  const [isOpen, open, close] = useBooleanState(false);

  return (
    <>
      <Button onClick={open}>Add Product</Button>
      {isOpen && <AddProductModal handleClose={close} />}
    </>
  );
};

const AddProductModal = ({handleClose}: {handleClose: () => void}) => {
  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [multipleSizes, setMultipleSizes] = useState(true);
  const instagramUrl = useInstagramUrl(url);

  const addProducts = useAddProducts();

  const handleCreateProduct = useCallback(async () => {
    if (!name || !instagramUrl) {
      return;
    }

    const products = multipleSizes
      ? createProducts(name, instagramUrl)
      : [createProduct(name, instagramUrl, 'UNISIZE')];

    await addProducts(products);
    handleClose();
  }, [addProducts, instagramUrl, multipleSizes, name, handleClose]);

  return (
    <Modal
      closeTitle="Close modal"
      onClose={handleClose}
      illustration={
        instagramUrl ? (
          <Image src={instagramUrl} width={220} height={220} alt="Illustration image" />
        ) : (
          <ChannelsIllustration />
        )
      }
    >
      <Container>
        <Field label="Name">
          <TextInput value={name} onChange={setName} placeholder="Plage" />
        </Field>
        <Field label="Instagram post">
          <TextInput value={url} onChange={setUrl} placeholder="https://www.instagram.com/p/C3TCboMN6WF/" />
        </Field>
        <Field label="Multiple sizes">
          <BooleanInput
            clearLabel="Clear value"
            noLabel="No"
            onChange={setMultipleSizes}
            value={multipleSizes}
            yesLabel="Yes"
          />
        </Field>
      </Container>
      <BottomButtons>
        <Button level="tertiary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleCreateProduct}>Confirm</Button>
      </BottomButtons>
    </Modal>
  );
};

export {AddProductButton};
