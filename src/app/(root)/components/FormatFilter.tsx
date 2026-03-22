import {FormatIcon} from '@/app/(root)/components/FormatIcon';
import {Button} from '@/components/ui/button';
import {Checkbox} from '@/components/ui/checkbox';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {type Format, FORMAT, FORMAT_SIZE_ORDER} from '@/domain/model/Product';
import {SlidersHorizontal} from 'lucide-react';

const FORMATS_SORTED = (Object.values(FORMAT) as Format[]).sort(
  (a, b) => FORMAT_SIZE_ORDER[a] - FORMAT_SIZE_ORDER[b]
);

type FormatFilterProps = {
  selectedFormats: Set<Format>;
  onToggle: (format: Format) => void;
};

const FormatFilter = ({selectedFormats, onToggle}: FormatFilterProps) => {
  const count = selectedFormats.size;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="default" className="shrink-0 gap-1.5">
          <SlidersHorizontal className="size-4" />
          <span>Format</span>
          {count > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-48 p-2">
        <div className="flex flex-col gap-0.5">
          {FORMATS_SORTED.map(format => (
            <label
              key={format}
              className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent"
            >
              <Checkbox
                checked={selectedFormats.has(format)}
                onCheckedChange={() => onToggle(format)}
              />
              <FormatIcon format={format} showLabel={true} />
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export {FormatFilter};
