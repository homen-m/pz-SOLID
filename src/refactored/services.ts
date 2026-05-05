import { IFleetRepository, IDispatchNotifier } from '../interfaces';

// Реалізації для DIP (Модулі нижнього рівня)
export class PostgresFleetRepo implements IFleetRepository {
    saveDispatchRecord(record: any): void {
        console.log(`[DB] Dispatch record saved:`, record);
    }
}

export class SmsDispatchNotifier implements IDispatchNotifier {
    notifyDispatch(message: string): void {
        console.log(`[SMS] To Fleet Admin: ${message}`);
    }
}