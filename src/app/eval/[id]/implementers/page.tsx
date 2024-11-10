import { cache } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import dynamic from 'next/dynamic';
import NextImage from 'next/image';
import { redirect, RedirectType } from 'next/navigation';
import { Badge, Group, Stack, Title, Image, Divider } from '@mantine/core';
import sanitizeHtml from 'sanitize-html';
import { metadata as defaultMetadata } from '@/app/layout';
import { createServerClient } from '@/libs/supabase/server';
import { getActivityDetails } from '@/libs/supabase/api/activity';
import { siteUrl } from '@/utils/url';
import { PageLoader } from '@/components/Loader/PageLoader';
import { IconCalendarClock } from '@tabler/icons-react';
import { formatDateRange } from 'little-date';

const ImplementersForm = dynamic(
  () => import('@/app/eval/_components/Forms/ImplementersForm'),
  {
    loading: () => <PageLoader />,
  },
);

// cache the activity details to avoid duplicated
// requests for the page and metadata generation.
const cacheActivityDetails = cache(async (id: string) => {
  const cookieStore = cookies();
  const supabase = await createServerClient(cookieStore);

  return await getActivityDetails({
    activityId: id,
    supabase,
  });
});

/**
 * For generating dynamic OpenGraph metadata for sharing links.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const activity = await cacheActivityDetails(id);

  if (
    !activity.data ||
    (activity.data.visibility !== 'Everyone' && typeof window !== 'undefined')
  ) {
    return {
      title: 'Activity not found – ' + defaultMetadata.title,
      description: activity.message,
    };
  }

  return {
    title: `${activity.data.title} Evaluation for Implementers | T.I.P Community Extension Services Office – Manila`,
    description: sanitizeHtml(activity.data.description as string, {
      allowedTags: [],
    }),
    applicationName: 'ProCESO',
    publisher: activity.data.created_by,
    category: activity.data.series,
    robots: 'index, follow',
    openGraph: {
      siteName: 'ProCESO',
      url: `${siteUrl()}/eval/${activity.data.id}/implementers`,
      images: [{ url: activity.data.image_url as string }],
      publishedTime: activity.data.created_at as string,
    },
  };
}

export default async function ImplementersFeedback({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = await cacheActivityDetails(id);

  if (!activity?.data?.feedback) {
    redirect('/eval/closed', RedirectType.replace);
  }

  return (
    <>
      <Divider label="Implementers' Evaluation Form" my="lg" />

      {/* Activity Details */}
      <Group mb="md">
        <Image
          alt=""
          className="object-contain"
          component={NextImage}
          fallbackSrc="/assets/no-image.png"
          h="auto"
          height={300}
          mb={16}
          radius="md"
          src={activity.data.image_url}
          w="auto"
          width={300}
        />

        <Stack gap={6}>
          <Title order={3}>{activity.data.title}</Title>
          {/* Activity date and end */}
          {activity.data.date_starting && activity.data.date_ending && (
            <Badge
              leftSection={<IconCalendarClock size={16} />}
              size="lg"
              variant="light"
            >
              {formatDateRange(
                new Date(activity.data.date_starting),
                new Date(activity.data.date_ending),
                {
                  includeTime: true,
                },
              )}
            </Badge>
          )}
        </Stack>
      </Group>

      <ImplementersForm activity={activity.data} />
    </>
  );
}
