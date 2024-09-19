import { memo } from 'react';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import styles from './Calendar.module.css';

// styles that requires specificity for override
import '@/styles/full-calendar.css';

/**
 * Calendar component for displaying events.
 *
 * For more information about FullCalendar:
 * @see https://fullcalendar.io/docs
 *
 * For more information about FullCalendar `events` JSON feed:
 * @see https://fullcalendar.io/docs/events-json-feed
 */
function CalendarComponent() {
  return (
    <section className={styles.root}>
      <FullCalendar
        buttonText={{
          today: 'Today',
          month: 'Month',
          week: 'Week',
          day: 'Day',
          list: 'List',
          multiMonthYear: 'Year',
        }}
        dayMaxEvents={true}
        events="/api/events/feed" // App API endpoint for fetching events
        headerToolbar={{
          left: 'title',
          center: 'timeGridWeek,dayGridMonth,multiMonthYear list',
          right: 'timeGridDay,today prev,next',
        }}
        height="96vh"
        hiddenDays={[0]}
        initialView="dayGridMonth"
        lazyFetching={true}
        nowIndicator={true}
        plugins={[dayGridPlugin, multiMonthPlugin, listPlugin, timeGridPlugin]}
        timeZone="Asia/Manila"
      />
    </section>
  );
}

export const Calendar = memo(CalendarComponent);