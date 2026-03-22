import type {Format} from '@/domain/model/Product';

const FORMAT_SIZES: Record<Format, {width: number; height: number}> = {
  A2: {width: 62, height: 88},
  A3: {width: 52, height: 73},
  A4: {width: 42, height: 60},
  A5: {width: 34, height: 47},
  A6: {width: 26, height: 36},
  UNISIZE: {width: 42, height: 42},
};

type FormatIconProps = {
  format: Format;
};

const FormatIcon = ({format}: FormatIconProps) => {
  const {width, height} = FORMAT_SIZES[format];

  return (
    <div className="flex items-center justify-center" style={{width: 62, height: 88}}>
      <div
        className="flex items-center justify-center rounded-sm border border-border bg-muted/50"
        style={{width, height}}
      >
        <span className="text-[13px] font-medium text-muted-foreground">{format}</span>
      </div>
    </div>
  );
};

export {FormatIcon};
