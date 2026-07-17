import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import React, { type FC } from 'react';

import PersonalCard from './PersonalCard';

interface Props {
    title: string;
    /** Small uppercase badge next to the header (e.g. "THIS MONTH"). */
    badge?: string;
    items: BaseItemDto[] | undefined;
    showProgress?: boolean;
    /** Show 1-based rank chips on cards. */
    ranked?: boolean;
}

/** A horizontal scroll rail of poster cards with a header. */
const PersonalRow: FC<Props> = ({ title, badge, items, showProgress, ranked }) => {
    if (!items?.length) return null;

    return (
        <section className='personalRow'>
            <h2 className='personalRow-header'>
                {title}
                {badge && <span className='personalRow-badge'>{badge}</span>}
            </h2>
            <div className='personalRow-rail'>
                {items.map((item, i) => (
                    <PersonalCard
                        key={item.Id ?? i}
                        item={item}
                        showProgress={showProgress}
                        rank={ranked ? i + 1 : undefined}
                    />
                ))}
            </div>
        </section>
    );
};

export default PersonalRow;
