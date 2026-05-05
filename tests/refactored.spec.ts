import { FleetDispatcher, DieselTruck, ElectricVan } from '../src/refactored/fleetSystem';
import { IFleetRepository, IDispatchNotifier } from '../src/interfaces';

describe('FleetDispatcher (SOLID)', () => {
    let mockRepo: IFleetRepository;
    let mockNotifier: IDispatchNotifier;
    let dispatcher: FleetDispatcher;

    beforeEach(() => {
        // DIP: Ін'єкція моків для ізольованого тестування
        mockRepo = { saveDispatchRecord: jest.fn() };
        mockNotifier = { notifyDispatch: jest.fn() };
        dispatcher = new FleetDispatcher(mockRepo, mockNotifier);
    });

    it('should successfully dispatch a Diesel Truck if payload is valid', () => {
        const truck = new DieselTruck('TRK-01', 'Volvo FH16', 20000);

        dispatcher.dispatch(truck, 'Kyiv', 15000);

        expect(mockRepo.saveDispatchRecord).toHaveBeenCalledWith({
            vehicleId: 'TRK-01',
            dest: 'Kyiv',
            weight: 15000
        });
        expect(mockNotifier.notifyDispatch).toHaveBeenCalledWith(expect.stringContaining('Volvo FH16'));
    });

    it('should correctly process an Electric Van without breaking LSP', () => {
        const van = new ElectricVan('EV-99', 'Nissan e-NV200', 800);

        // Поліморфний виклик, який безпечно працює для електромобіля
        dispatcher.dispatch(van, 'Lviv', 500);

        expect(mockNotifier.notifyDispatch).toHaveBeenCalledWith(expect.stringContaining('silently driving to Lviv'));
    });

    it('should throw an error if the vehicle is overloaded', () => {
        const van = new ElectricVan('EV-88', 'Renault Kangoo Z.E.', 600);

        expect(() => dispatcher.dispatch(van, 'Odesa', 1000)).toThrow('Overload');
    });

    it('should allow fueling/charging specific to the vehicle type (ISP)', () => {
        const truck = new DieselTruck('TRK-02', 'Scania', 20000);
        const van = new ElectricVan('EV-02', 'Tesla Semi', 15000);

        expect(truck.refuelDiesel(100)).toBe('Filled 100L of diesel into Scania.');
        expect(van.chargeBattery(50)).toBe('Charged Tesla Semi with 50 kWh.');

        // TypeScript не дозволить викликати van.refuelDiesel() завдяки інтерфейсам ISP
    });
});