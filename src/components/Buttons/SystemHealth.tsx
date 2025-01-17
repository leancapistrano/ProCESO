'use client';

import { useEffect, useState } from 'react';
import { Tooltip, Badge } from '@mantine/core';
import { checkSystemHealth } from '@/app/actions';

/**
 * Check the system status and display health badge.
 */
export function SystemHealth() {
  const [health, setHealth] = useState(0);

  useEffect(() => {
    // check every 15 minutes
    const interval = setInterval(async () => {
      const health = await checkSystemHealth();
      setHealth(health);
    }, 900000);

    return () => clearInterval(interval);
  }, []);

  return health === 2 ? (
    <Tooltip label="All system components are not working!">
      <Badge
        className="cursor-pointer content-center font-semibold normal-case"
        color="red"
        component="a"
        href={process.env.NEXT_PUBLIC_STATUS_PAGE}
        px={15}
        py={10}
        radius="md"
        size="sm"
        target="__blank"
        variant="dot"
      >
        All systems down!
      </Badge>
    </Tooltip>
  ) : health === 1 ? (
    <Tooltip label="Some functionality might not work.">
      <Badge
        className="cursor-pointer content-center font-semibold normal-case"
        color="yellow"
        component="a"
        href={process.env.NEXT_PUBLIC_STATUS_PAGE}
        px={15}
        py={10}
        radius="md"
        size="sm"
        target="__blank"
        variant="dot"
      >
        Limited functionality.
      </Badge>
    </Tooltip>
  ) : (
    <Tooltip label="All systems are working as expected.">
      <Badge
        className="cursor-pointer content-center font-semibold normal-case"
        color="green"
        component="a"
        href={process.env.NEXT_PUBLIC_STATUS_PAGE}
        px={15}
        py={10}
        radius="md"
        size="sm"
        target="__blank"
        variant="dot"
      >
        All systems working.
      </Badge>
    </Tooltip>
  );
}
