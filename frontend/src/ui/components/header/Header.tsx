import { ReactNode } from 'react';
import cssCls from './Header.module.css';
import { FormattedMessage } from 'react-intl';
import { useLogout } from 'src/hooksAndQueries/backend/graphql/authenticatedUser';
import { NavLink } from 'react-router';

interface HeaderProps {
  title: ReactNode,
  subtitle?: ReactNode,
  backLink?: { url: string, text: ReactNode },
  // icon: ReactNode,
}
export function Header({ title, subtitle, backLink/*, icon*/ }: HeaderProps) {
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
  return (
    <div className={cssCls.header}>
      {/* {icon} */}
      <div className={cssCls.headerContent}>
        <div className={cssCls.headerLeftContent}>
          { backButton }
          <div className={cssCls.headerText}>
            <h1 className={cssCls.title}>{title}</h1>
            { subtitle ?? <p className={cssCls.subTitle}>{subtitle}</p> }
          </div>
        </div>
        <div className={cssCls.headerMenu}>
          <div className={cssCls.menuItem}>
            <a tabindex="0" role="button" className={cssCls.userMenuButton}></a>
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