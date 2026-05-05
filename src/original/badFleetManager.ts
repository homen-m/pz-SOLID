// Порушення ISP: Інтерфейс вимагає реалізації методів, які суперечать фізичним можливостям машин
export interface IVehicleTasks {
    startDelivery(destination: string): void;
    refuelDiesel(): void;
    chargeBattery(): void;
}

// Порушення DIP: Клас жорстко залежить від конкретних інструментів БД та сповіщень
class MongoDbDatabase {
    insertLog(data: any) { console.log("Saved log to MongoDB:", data); }
}

class SlackBot {
    sendMessage(msg: string) { console.log(`Slack Msg: ${msg}`); }
}

// Порушення SRP: Клас міксує бізнес-логіку автопарку з логікою БД та повідомлень
export class BadFleetManager implements IVehicleTasks {
    private db = new MongoDbDatabase();
    private slack = new SlackBot();

    public dispatchVehicle(vehicleType: string, destination: string, cargoWeight: number) {
        // Порушення OCP: Додавання дронів-доставщиків вимагатиме зміни цього методу
        if (vehicleType === "diesel_truck") {
            console.log(`Dispatching heavy truck to ${destination} with ${cargoWeight}kg.`);
        } else if (vehicleType === "electric_van") {
            if (cargoWeight > 1000) throw new Error("Van cannot carry this much!");
            console.log(`Dispatching eco-van to ${destination}.`);
        } else {
            throw new Error("Unknown vehicle type");
        }

        this.db.insertLog({ type: vehicleType, dest: destination, date: new Date() });
        this.slack.sendMessage(`Dispatched ${vehicleType} to ${destination}`);
    }

    public startDelivery(dest: string): void { console.log(`Driving to ${dest}`); }
    public refuelDiesel(): void { console.log("Adding 100L of diesel..."); }
    public chargeBattery(): void { console.log("Connecting to supercharger..."); }
}

// Порушення LSP: Нащадок ламає логіку. Електрофургон не може заправлятися дизелем, і викидає виняток.
export class ElectricVan extends BadFleetManager {
    public refuelDiesel(): void {
        throw new Error("Fatal: Cannot pour diesel into an electric battery!");
    }
}