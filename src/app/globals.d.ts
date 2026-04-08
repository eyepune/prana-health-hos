import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  interface ChangeEvent<T = Element> {
    target: T & { value: string; name: string; files: FileList | null };
  }
  interface FormEvent<T = Element> {
    preventDefault(): void;
    target: T;
  }
  function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((curr: T) => T)) => void];
  function useEffect(effect: () => (void | (() => void)), deps?: ReadonlyArray<any>): void;
  function useContext<T>(context: React.Context<T>): T;
  function useMemo<T>(factory: () => T, deps: ReadonlyArray<any> | undefined): T;
  function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  function useRef<T>(initialValue: T | null): { current: T | null };
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module 'lucide-react' {
  export const MessageCircle: any;
  export const FileText: any;
  export const Maximize: any;
  export const Settings: any;
  export const Bell: any;
  export const Activity: any;
  export const Zap: any;
  export const ShieldCheck: any;
  export const ShieldOff: any;
  export const AlertCircle: any;
  export const X: any;
  export const Plus: any;
  export const ArrowRight: any;
  export const TrendingUp: any;
  export const Scan: any;
  export const Phone: any;
  export const MapPin: any;
  export const Navigation: any;
  export const ChevronRight: any;
  export const ChevronLeft: any;
}

declare module 'bytez' {
  const bytez: any;
  export default bytez;
}
