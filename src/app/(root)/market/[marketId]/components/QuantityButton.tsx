import {CheckPartialIcon, PlusIcon, getColor} from 'akeneo-design-system';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  border: 1px solid ${getColor('grey', 100)};
  border-radius: 5px;
  height: 40px;

  & > * {
    padding: 5px;
    height: 100%;

    &:not(:last-child) {
      border-right: 1px solid ${getColor('grey', 100)};
    }
  }
`;

const Quantity = styled.div`
  height: 100%;
  width: 60px;
  font-size: 20px;
  font-weight: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 5px;
  font-family: inherit;
  border: none;
  background-color: transparent;
  border-right: 1px solid #d2d2d2;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type='number'] {
    -moz-appearance: textfield;
  }
`;

const QuantityButton = ({quantity, onAdd, onRemove}: {quantity: number; onAdd: () => void; onRemove: () => void}) => {
  return (
    <Container>
      <CheckPartialIcon size={30} onClick={onRemove} title="Remove product" />
      <Quantity>{quantity}</Quantity>
      <PlusIcon size={30} onClick={onAdd} title="Add product" />
    </Container>
  );
};

export {QuantityButton};
