import { memo, startTransition } from 'react';
import dynamic from 'next/dynamic';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { useProgress } from 'react-transition-progress';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  Badge,
  Button,
  Divider,
  Group,
  Image,
  Text,
  rem,
  Stack,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconAlertTriangle,
  IconCalendarClock,
  IconCalendarEvent,
  IconCheck,
  IconEdit,
  IconEditOff,
  IconTrash,
} from '@tabler/icons-react';
import { formatDateRange } from 'little-date';
import { EventDetailsProps } from '@/libs/supabase/api/_response';
import { systemUrl } from '@/app/routes';
import { EventFormProps } from '../Forms/EventFormModal';
import { deleteEventAction } from '@portal/events/actions';
import dayjs from '@/libs/dayjs';
import { notifications } from '@mantine/notifications';

const EventFormModal = dynamic(
  () =>
    import('../Forms/EventFormModal').then((mod) => ({
      default: mod.EventFormModal,
    })),
  {
    ssr: false,
  },
);

/**
 * Main event information such as title, scheduled date & time,
 * Event cover image and edit button.
 */
function EventDetailsHeader({
  editable,
  event,
  toggleEdit,
}: {
  editable: boolean;
  event: EventDetailsProps;
  toggleEdit: () => void;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const router = useRouter();
  const startProgress = useProgress();

  const eventForm: EventFormProps = {
    id: event.id!,
    title: event.title!,
    series: event.series!,
    visibility: event.visibility ?? 'Everyone',
    handled_by: event.users?.map((user) => user.faculty_id!) ?? [],
    date_starting: dayjs(event.date_starting).toDate(),
    date_ending: dayjs(event.date_ending).toDate(),
    image_url: event.image_url!,
  };

  // event deletion confirmation modal
  const deleteModal = () =>
    modals.openConfirmModal({
      centered: true,
      title: 'Delete event?',
      children: (
        <>
          <Text>
            Are you sure you want to delete this event? This action is
            irreversible.
          </Text>
          <Text fw="bold" mt="sm">
            All data associated with this event will be lost.
          </Text>
        </>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onCancel: () => console.log('Cancel'),
      onConfirm: async () => {
        const response = await deleteEventAction(event?.id!);

        notifications.show({
          title: response?.title,
          message: response?.message,
          icon: response?.status === 2 ? <IconAlertTriangle /> : <IconCheck />,
          color: response?.status === 2 ? 'red' : 'green',
          withBorder: true,
          withCloseButton: true,
          autoClose: 4000,
        });

        // only redirect when successful
        if (response?.status === 0) {
          startTransition(async () => {
            startProgress();
            router.replace(`${systemUrl}/events`);
          });
        }
      },
    });

  return (
    <>
      <EventFormModal
        close={close}
        event={eventForm}
        key={event.id}
        opened={opened}
      />

      <Group justify="space-between">
        <Stack gap={0}>
          <Title mb="lg" order={2}>
            {event?.title}
          </Title>

          {/* Event date and end */}
          {event?.date_starting && event?.date_ending && (
            <Group mb="xs">
              <Text>When:</Text>
              <Badge
                leftSection={<IconCalendarClock size={16} />}
                size="lg"
                variant="light"
              >
                {formatDateRange(
                  new Date(event.date_starting),
                  new Date(event.date_ending),
                  {
                    includeTime: true,
                  },
                )}
              </Badge>
            </Group>
          )}

          {event?.series && (
            <Group mb="xs">
              <Text>Series:</Text>
              <Tooltip
                label={`This event is part of the "${event.series}" events.`}
                position="bottom"
              >
                <Badge color={event.series_color!} variant="dot">
                  {event.series}
                </Badge>
              </Tooltip>
            </Group>
          )}

          {/* Event control buttons */}
          <Group gap="xs" mt={16}>
            <Button
              leftSection={
                <IconCalendarEvent
                  style={{ width: rem(16), height: rem(16) }}
                />
              }
              onClick={open}
              variant="default"
            >
              Adjust Details
            </Button>

            <Button
              leftSection={
                editable ? (
                  <IconEditOff style={{ width: rem(16), height: rem(16) }} />
                ) : (
                  <IconEdit style={{ width: rem(16), height: rem(16) }} />
                )
              }
              onClick={toggleEdit}
              variant="default"
            >
              {editable ? 'Hide Toolbars' : 'Edit Description'}
            </Button>

            <Divider orientation="vertical" />

            <Button
              color="red"
              leftSection={
                <IconTrash style={{ width: rem(16), height: rem(16) }} />
              }
              onClick={deleteModal}
              variant="filled"
            >
              Delete Event
            </Button>
          </Group>
        </Stack>

        <Image
          alt=""
          className="shadow-lg"
          component={NextImage}
          fallbackSrc="/assets/no-image.png"
          h="auto"
          height={340}
          mb={16}
          radius="md"
          src={event.image_url}
          w="auto"
          width={340}
        />
      </Group>
    </>
  );
}

export const EventInfoHeader = memo(EventDetailsHeader);
