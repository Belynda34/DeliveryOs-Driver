import { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';

import { calculateRemainingTime } from '@/utils/serverTime';

const TICK_INTERVAL_MS = 250;
const LOW_TIME_THRESHOLD_SECONDS = 10;

type Props = {
  serverCreatedAt: string;
  durationSeconds?: number;
  onExpire: () => void;
};

export function CountdownTimer({
  serverCreatedAt,
  durationSeconds = 30,
  onExpire,
}: Props): React.JSX.Element {
  const [remaining, setRemaining] = useState(() =>
    calculateRemainingTime(serverCreatedAt, durationSeconds)
  );
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    hasExpiredRef.current = false;

    const interval = setInterval(() => {
      const nextRemaining = calculateRemainingTime(serverCreatedAt, durationSeconds);
      setRemaining(nextRemaining);

      if (nextRemaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire();
      }
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [serverCreatedAt, durationSeconds, onExpire]);

  const isLowTime = remaining < LOW_TIME_THRESHOLD_SECONDS;
  const fillColorClass = isLowTime ? 'bg-warning' : 'bg-accent';
  const textColorClass = isLowTime ? 'text-warning' : 'text-text-primary';
  const progressRatio =
    durationSeconds > 0 ? Math.min(1, Math.max(0, remaining / durationSeconds)) : 0;

  return (
    <View className="items-center gap-3">
      <Text className={`text-6xl font-bold ${textColorClass}`}>{Math.ceil(remaining)}</Text>
      <View className="h-2 w-full overflow-hidden rounded-pill bg-surface-raised">
        <View
          className={`h-full rounded-pill ${fillColorClass}`}
          style={{ width: `${progressRatio * 100}%` }}
        />
      </View>
    </View>
  );
}
