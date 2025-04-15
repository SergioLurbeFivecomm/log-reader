import * as fs from 'fs';
import * as readline from 'readline';
import { MessageProcessorService } from './message-processor.service';

export class LogReaderService {
    private filePath: string;
    private messageProcessorService: MessageProcessorService;

    constructor(filePath: string, messageProcessorService: MessageProcessorService) {
        this.filePath = filePath;
        this.messageProcessorService = messageProcessorService;
    }

    async readLogFile(): Promise<void> {
        const fileStream = fs.createReadStream(this.filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let count = 0;

        for await (const line of rl) {
            const match = line.match(/^(\d{4}-\d{2}-\d{2}_\d{2}:\d{2}:\d{2}) *: *(\w+) *: *(.*)$/);
            if (match) {
                let [, rawTimestamp, topic, message] = match;

                if (topic.startsWith('r')) continue;

                const timestamp = rawTimestamp.replace('_', ' '); 
                await this.messageProcessorService.processMessage(timestamp, topic, message);

                count++;
                if (count % 100 === 0) {
                    console.log(`${timestamp}`);
                }
            }
        }
    }
}
