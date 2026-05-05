// ISP: Розділені інтерфейси для різних типів двигунів та транспорту
export interface ICombustionVehicle {
    refuelDiesel(liters: number): string;
}

export interface IElectricVehicle {
    chargeBattery(kwh: number): string;
}

export interface ICargoCarrier {
    loadCargo(weight: number): boolean;
}

// DIP: Абстракції для інфраструктурних залежностей
export interface IFleetRepository {
    saveDispatchRecord(record: any): void;
}

export interface IDispatchNotifier {
    notifyDispatch(message: string): void;
}

// OCP: Абстракція для розрахунку можливості поїздки
export interface IRouteValidator {
    canReachDestination(distance: number): boolean;
}