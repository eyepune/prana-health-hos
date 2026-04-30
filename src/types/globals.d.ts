import * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }

  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// Consolidating all external module declarations
declare module 'bytez.js' {
  const Bytez: any;
  export default Bytez;
}

declare module 'react-markdown';
declare module 'remark-gfm';

// If types are still missing for these, keep them as any for now but avoid shadowing
declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module 'lucide-react';
