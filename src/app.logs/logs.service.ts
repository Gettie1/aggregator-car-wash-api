import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

@Injectable()
export class LogsService {
  async logToFile(entry: string, ip?: string) {
    const formatedEntry = `${Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'medium',
      timeZone: 'Africa/Nairobi',
    }).format(new Date())} - ${entry}${ip ? ` - IP: ${ip}` : ''}\n`;

    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const logFilePath = path.join(logsDir, 'app.log');
      try {
        await fsPromises.access(logsDir);
      } catch {
        await fsPromises.mkdir(logsDir, { recursive: true });
      }
      await fsPromises.appendFile(logFilePath, formatedEntry);
    } catch (error) {
      console.error('Error writing to log file:', error);
      throw new Error('Failed to write to log file');
    }
  }
}
