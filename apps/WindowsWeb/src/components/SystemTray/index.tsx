import { HStack } from '@chakra-ui/react';

import { AppsTray } from './AppsTray';
import { BatteryIndicator } from './BatteryIndicator';
import { Clock } from './Clock';
import { NotificationsCenter } from './NotificationsCenter';
import { QuickSettings } from './QuickSettings';

export function SystemTray() {
	return (
		<HStack alignItems="stretch" spacing={1}>
			<AppsTray />
			<BatteryIndicator />
			<NotificationsCenter />
			<QuickSettings />
			<Clock />
		</HStack>
	);
}
