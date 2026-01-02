declare type WebpushrOptions = {
  title?: string;
  message?: string;
  url?: string;
  icon?: string;
  requireInteraction?: boolean;
  [key: string]: any;
};

// `webpushr` is a function that takes a string and options object
declare function webpushr(command: 'setup', options: { key: string }): void;
declare function webpushr(command: 'sendNotification', options: WebpushrOptions): void;
declare function webpushr(command: string, options?: any): void; // fallback
