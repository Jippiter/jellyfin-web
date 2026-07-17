import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import StarIcon from '@mui/icons-material/Star';
import React, { type FC, useCallback, useEffect, useState } from 'react';

import { getCardImageUrl } from 'components/cardbuilder/utils/url';
import { playbackManager } from 'components/playback/playbackmanager';
import { appRouter } from 'components/router/appRouter';
import { useApi } from 'hooks/useApi';
import type { ItemDto } from 'types/base/models/item-dto';

import { heroGradient, hueFromString } from './hue';

interface Props {
    items: BaseItemDto[];
}

const ROTATE_MS = 6000;

const formatRuntime = (ticks?: number | null): string | null => {
    if (!ticks) return null;
    const mins = Math.round(ticks / 600000000);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

/** Hero backdrop image that quietly disappears (revealing the gradient) if it fails to load. */
const HeroImage: FC<{ src?: string }> = ({ src }) => {
    const [ failed, setFailed ] = useState(false);
    const onError = useCallback(() => setFailed(true), []);
    if (!src || failed) return null;
    return <img className='personalHero-img' src={src} alt='' onError={onError} />;
};

const HeroDot: FC<{ index: number; active: boolean; onSelect: (i: number) => void }> = ({ index, active, onSelect }) => {
    const onClick = useCallback(() => onSelect(index), [ index, onSelect ]);
    return (
        <button
            type='button'
            className={active ? 'is-active' : undefined}
            aria-label={`Slide ${index + 1}`}
            onClick={onClick}
        />
    );
};

const PersonalHero: FC<Props> = ({ items }) => {
    const { api } = useApi();
    const [ idx, setIdx ] = useState(0);

    useEffect(() => {
        if (items.length <= 1) return;
        const t = setInterval(() => setIdx(i => (i + 1) % items.length), ROTATE_MS);
        return () => clearInterval(t);
    }, [ items.length ]);

    const item = items[Math.min(idx, items.length - 1)];

    const onPlay = useCallback(() => {
        if (item) void playbackManager.play({ items: [ item ] });
    }, [ item ]);

    const onMoreInfo = useCallback(() => {
        if (item) appRouter.showItem(item);
    }, [ item ]);

    if (!item) return null;

    const hue = hueFromString(item.Name ?? item.Id ?? '');
    const { imgUrl } = getCardImageUrl({
        api,
        item: item as ItemDto,
        options: { width: 1280, preferThumb: true }
    });

    const runtime = formatRuntime(item.RunTimeTicks);
    const rating = item.CommunityRating ? item.CommunityRating.toFixed(1) : null;
    const kicker = item.Genres?.[0] ?? item.Type ?? '';

    return (
        <div
            className='personalHero'
            style={{ background: heroGradient(hue) }}
        >
            <HeroImage src={imgUrl} />
            <div className='personalHero-scrim' />

            <div className='personalHero-content'>
                {kicker && <div className='personalHero-kicker'>{kicker}</div>}
                <h1 className='personalHero-title'>{item.Name}</h1>

                <div className='personalHero-meta'>
                    {rating && (
                        <span className='personalHero-rating'>
                            <StarIcon fontSize='inherit' /> {rating}
                        </span>
                    )}
                    {item.ProductionYear && <span>{item.ProductionYear}</span>}
                    {runtime && <span>{runtime}</span>}
                    <span className='personalHero-hd'>HD</span>
                </div>

                {item.Overview && (
                    <p className='personalHero-overview'>{item.Overview}</p>
                )}

                <div className='personalHero-actions'>
                    <button type='button' className='personalHero-play' onClick={onPlay}>
                        <PlayArrowIcon /> Play
                    </button>
                    <button type='button' className='personalHero-info' onClick={onMoreInfo}>
                        <InfoOutlinedIcon /> More Info
                    </button>
                </div>
            </div>

            {items.length > 1 && (
                <div className='personalHero-dots'>
                    {items.map((it, i) => (
                        <HeroDot
                            key={it.Id ?? i}
                            index={i}
                            active={i === idx}
                            onSelect={setIdx}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default PersonalHero;
