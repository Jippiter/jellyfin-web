import type { Api } from '@jellyfin/sdk/lib/api';
import type { BaseItemDto } from '@jellyfin/sdk/lib/generated-client/models/base-item-dto';
import { BaseItemKind } from '@jellyfin/sdk/lib/generated-client/models/base-item-kind';
import { ItemFields } from '@jellyfin/sdk/lib/generated-client/models/item-fields';
import { ItemSortBy } from '@jellyfin/sdk/lib/generated-client/models/item-sort-by';
import { SortOrder } from '@jellyfin/sdk/lib/generated-client/models/sort-order';
import { getLibraryApi } from '@jellyfin/sdk/lib/utils/api/library-api';
import { useQuery } from '@tanstack/react-query';

import { useApi } from 'hooks/useApi';

const FIELDS = [ ItemFields.Overview, ItemFields.Genres ];

const fetchLatest = async (
    api: Api,
    userId: string,
    types: BaseItemKind[],
    limit: number,
    signal?: AbortSignal
): Promise<BaseItemDto[]> => {
    const res = await getLibraryApi(api).getItems(
        {
            userId,
            recursive: true,
            includeItemTypes: types,
            sortBy: [ ItemSortBy.DateCreated ],
            sortOrder: [ SortOrder.Descending ],
            fields: FIELDS,
            imageTypeLimit: 1,
            limit
        },
        { signal }
    );
    return res.data.Items ?? [];
};

/** Latest items of the given types, newest first. */
export const useLatestItems = (types: BaseItemKind[], limit = 20) => {
    const { api, user } = useApi();
    const userId = user?.Id;
    return useQuery({
        queryKey: [ 'PersonalHome', 'Latest', types, limit, userId ],
        queryFn: ({ signal }) => fetchLatest(api!, userId!, types, limit, signal),
        enabled: !!api && !!userId
    });
};
