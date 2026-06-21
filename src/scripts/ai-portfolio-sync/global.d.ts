declare module 'telegraf' {
  export class Telegraf {
    constructor(token: string);
    telegram: {
      getFileLink(fileId: string): Promise<{ href: string }>;
    };
  }
}
declare module '../../services/portfolio-bot/src/workflow.js' {
    export function runWorkflow(): Promise<void>;
}
