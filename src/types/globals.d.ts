import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react' {
  export interface HTMLAttributes<T> extends React.AriaAttributes, React.DOMAttributes<T> {
    className?: string;
  }
  export type ReactNode = any;
  export type FC<T = {}> = (props: T) => any;
  export const useState: any;
  export const useEffect: any;
  export const createContext: any;
  export const useContext: any;
}

declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module 'lucide-react' {
  export const ArrowRight: any;
  export const ShieldCheck: any;
  export const Activity: any;
  export const Zap: any;
  export const CheckCircle2: any;
  export const FileText: any;
  export const Stethoscope: any;
  export const Search: any;
  export const Users: any;
  export const Building2: any;
  export const Heart: any;
  export const ShieldOff: any;
  export const AlertCircle: any;
  export const X: any;
  export const Plus: any;
  export const TrendingUp: any;
  export const Scan: any;
  export const Calendar: any;
  export const Clock: any;
  export const MessageCircle: any;
  export const Bell: any;
  export const Settings: any;
  export const Maximize: any;
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/navigation' {
  export const useRouter: any;
  export const usePathname: any;
}

declare module 'next/font/google' {
  export const Inter: any;
  export const Noto_Sans_Devanagari: any;
  export const Outfit: any;
}

declare module 'next' {
  export type Metadata = any;
}

declare module '*.json' {
  const value: any;
  export default value;
}
