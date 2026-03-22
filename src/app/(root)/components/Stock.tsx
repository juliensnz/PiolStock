import {useCallback} from 'react';
import {cn} from '@/lib/utils';

type StockProps = {
  value: number;
  increment: number;
  onChange: (value: number) => void;
};

const buttonBase = 'flex h-full w-[40px] shrink-0 items-center justify-center bg-transparent text-base cursor-pointer transition-colors';

const Stock = ({value, onChange, increment = 4}: StockProps) => {
  const handleChange = useCallback(
    (updatedValue: number) => {
      onChange(updatedValue < 0 ? 0 : updatedValue);
    },
    [onChange]
  );

  return (
    <div className="inline-flex h-[48px] w-fit items-center justify-center divide-x divide-border rounded-lg border border-border bg-white shadow-sm">
      <button tabIndex={-1} className={cn(buttonBase, 'rounded-l-lg text-red-800 hover:bg-red-50')} onClick={() => handleChange(value - increment)}>
        -{increment}
      </button>
      <button tabIndex={-1} className={cn(buttonBase, 'text-red-500 hover:bg-red-50')} onClick={() => handleChange(value - 1)}>
        -1
      </button>
      <input
        type="number"
        value={value}
        onChange={event => handleChange(Number(event.target.value))}
        className="h-full w-[56px] shrink-0 bg-transparent text-center font-[inherit] text-lg font-bold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button tabIndex={-1} className={cn(buttonBase, 'text-green-500 hover:bg-green-50')} onClick={() => handleChange(value + 1)}>
        +1
      </button>
      <button tabIndex={-1} className={cn(buttonBase, 'rounded-r-lg text-green-700 hover:bg-green-50')} onClick={() => handleChange(value + increment)}>
        +{increment}
      </button>
    </div>
  );
};

export {Stock};
