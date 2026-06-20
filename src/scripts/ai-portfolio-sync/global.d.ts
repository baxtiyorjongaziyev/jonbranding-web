declare module '../../services/portfolio-bot/src/workflow.js' {
  export const processPortfolioQueue: any;
  export const runWorkflow: any;
}
declare module 'dotenv' {
  export function config(options?: any): any;
}
declare module 'telegraf' {
  export class Telegraf {
    constructor(token: string);
  }
}
