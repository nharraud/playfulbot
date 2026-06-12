import { ReactNode } from 'react';
import cssCls from './TallHeader.module.css';
import { Header } from './Header';

interface HeaderProps {
  title: ReactNode,
  subtitle?: ReactNode,
  backLink?: { url: string, text: ReactNode }
}
export function TallHeader({ title, subtitle, backLink }: HeaderProps) {
  const lowerContent = (
    <div className={cssCls.headerText}>
      <h1 className={cssCls.title}>{title}</h1>
      { subtitle ?? <p className={cssCls.subTitle}>{subtitle}</p> }
    </div>
  );
  return (
    <Header lowerContent={lowerContent} backLink={backLink}/>
  );
}