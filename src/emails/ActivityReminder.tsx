import { Link, Text } from '@react-email/components';
import { sidebarRoutes } from '@/app/routes';
import type { Tables } from '@/libs/supabase/_database';
import dayjs from '@/libs/dayjs';
import Template from './_Template';
import '@mantine/core/styles.css';

export default function ActivityReminder({
  activity,
}: {
  activity: Tables<'activities'>;
}) {
  const link = `https://deuz.tech${sidebarRoutes[1]?.links?.[0]?.link}/${activity?.id as string}/info`;

  return (
    <Template>
      <Text className="mt-8">
        This email is to remind you that the:
        <br />
        <Link
          className="font-bold text-yellow-500 underline underline-offset-1"
          href={link}
        >
          {activity?.title ?? 'Untitled Activity'}
        </Link>
        .
        <br />
        is coming up in {dayjs(activity?.date_starting).toNow(true)}.
      </Text>

      {activity?.date_starting && activity?.date_ending ? (
        <Text>
          The activity is to be conducted at{' '}
          <span className="font-bold">
            {dayjs(activity.date_starting).format('MMM D, YYYY h:mm A')}
            {' - '}
            {dayjs(activity.date_ending).format('MMM D, YYYY h:mm A')}
          </span>
          .
        </Text>
      ) : (
        <Text>
          The activity is to be conducted at{' '}
          <span className="font-bold">
            {dayjs(activity?.date_starting).format('MMMM DD, YYYY hh:mm A')}
          </span>
          .
        </Text>
      )}
    </Template>
  );
}
