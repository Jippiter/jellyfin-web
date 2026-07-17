import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { useEffect } from 'react';

import Page from '../../../components/Page';
import PersonalHome from '../features/home/PersonalHome';

/**
 * Home route — rebuilt for the Personal redesign.
 *
 * The stock home screen is a React shell that hands its content off to legacy
 * controllers rendering string-HTML rows. This replaces that with a fully
 * React home experience (hero carousel + custom rails). The old Home/Favorites
 * tabs are dropped in favour of the redesign's nav-driven navigation.
 */
const Home = () => {
    useEffect(() => {
        const header = document.querySelector('.skinHeader');
        header?.classList.add('noHomeButtonHeader');
        return () => {
            header?.classList.remove('noHomeButtonHeader');
        };
    }, []);

    return (
        <Page
            id='indexPage'
            className='mainAnimatedPage homePage libraryPage allLibraryPage'
            isBackButtonEnabled={false}
            backDropType={[
                BaseItemKind.Movie,
                BaseItemKind.Series,
                BaseItemKind.Book
            ]}
        >
            <PersonalHome />
        </Page>
    );
};

export default Home;
