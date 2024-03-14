import {useImages} from '@/app/(root)/components/hooks/useImages';
import {useAddProducts} from '@/app/(root)/components/hooks/useProducts';
import {createProduct, createProducts} from '@/domain/model/Product';
import {
  BooleanInput,
  Button,
  ChannelsIllustration,
  Field,
  Modal,
  SelectInput,
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
  const [imageName, setImageName] = useState('');
  const [name, setName] = useState('');
  const [multipleSizes, setMultipleSizes] = useState(true);
  const images = useImages();

  const addProducts = useAddProducts();

  const handleCreateProduct = useCallback(async () => {
    if (!name || !imageName) {
      return;
    }

    const products = multipleSizes ? createProducts(name, imageName) : [createProduct(name, imageName, 'UNISIZE')];

    await addProducts(products);
    handleClose();
  }, [addProducts, imageName, multipleSizes, name, handleClose]);

  return (
    <Modal
      closeTitle="Close modal"
      onClose={handleClose}
      illustration={
        imageName ? (
          <Image
            src={`https://firebasestorage.googleapis.com/v0/b/piolstock.appspot.com/o/images/${imageName}?alt=media`}
            width={220}
            height={220}
            alt="Illustration image"
          />
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
          <SelectInput
            emptyResultLabel="No image found"
            onChange={setImageName}
            placeholder="Please chose an image"
            value={imageName}
            clearable={false}
            openLabel=""
          >
            {images.map(image => (
              <SelectInput.Option key={image} title={image} value={image}>
                {image.split('.')[0].replace('_', ' ')}
              </SelectInput.Option>
            ))}
          </SelectInput>
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
