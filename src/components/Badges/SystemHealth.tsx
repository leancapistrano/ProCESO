'use client';

import { Tooltip, Badge } from '@mantine/core';
import { useEffect, useState } from 'react';
import { checkHealth } from './actions';

/**
 * Check the system status and display health badge.
 */
export default function SystemHealth() {
  const [health, setHealth] = useState(0);

  useEffect(() => {
    checkHealth().then((health) => {
      setHealth(health);
    });
  }, []);

  return health === 2 ? (
    <Tooltip label="All systems are not working!">
      <Badge
        className="cursor-pointer font-semibold normal-case"
        color="red"
        component="a"
        href={process.env.NEXT_PUBLIC_STATUS_PAGE}
        px={15}
        py={12}
        radius="md"
        size="md"
        target="__blank"
        variant="dot"
      >
        All systems down!
      </Badge>
    </Tooltip>
  ) : health === 1 ? (
    <Tooltip label="Some functionality might not work.">
      <Badge
        className="cursor-pointer font-semibold normal-case"
        color="yellow"
        component="a"
        href={process.env.NEXT_PUBLIC_STATUS_PAGE}
        px={15}
        py={12}
        radius="md"
        size="md"
        target="__blank"
        variant="dot"
      >
        Some systems are down.
      </Badge>
    </Tooltip>
  ) : (
    <Tooltip label="All systems are working as expected.">
      <Badge
        className="cursor-pointer font-semibold normal-case"
        color="green"
        component="a"
        href={process.env.NEXT_PUBLIC_STATUS_PAGE}
        px={15}
        py={12}
        radius="md"
        size="md"
        target="__blank"
        variant="dot"
      >
        All systems working.
      </Badge>
    </Tooltip>
  );
}
