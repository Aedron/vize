export enum LogLevel {
  info = 'info',
  error = 'error',
}

export interface LogItem {
  context: string;
  level: LogLevel;
  message: string;
  timestamp: string;
  result?: object;
  [key: string]: any;
}

export interface QueryLogParams {
  startLine?: string;
}
