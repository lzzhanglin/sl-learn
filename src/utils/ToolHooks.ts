import { useEffect, useRef } from 'react';


function useInterval(
  // 这里返回值的类型感觉限制太死了
  fn: () => void,
  delay: number | null | undefined,
  options?: {
    immediate?: boolean;
  },
): void {
  // 控制是否立即执行
  const immediate = options?.immediate;

  const fnRef = useRef<() => void>();
  fnRef.current = fn;

  useEffect(() => {
    // 当传入的delay是null或者undefined时，则停止定时器
    if (delay === undefined || delay === null) return;
    if (immediate) {
      fnRef.current?.();
    }
    const timer = setInterval(() => {
      fnRef.current?.();
    }, delay);
    // 每当delay变化则清除旧有定时器
    // useEffect做这事真的挺方便的
    return () => {
      clearInterval(timer);
    };
  }, [delay, immediate]);
}


function useTimeout(fn: () => void, delay: number | null | undefined): void {
  // 和useInterval不太一样，用了usePersistFn 但是usePersistFn也是基于useRef
  const timerFn = usePersistFn(fn);

  useEffect(() => {
    // 可以控制干掉定时器
    if (delay === undefined || delay === null) return;
    const timer = setTimeout(() => {
      timerFn();
    }, delay);
    // delay变化 旧定时器被干掉
    return () => {
      clearTimeout(timer);
    };
  }, [delay, timerFn]);
}


type noop = (...args: any[]) => any;
function usePersistFn<T extends noop>(fn: T) {
    const fnRef = useRef<T>(fn);
    fnRef.current = fn;
  
    const persistFn = useRef<T>();
    if (!persistFn.current) {
      persistFn.current = function (...args) {
        return fnRef.current!.apply(this, args);
      } as T;
    }
  
    return persistFn.current!;
  }

export {useInterval, useTimeout}