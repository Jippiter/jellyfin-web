import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import React, { type FC, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { appRouter, PUBLIC_PATHS } from 'components/router/appRouter';
import UserMenuButton from 'components/toolbar/UserMenuButton';
import { useUserViews } from 'hooks/api/useUserViews';
import { useApi } from 'hooks/useApi';

import './PersonalNav.scss';

const NavItem: FC<{ to: string; active: boolean; children: ReactNode }> = ({ to, active, children }) => (
    <Link to={to} className={active ? 'personalNav-link is-active' : 'personalNav-link'}>
        {children}
    </Link>
);

/**
 * The redesign's global top navigation: logo, Home + the user's libraries,
 * search, and the user menu. Transparent over content, matching the handoff.
 * Hidden on the video player and public (login) routes.
 */
const PersonalNav: FC = () => {
    const location = useLocation();
    const { user } = useApi();
    const { data: userViews } = useUserViews({ userId: user?.Id });

    // The video player is a full-screen takeover with no nav.
    if (location.pathname === '/video') return null;

    const isPublic = PUBLIC_PATHS.includes(location.pathname);
    const views = userViews?.Items ?? [];

    return (
        <nav className='personalNav'>
            <Link to='/home' className='personalNav-logo'>
                <span className='personalNav-logoMark'>J</span>
                <span className='personalNav-logoText'>JELLYFIN</span>
            </Link>

            {!isPublic && (
                <div className='personalNav-links'>
                    <NavItem to='/home' active={location.pathname === '/home'}>Home</NavItem>
                    {views.map(view => (
                        <NavItem
                            key={view.Id}
                            to={appRouter.getRouteUrl(view, { context: view.CollectionType }).substring(1)}
                            active={false}
                        >
                            {view.Name}
                        </NavItem>
                    ))}
                </div>
            )}

            {!isPublic && (
                <div className='personalNav-actions'>
                    <IconButton component={Link} to='/search' color='inherit' aria-label='Search'>
                        <SearchIcon />
                    </IconButton>
                    <UserMenuButton />
                </div>
            )}
        </nav>
    );
};

export default PersonalNav;
