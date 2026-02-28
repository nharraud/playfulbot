import { ReactNode } from 'react';
import cssCls from './Card.module.css';

export function Card({ shadow=false, children, className }: { shadow?: boolean, children: ReactNode, className?: string }) {
  let shadowCls;
  if (shadow) {
    shadowCls = cssCls.shadow;
  }

  return <div className={ `${cssCls.card} ${shadowCls} ${className}` }>
    {children}
  </div>
}