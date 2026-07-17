import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';
import { useQueryClient } from '@tanstack/react-query';
import React, { type FC, type MouseEvent, useCallback } from 'react';

import { useToggleFavoriteMutation } from 'hooks/useFetchItems';

interface Props {
    itemId: string | null | undefined;
    isFavorite: boolean | undefined;
    className?: string;
}

/**
 * Heart toggle for the redesign: outline when not favourited, filled red when
 * favourited, always visible. Stops propagation so it never triggers the card's
 * navigation.
 */
const PersonalFavoriteButton: FC<Props> = ({ itemId, isFavorite = false, className }) => {
    const queryClient = useQueryClient();
    const { mutateAsync: toggleFavorite } = useToggleFavoriteMutation();

    const onClick = useCallback(async (e: MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (!itemId) return;
        try {
            await toggleFavorite(
                { itemId, isFavorite },
                { onSuccess: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: [ 'PersonalHome' ],
                        type: 'all',
                        refetchType: 'active'
                    });
                } }
            );
        } catch (err) {
            console.error('[PersonalFavoriteButton] toggle failed', err);
        }
    }, [ itemId, isFavorite, toggleFavorite, queryClient ]);

    return (
        <IconButton
            className={className}
            size='small'
            onClick={onClick}
        >
            {isFavorite ?
                <FavoriteIcon fontSize='small' color='error' /> :
                <FavoriteBorderIcon fontSize='small' />}
        </IconButton>
    );
};

export default PersonalFavoriteButton;
