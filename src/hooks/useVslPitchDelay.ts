import { useState, useEffect } from 'react';

interface UseVslPitchDelayOptions {
  delaySeconds?: number;
  productId?: string;
  enabled?: boolean;
}

export function useVslPitchDelay({
  delaySeconds = 0,
  productId = 'default',
  enabled = true,
}: UseVslPitchDelayOptions) {
  const isDelayActive = enabled && delaySeconds > 0;

  const storageKey = `digitallpay_vsl_revealed_${productId}`;

  // Se já foi revelado nesta sessão do navegador, mantém aberto
  const isAlreadyRevealed = () => {
    if (typeof window === 'undefined') return true;
    try {
      return sessionStorage.getItem(storageKey) === 'true';
    } catch {
      return false;
    }
  };

  const [showOffer, setShowOffer] = useState<boolean>(() => {
    if (!isDelayActive) return true;
    return isAlreadyRevealed();
  });

  const [secondsLeft, setSecondsLeft] = useState<number>(delaySeconds);

  useEffect(() => {
    if (!isDelayActive || showOffer) return;

    if (isAlreadyRevealed()) {
      setShowOffer(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowOffer(true);
          try {
            sessionStorage.setItem(storageKey, 'true');
          } catch {
            // noop
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isDelayActive, delaySeconds, storageKey, showOffer]);

  const revealNow = () => {
    setShowOffer(true);
    try {
      sessionStorage.setItem(storageKey, 'true');
    } catch {
      // noop
    }
  };

  return {
    showOffer,
    secondsLeft,
    revealNow,
    isDelayActive,
  };
}

