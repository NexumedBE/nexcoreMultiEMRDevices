export {};

declare global {
  interface Window {
    api: {
      getAppVersion: () => Promise<string>;
      onUpdateAvailable: (callback: (version: string) => void) => void;
    };

    secureStorage: {
      saveToken: (email: string, token: string) => Promise<void>;
      getToken: (email: string) => Promise<string | null>;
      removeToken: (email: string) => Promise<void>;
      getAllEmails: () => Promise<string[]>; 
    };
  }
}

