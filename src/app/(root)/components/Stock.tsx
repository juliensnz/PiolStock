import styled from 'styled-components';
import {getColor} from 'akeneo-design-system';
import {useCallback} from 'react';

const Container = styled.div`
  border: 1px solid #d2d2d2;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75px;
`;

const NumberInput = styled.input`
  height: 100%;
  width: 60px;
  font-size: 25px;
  text-align: center;
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

const ChangeButton = styled.button<{color: string; gradient: number}>`
  height: 100%;
  width: 50px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  color: ${props => getColor(props.color, props.gradient)};

  &:not(:last-child) {
    border-right: 1px solid #d2d2d2;
  }
`;

type StockProps = {
  value: number;
  increment: number;
  onChange: (value: number) => void;
};

const Stock = ({value, onChange, increment = 4}: StockProps) => {
  const handleChange = useCallback(
    (updatedValue: number) => {
      onChange(updatedValue < 0 ? 0 : updatedValue);
    },
    [onChange]
  );

  return (
    <Container>
      <ChangeButton tabIndex={-1} color="red" gradient={140} onClick={() => handleChange(value - increment)}>
        -{increment}
      </ChangeButton>
      <ChangeButton tabIndex={-1} color="red" gradient={100} onClick={() => handleChange(value - 1)}>
        -1
      </ChangeButton>
      <NumberInput type="number" value={value} onChange={event => handleChange(Number(event.target.value))} />
      <ChangeButton tabIndex={-1} color="green" gradient={100} onClick={() => handleChange(value + 1)}>
        +1
      </ChangeButton>
      <ChangeButton tabIndex={-1} color="green" gradient={140} onClick={() => handleChange(value + increment)}>
        +{increment}
      </ChangeButton>
    </Container>
  );
};

export {Stock};
