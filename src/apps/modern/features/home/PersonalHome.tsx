import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import React, { type FC, useMemo } from 'react';

import { useResumeItems } from 'apps/legacy/features/libraries/api/useResumeItems';

import PersonalHero from './PersonalHero';
import PersonalRow from './PersonalRow';
import { useLatestItems } from './useHomeData';

import './PersonalHome.scss';

const PersonalHome: FC = () => {
    const resume = useResumeItems({ limit: 12 });
    const latest = useLatestItems([ BaseItemKind.Movie, BaseItemKind.Series ], 24);
    const movies = useLatestItems([ BaseItemKind.Movie ], 24);
    const shows = useLatestItems([ BaseItemKind.Series ], 24);

    const resumeItems = resume.data?.Items;
    const latestItems = latest.data;

    // Hero rotates through the newest titles that actually have backdrop art,
    // falling back to the newest titles if none have backdrops yet.
    const heroItems = useMemo(() => {
        const all = latestItems ?? [];
        const withArt = all.filter(i => i.BackdropImageTags?.length);
        return (withArt.length ? withArt : all).slice(0, 6);
    }, [ latestItems ]);

    return (
        <div className='personalHome'>
            {heroItems.length > 0 && <PersonalHero items={heroItems} />}

            <div className='personalHome-rows'>
                <PersonalRow title='Continue Watching' items={resumeItems} showProgress />
                <PersonalRow title='Recently Added' items={latestItems} />
                <PersonalRow title='Movies' items={movies.data} />
                <PersonalRow title='Shows' items={shows.data} />
            </div>
        </div>
    );
};

export default PersonalHome;
