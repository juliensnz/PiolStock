import {useMarketUpdater} from '@/app/(root)/market/components/hooks/useMarkets';
import {Market, createMarket} from '@/domain/model/Market';
import {createDate, fromString} from '@/domain/model/common/date';
import {Button, ChannelsIllustration, DateInput, Field, Modal, TextInput, useBooleanState} from 'akeneo-design-system';
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

const AddMarketButton = ({onAddMarket}: {onAddMarket?: (market: Market) => void}) => {
  const [isOpen, open, close] = useBooleanState(false);

  return (
    <>
      <Button onClick={open}>Create a market</Button>
      {isOpen && <AddMarketModal onAddMarket={onAddMarket} handleClose={close} />}
    </>
  );
};

const AddMarketModal = ({
  handleClose,
  onAddMarket,
}: {
  handleClose: () => void;
  onAddMarket?: (market: Market) => void;
}) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState<string>(createDate());
  const {createMarket: persistCreatedMarket} = useMarketUpdater();

  const handleCreateMarket = useCallback(async () => {
    if (!date || !name) {
      return;
    }
    const market = createMarket(name, fromString(date));

    await persistCreatedMarket(market);
    onAddMarket?.(market);
    handleClose();
  }, [onAddMarket, date, name, createMarket, handleClose]);

  return (
    <Modal closeTitle="Close modal" onClose={handleClose} illustration={<ChannelsIllustration />}>
      <Container>
        <Field label="Name">
          <TextInput value={name} onChange={setName} placeholder="Super marché" />
        </Field>
        <Field label="Date">
          <DateInput value={date} onChange={setDate} />
        </Field>
      </Container>
      <BottomButtons>
        <Button level="tertiary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleCreateMarket}>Confirm</Button>
      </BottomButtons>
    </Modal>
  );
};

export {AddMarketButton};
