import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import {
  ColorSchemeScript,
  type MantineColorsTuple,
  MantineProvider,
  createTheme,
} from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { ProgressBar, ProgressBarProvider } from 'react-transition-progress';

import '@/styles/globals.css';

const font = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Brand colors generated using Mantine's color generator.
 * https://mantine.dev/colors-generator/
 */
const brandColor: MantineColorsTuple = [
  '#fffae1',
  '#fff3cc',
  '#ffe69b',
  '#ffd864',
  '#ffcc38',
  '#ffc51c',
  '#ffc109',
  '#e3aa00',
  '#ca9600',
  '#ae8200',
];

/**
 * Custom theming for Mantine UI
 */
const theme = createTheme({
  fontFamily: 'Inter, sans-serif',
  primaryColor: 'brand',
  colors: {
    brand: brandColor,
  },
  defaultRadius: 'md',
  components: {
    Title: {
      classNames: {
        root: 'font-extrabold',
      },
    },
  },
});

/**
 * Site metadata
 */
export const metadata: Metadata = {
  title: 'ProCESO | T.I.P Community Extensions Services Office',
  description:
    'Community Outreach Management System for Technological Institute of the Philippines - CESO Department.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={font.variable} lang="en" suppressHydrationWarning>
      {/* IMPORTANT: don't use next/head here, destroys initial UI loading */}
      <head key="mantine-provider">
        <ColorSchemeScript defaultColorScheme="auto" />
        <link
          crossOrigin="use-credentials"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL}
          rel="preconnect"
        />
      </head>

      <body>
        {/* App-level providers */}
        <MantineProvider
          deduplicateCssVariables
          defaultColorScheme="auto"
          theme={theme}
          withCssVariables
        >
          <DatesProvider settings={{ timezone: undefined }}>
            <ProgressBarProvider>
              <ProgressBar className="fixed left-0 top-0 z-[500] h-1 bg-[--mantine-primary-color-filled] shadow-lg shadow-[--mantine-primary-color-hover]" />
              <ModalsProvider>
                <Notifications limit={8} />
                {/* Actual content */}
                {children}
              </ModalsProvider>
            </ProgressBarProvider>
          </DatesProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
