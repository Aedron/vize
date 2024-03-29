import * as React from 'react';
import { useCurrentComponentMeta } from 'hooks';
import { SelectType } from 'states';
import { ComponentUniversalEventTrigger, EventTriggerType } from '@vize/types';
import { EventTriggerSelector } from './TriggerSelector';
import { Props } from './types';

const componentUniversalEventTriggers = Object.values(ComponentUniversalEventTrigger);

export function ComponentTriggerSelector({ trigger, setTrigger }: Props) {
  const { emitEvents } = useCurrentComponentMeta()!;
  return (
    <EventTriggerSelector
      type={SelectType.COMPONENT}
      triggerType={EventTriggerType.ComponentUniversalTrigger}
      trigger={trigger}
      setTrigger={setTrigger}
      customEvents={emitEvents}
      universalEventTriggers={componentUniversalEventTriggers}
    />
  );
}
