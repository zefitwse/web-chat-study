import { useEffect, useRef } from 'react';

// 一次性监听效果
export function useOnceEffect(callback: () => void, dep: any, condition: (dep: any) => boolean) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current && condition(dep)) {
      callback();
      hasRun.current = true;
    }
  }, [dep]);
}
