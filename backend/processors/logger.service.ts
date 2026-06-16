import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  log(message: any, context?: string) {
    console.log(`[INFO] ${context ? `[${context}] ` : ''}${message}`);
  }
  error(message: any, trace?: string, context?: string) {
    console.error(`[ERROR] ${context ? `[${context}] ` : ''}${message}`, trace);
  }
  warn(message: any, context?: string) {
    console.warn(`[WARN] ${context ? `[${context}] ` : ''}${message}`);
  }
  debug(message: any, context?: string) {
    console.debug(`[DEBUG] ${context ? `[${context}] ` : ''}${message}`);
  }
  verbose(message: any, context?: string) {
    console.log(`[VERBOSE] ${context ? `[${context}] ` : ''}${message}`);
  }
}