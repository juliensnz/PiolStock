import type {Format} from '@/domain/model/Product';

const FORMAT_SIZES: Record<Format, {width: number; height: number}> = {
  A2: {width: 44, height: 62},
  A3: {width: 36, height: 51},
  A4: {width: 30, height: 42},
  A5: {width: 24, height: 33},
  A6: {width: 18, height: 25},
  UNISIZE: {width: 30, height: 30},
};

type FormatIconProps = {
  format: Format;
  imageUrl?: string | null;
  showLabel?: boolean;
};

const FormatIcon = ({format, imageUrl, showLabel = true}: FormatIconProps) => {
  const {width, height} = FORMAT_SIZES[format];

  return (
    <div className={showLabel ? 'flex w-[100px] shrink-0 items-center gap-2' : 'inline-flex shrink-0'}>
      <div
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-border bg-muted/50"
        style={{width, height}}
      >
        {imageUrl && (
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        )}
      </div>
      {showLabel && <span className="text-sm font-medium text-muted-foreground">{format}</span>}
    </div>
  );
};

export {FormatIcon};
