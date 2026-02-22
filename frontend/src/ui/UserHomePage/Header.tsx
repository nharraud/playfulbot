import { ReactNode } from 'react';
import cssCls from './Header.module.css';
import { FormattedMessage } from 'react-intl';
import { useLogout } from 'src/hooksAndQueries/backend/graphql/authenticatedUser';

interface HeaderProps {
  title: ReactNode,
  subtitle: ReactNode,
  icon: ReactNode,
}
export function Header({ title, subtitle/*, icon*/ }: HeaderProps) {
  const { logout } = useLogout();
  return (
    <div className={cssCls.header}>
      {/* {icon} */}
      <div className={cssCls.headerContent}>
        <div className={cssCls.headerText}>
          <p className={cssCls.title}>{title}</p>
          <p className={cssCls.subTitle}>{subtitle}</p>
        </div>
        <div className={cssCls.headerMenu}>
          <div className={cssCls.menuItem}>
            <a tabindex="0" role="button" className={cssCls.userMenuButton}></a>
            <div className={cssCls.subMenuWrapper}>
              <nav className={cssCls.subMenu}>
                <a onClick={logout}>
                  <FormattedMessage defaultMessage="Logout test"/>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}