type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logLevelToNumber: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const isDevelopment = process.env.NODE_ENV === 'development';
const logLevel = isDevelopment ? 'debug' : 'info';

const shouldLog = (level: LogLevel): boolean => {
  return logLevelToNumber[level] >= logLevelToNumber[logLevel as LogLevel];
};

// JSON.stringify(Error) → "{}" bo'lardi: xato matni va stack logda yo'qolardi.
const errorReplacer = (_key: string, value: unknown) =>
  value instanceof Error ? { name: value.name, message: value.message, stack: value.stack } : value;

const serialize = (data: unknown): string => {
  try {
    return JSON.stringify(data, errorReplacer);
  } catch {
    return String(data);
  }
};

const formatLog = (level: LogLevel, message: string, data?: unknown): string => {
  const timestamp = new Date().toISOString();
  if (data !== undefined) {
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${serialize(data)}`;
  }
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
};

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (shouldLog('debug')) {
      console.log(formatLog('debug', message, data));
    }
  },
  info: (message: string, data?: unknown) => {
    if (shouldLog('info')) {
      console.log(formatLog('info', message, data));
    }
  },
  warn: (message: string, data?: unknown) => {
    if (shouldLog('warn')) {
      console.warn(formatLog('warn', message, data));
    }
  },
  error: (message: string, data?: unknown) => {
    if (shouldLog('error')) {
      console.error(formatLog('error', message, data));
    }
  },
};
