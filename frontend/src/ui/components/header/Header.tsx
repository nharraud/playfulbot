import { ReactNode } from 'react';
import cssCls from './Header.module.css';
import { FormattedMessage } from 'react-intl';
import { useLogout } from 'src/hooksAndQueries/backend/graphql/authenticatedUser';
import { NavLink } from 'react-router';

interface HeaderProps {
  lowerContent?: ReactNode,
  upperContent?: ReactNode,
  backLink?: { url: string, text: ReactNode },
  fullWidth?: boolean,
}
export function Header({ lowerContent, backLink, upperContent, fullWidth = false }: HeaderProps) {
  const { logout } = useLogout();
  let backButton: ReactNode;
  if (backLink) {
    backButton = (
        <NavLink className={cssCls.backLink} to={backLink.url}>
          <span className={cssCls.backLinkIcon}/>
          <p className={cssCls.backLinkText}>{ backLink.text }</p>
        </NavLink>
    );
  }
  const widthClass = fullWidth ? cssCls.fullWidth : '';
  return (
    <div className={cssCls.header}>
      {/* {icon} */}
      <div className={`${cssCls.headerContent} ${widthClass}`}>
        <div className={cssCls.headerLeftContentColumn}>
          <div className={cssCls.headerLeftContentRow}>
            { backButton }
            { upperContent }
          </div>
          { lowerContent }
        </div>
        <div className={cssCls.headerMenu}>
          <div className={cssCls.menuItem}>
            <a tabIndex={0} role="button" className={cssCls.userMenuButton}></a>
            <div className={cssCls.subMenuWrapper}>
              <nav className={cssCls.subMenu}>
                <a onClick={logout}>
                  <div className={cssCls.logoutText}><FormattedMessage defaultMessage="Logout test"/></div>
                  <div className={cssCls.logoutIcon}/>
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}