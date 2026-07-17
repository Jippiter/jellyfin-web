import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import React, { type FC, type KeyboardEvent, useCallback, useState } from 'react';

import { getCardImageUrl } from 'components/cardbuilder/utils/url';
import { appRouter } from 'components/router/appRouter';
import { useApi } from 'hooks/useApi';
import type { ItemDto } from 'types/base/models/item-dto';

import { cardGradient, cardGlow, hueFromString } from './hue';
import PersonalFavoriteButton from './PersonalFavoriteButton';

interface Props {
    item: BaseItemDto;
    /** 1-based rank chip (Trending rows). */
    rank?: number;
    /** Show the continue-watching progress bar. */
    showProgress?: boolean;
}

const CARD_WIDTH = 172;

const PersonalCard: FC<Props> = ({ item, rank, showProgress }) => {
    const { api } = useApi();
    const [ imgFailed, setImgFailed ] = useState(false);
    const hue = hueFromString(item.Name ?? item.Id ?? '');
    const { imgUrl } = getCardImageUrl({ api, item: item as ItemDto, options: { width: CARD_WIDTH } });
    const showImg = Boolean(imgUrl) && !imgFailed;

    const onOpen = useCallback(() => {
        appRouter.showItem(item);
    }, [ item ]);

    const onImgError = useCallback(() => setImgFailed(true), []);

    const onKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onOpen();
        }
    }, [ onOpen ]);

    const pct = item.UserData?.PlayedPercentage;
    const subParts = [ item.ProductionYear, item.Type ].filter(Boolean).join(' · ');

    return (
        <div
            className='personalCard'
            role='button'
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={onKeyDown}
            style={{
                background: showImg ? undefined : cardGradient(hue),
                // Per-title glow used on hover (see scss)
                ['--personal-glow' as string]: cardGlow(hue)
            }}
        >
            {showImg && (
                <img
                    className='personalCard-img'
                    src={imgUrl}
                    alt={item.Name ?? ''}
                    loading='lazy'
                    onError={onImgError}
                />
            )}

            {typeof rank === 'number' && (
                <div className='personalCard-rank'>{`#${rank}`}</div>
            )}

            <div className='personalCard-heart'>
                <PersonalFavoriteButton itemId={item.Id} isFavorite={item.UserData?.IsFavorite} />
            </div>

            <div className='personalCard-overlay'>
                <div className='personalCard-title'>{item.Name}</div>
                {subParts && <div className='personalCard-sub'>{subParts}</div>}
            </div>

            {showProgress && pct ? (
                <div className='personalCard-progress'>
                    <span style={{ width: `${pct}%` }} />
                </div>
            ) : null}
        </div>
    );
};

export default PersonalCard;
