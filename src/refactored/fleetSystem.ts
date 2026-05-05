import { ICombustionVehicle, IElectricVehicle, ICargoCarrier, IFleetRepository, IDispatchNotifier } from '../interfaces';

// LSP: Базовий абстрактний клас транспортного засобу. Гарантує загальну поведінку для диспетчера.
export abstract class BaseVehicle implements ICargoCarrier {
    constructor(
        public id: string,
        public model: string,
        protected maxPayload: number
    ) {}

    // Кожен нащадок коректно реалізує логіку завантаження
    public loadCargo(weight: number): boolean {
        return weight <= this.maxPayload;
    }

    abstract startRoute(destination: string): string;
}

// OCP & ISP: Кожен клас імплементує лише ті специфічні інтерфейси, які відповідають його типу
export class DieselTruck extends BaseVehicle implements ICombustionVehicle {
    startRoute(destination: string): string {
        return `Diesel Truck [${this.model}] is heading to ${destination}.`;
    }

    refuelDiesel(liters: number): string {
        return `Filled ${liters}L of diesel into ${this.model}.`;
    }
}

export class ElectricVan extends BaseVehicle implements IElectricVehicle {
    startRoute(destination: string): string {
        return `Electric Van [${this.model}] silently driving to ${destination}.`;
    }

    chargeBattery(kwh: number): string {
        return `Charged ${this.model} with ${kwh} kWh.`;
    }
}

// SRP: Цей клас відповідає лише за бізнес-процес випуску машини на рейс
// DIP: Клас залежить виключно від абстракцій (IFleetRepository, IDispatchNotifier)
export class FleetDispatcher {
    constructor(
        private repo: IFleetRepository,
        private notifier: IDispatchNotifier
    ) {}

    public dispatch(vehicle: BaseVehicle, destination: string, cargoWeight: number): void {
        if (!vehicle.loadCargo(cargoWeight)) {
            throw new Error(`Vehicle ${vehicle.model} cannot carry ${cargoWeight}kg! Overload.`);
        }

        const routeStatus = vehicle.startRoute(destination);

        this.repo.saveDispatchRecord({
            vehicleId: vehicle.id,
            dest: destination,
            weight: cargoWeight
        });

        this.notifier.notifyDispatch(`Success: ${routeStatus}`);
    }
}