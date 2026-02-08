import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, Role } from '../schemas/user.schema';
import { Bus, BusDocument, BusStatus } from '../schemas/bus.schema';
import { Route, RouteDocument } from '../schemas/route.schema';
import { Schedule, ScheduleDocument } from '../schemas/schedule.schema';

@Injectable()
export class SeedService {
    private readonly logger = new Logger(SeedService.name);

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Bus.name) private busModel: Model<BusDocument>,
        @InjectModel(Route.name) private routeModel: Model<RouteDocument>,
        @InjectModel(Schedule.name) private scheduleModel: Model<ScheduleDocument>,
    ) { }

    async seed() {
        this.logger.log('Starting seeding...');

        // 1. Create Operator
        const operatorEmail = 'operator@bus.com';
        let operator = await this.userModel.findOne({ email: operatorEmail });
        if (!operator) {
            const hashedPassword = await bcrypt.hash('password', 10);
            operator = await this.userModel.create({
                email: operatorEmail,
                password: hashedPassword,
                name: 'Bus Operator',
                role: Role.OPERATOR,
                phoneNumber: '+94770000000',
            });
            this.logger.log('Created Operator: ' + operatorEmail);
        } else {
            this.logger.log('Operator already exists');
        }

        // 2. Create Buses
        const busesData = [
            { number: 'ND-1234', capacity: 45, operatorId: operator._id },
            { number: 'NA-5678', capacity: 30, operatorId: operator._id },
        ];

        const buses = [];
        for (const busData of busesData) {
            let bus = await this.busModel.findOne({ number: busData.number });
            if (!bus) {
                bus = await this.busModel.create(busData);
                this.logger.log('Created Bus: ' + busData.number);
            }
            buses.push(bus);
        }

        // 3. Create Routes
        const routesData = [
            // 001 Mahanuwara <-> Colombo
            { routeNumber: '001', startCity: 'Colombo', endCity: 'Kandy', routePath: 'Colombo - Kandy', distance: 115, price: 500, stops: ['Colombo', 'Peliyagoda', 'Warakapola', 'Kegalle', 'Mawanella', 'Kandy'] },
            { routeNumber: '001-R', startCity: 'Kandy', endCity: 'Colombo', routePath: 'Kandy - Colombo', distance: 115, price: 500, stops: ['Kandy', 'Mawanella', 'Kegalle', 'Warakapola', 'Peliyagoda', 'Colombo'] },

            // 001/2 Warakapola <-> Colombo
            { routeNumber: '001/2', startCity: 'Colombo', endCity: 'Warakapola', routePath: 'Colombo - Warakapola', distance: 60, price: 300, stops: ['Colombo', 'Peliyagoda', 'Nittambuwa', 'Warakapola'] },
            { routeNumber: '001/2-R', startCity: 'Warakapola', endCity: 'Colombo', routePath: 'Warakapola - Colombo', distance: 60, price: 300, stops: ['Warakapola', 'Nittambuwa', 'Peliyagoda', 'Colombo'] },

            // 002 Colombo <-> Matara (Highway)
            { routeNumber: '002', startCity: 'Colombo', endCity: 'Matara', routePath: 'Colombo - Matara (Highway)', distance: 160, price: 900, stops: ['Colombo', 'Makumbura', 'Galle', 'Matara'] },
            { routeNumber: '002-R', startCity: 'Matara', endCity: 'Colombo', routePath: 'Matara - Colombo (Highway)', distance: 160, price: 900, stops: ['Matara', 'Galle', 'Makumbura', 'Colombo'] },

            // 002-1 Colombo <-> Galle (Highway)
            { routeNumber: '002-1', startCity: 'Colombo', endCity: 'Galle', routePath: 'Colombo - Galle (Highway)', distance: 120, price: 750, stops: ['Colombo', 'Makumbura', 'Galle'] },
            { routeNumber: '002-1-R', startCity: 'Galle', endCity: 'Colombo', routePath: 'Galle - Colombo (Highway)', distance: 120, price: 750, stops: ['Galle', 'Makumbura', 'Colombo'] },

            // 003 Colombo <-> Embilipitiya
            { routeNumber: '003', startCity: 'Colombo', endCity: 'Embilipitiya', routePath: 'Colombo - Ratnapura - Embilipitiya', distance: 180, price: 1100, stops: ['Colombo', 'Avissawella', 'Ratnapura', 'Pelmadulla', 'Embilipitiya'] },
            { routeNumber: '003-R', startCity: 'Embilipitiya', endCity: 'Colombo', routePath: 'Embilipitiya - Ratnapura - Colombo', distance: 180, price: 1100, stops: ['Embilipitiya', 'Pelmadulla', 'Ratnapura', 'Avissawella', 'Colombo'] },

            // 049 Trincomalee <-> Colombo
            { routeNumber: '049', startCity: 'Colombo', endCity: 'Trincomalee', routePath: 'Colombo - Kurunegala - Dambulla - Trincomalee', distance: 265, price: 1500, stops: ['Colombo', 'Kurunegala', 'Dambulla', 'Habarana', 'Trincomalee'] },
            { routeNumber: '049-R', startCity: 'Trincomalee', endCity: 'Colombo', routePath: 'Trincomalee - Colombo', distance: 265, price: 1500, stops: ['Trincomalee', 'Habarana', 'Dambulla', 'Kurunegala', 'Colombo'] },

            // 015 Jaffna <-> Colombo
            { routeNumber: '015', startCity: 'Colombo', endCity: 'Jaffna', routePath: 'Colombo - Anuradhapura - Jaffna', distance: 395, price: 2200, stops: ['Colombo', 'Puttalam', 'Anuradhapura', 'Vavuniya', 'Kilinochchi', 'Jaffna'] },
            { routeNumber: '015-R', startCity: 'Jaffna', endCity: 'Colombo', routePath: 'Jaffna - Colombo', distance: 395, price: 2200, stops: ['Jaffna', 'Kilinochchi', 'Vavuniya', 'Anuradhapura', 'Puttalam', 'Colombo'] },
        ];

        const routes = [];
        for (const routeData of routesData) {
            let route = await this.routeModel.findOne({ routeNumber: routeData.routeNumber });
            if (!route) {
                route = await this.routeModel.create(routeData);
                this.logger.log('Created Route: ' + routeData.routeNumber);
            }
            routes.push(route);
        }

        // 4. Create Schedules
        await this.scheduleModel.deleteMany({}); // Clear old schedules

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const setTime = (date: Date, hours: number, minutes: number) => {
            const d = new Date(date);
            d.setHours(hours, minutes, 0, 0);
            return d;
        };

        const schedulesData = [];

        // Generate schedules for EVERY route (Today & Tomorrow)
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            const bus = buses[i % buses.length]; // Round-robin buses

            // Morning Trip Today
            schedulesData.push({
                busId: bus._id,
                routeId: route._id,
                departureTime: setTime(today, 6 + (i % 4), 0), // Staggered start times (6,7,8,9 AM)
                arrivalTime: setTime(today, 10 + (i % 4), 30),
            });

            // Evening Trip Today
            schedulesData.push({
                busId: bus._id,
                routeId: route._id,
                departureTime: setTime(today, 16 + (i % 4), 0), // Staggered (4,5,6,7 PM)
                arrivalTime: setTime(today, 20 + (i % 4), 30),
            });

            // Morning Trip Tomorrow
            schedulesData.push({
                busId: bus._id,
                routeId: route._id,
                departureTime: setTime(tomorrow, 6 + (i % 4), 0),
                arrivalTime: setTime(tomorrow, 10 + (i % 4), 30),
            });
        }

        for (const scheduleData of schedulesData) {
            await this.scheduleModel.create(scheduleData);
        }
        this.logger.log(`Created ${schedulesData.length} schedules`);

        return {
            message: 'Seeding completed successfully',
            busCount: buses.length,
            routeCount: routes.length,
            scheduleCount: schedulesData.length
        };
    }
}
