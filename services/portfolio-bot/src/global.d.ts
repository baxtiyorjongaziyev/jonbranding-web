declare module 'telegram' {
  export class TelegramClient {
    constructor(session: any, apiId: number, apiHash: string, opts: any);
    start(opts: any): Promise<void>;
    getEntity(id: string): Promise<any>;
    addEventHandler(handler: (event: any) => Promise<void>, filter?: any): void;
    sendMessage(peer: any, opts: any): Promise<void>;
    session: any;
    disconnect(): Promise<void>;
  }
  export namespace Api {
    export type Message = any;
  }
  export const Api: any;
}
declare module 'telegram/sessions/index.js' {
  export class StringSession {
    constructor(session: string);
  }
}
declare module 'input' {
  export function text(prompt: string): Promise<string>;
}
declare module 'googleapis';
declare module 'axios';
