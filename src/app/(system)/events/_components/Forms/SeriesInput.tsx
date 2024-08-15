'use client';

import { memo, useState, useDeferredValue, useEffect } from 'react';
import { Autocomplete, type AutocompleteProps, Loader } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { getFilteredSeries } from '@/api/supabase/series';
import type { Tables } from '@/utils/supabase/types';

/**
 * Event series autocomplete input
 */
export const SeriesInput = memo((props: AutocompleteProps) => {
  const [query, setQuery] = useState('');
  const seriesQuery = useDeferredValue<string>(query);
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      const response = await getFilteredSeries(seriesQuery);

      if (response.data) {
        setData(response.data.map((s: Tables<'series'>) => s.title ?? []));
      } else {
        notifications.show({
          title: 'Unable to fetch series',
          message: response.message + ', You can set it later.',
          color: 'yellow',
        });
      }

      setLoading(false);
    };

    // prevents query on initial render
    if (seriesQuery) {
      // noinspection JSIgnoredPromiseFromCall
      fetchSeries();
    }
  }, [seriesQuery]);

  return (
    <Autocomplete
      value={query}
      data={data}
      limit={5}
      onChangeCapture={(e) => setQuery(e.currentTarget.value)}
      rightSection={loading ? <Loader size="1rem" /> : null}
      label="Event Series"
      placeholder="Brigada Eskwela"
      {...props}
    />
  );
});

SeriesInput.displayName = 'SeriesInput';
