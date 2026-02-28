import { ReactNode } from 'react';
import cssCls from './Card.module.css';

export function Card({ children, className }: { children: ReactNode, className?: string }) {
  return <div className={ `${cssCls.card} ${className}` }>
    {children}
  </div>
}