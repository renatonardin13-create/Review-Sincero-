import React, { useState, useEffect } from 'react';
import { Review, ReviewNotificationConfig } from '../types';
import { getEffectiveNotificationConfig, resolveNotificationItem } from '../services/purchaseNotificationService';
import { PurchaseNotification, NotificationVisualData } from './PurchaseNotification';

interface PurchaseNotificationEngineProps {
  review: Review;
  onCtaClick?: () => void;
}

export const PurchaseNotificationEngine: React.FC<PurchaseNotificationEngineProps> = ({
  review,
  onCtaClick
}) => {
  const config: ReviewNotificationConfig = getEffectiveNotificationConfig(review);
  const [data, setData] = useState<NotificationVisualData | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [sessionCount, setSessionCount] = useState<number>(0);

  useEffect(() => {
    if (!config.enabled) {
      setIsVisible(false);
      return;
    }

    let isMounted = true;
    let timerId: NodeJS.Timeout | null = null;
    let hideTimerId: NodeJS.Timeout | null = null;

    const triggerNotification = async () => {
      if (!isMounted) return;
      if (document.hidden) return; // Respect tab visibility
      if (sessionCount >= config.maxPerSession) return;

      const itemData = await resolveNotificationItem(review, config);
      if (itemData && isMounted) {
        setData(itemData);
        setIsVisible(true);
        setSessionCount(prev => prev + 1);

        // Auto hide after duration
        if (hideTimerId) clearTimeout(hideTimerId);
        hideTimerId = setTimeout(() => {
          if (isMounted) setIsVisible(false);
        }, config.durationMs || 7000);
      }
    };

    // Initial trigger after 3 seconds
    const initialTimer = setTimeout(() => {
      triggerNotification();
    }, 3000);

    // Interval loop
    const intervalMs = Math.max(config.intervalMs || 30000, 5000);
    const intervalTimer = setInterval(() => {
      triggerNotification();
    }, intervalMs);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
      if (hideTimerId) clearTimeout(hideTimerId);
    };
  }, [review, config.enabled, config.mode, config.intervalMs, config.durationMs, config.maxPerSession]);

  if (!isVisible || !data) return null;

  return (
    <PurchaseNotification
      data={data}
      config={config}
      onClose={() => setIsVisible(false)}
      onClickCta={onCtaClick}
    />
  );
};
