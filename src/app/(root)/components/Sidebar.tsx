'use client';

import {cn} from '@/lib/utils';
import {ClipboardList, Package} from 'lucide-react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

const NAV_ITEMS = [
  {href: '/', label: 'Stock', icon: Package},
  {href: '/orders', label: 'Orders', icon: ClipboardList},
] as const;

const Sidebar = () => {
  const pathname = usePathname() ?? '/';

  return (
    <nav className="flex w-16 shrink-0 flex-col gap-2 border-r border-border bg-muted/30 px-1.5 pt-4">
      {NAV_ITEMS.map(({href, label, icon: Icon}) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-lg py-2 text-xs transition-colors',
              isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export {Sidebar};
