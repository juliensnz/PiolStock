import Link from 'next/link';
import {AnchorHTMLAttributes, Children, isValidElement, ReactNode} from 'react';

type InternalLinkProps = {
  children?: ReactNode;
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

const InternalLink = ({children, ...props}: InternalLinkProps) => {
  if (Children.count(children) > 1) {
    throw new Error('InternalLink can only have one child');
  }

  if (typeof children === 'string') {
    return <Link {...props}>{children}</Link>;
  }
  const child = Children.only(children);

  if (isValidElement<HTMLAnchorElement>(child) && child.type === 'a') {
    return (
      <Link legacyBehavior passHref {...props}>
        {child}
      </Link>
    );
  }

  return <Link {...props}>{child}</Link>;
};

export {InternalLink};
