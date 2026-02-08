import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Route, RouteDocument } from '../schemas/route.schema';
import { CreateRouteDto } from './dto/create-route.dto';

@Injectable()
export class RoutesService {
    constructor(@InjectModel(Route.name) private routeModel: Model<RouteDocument>) { }

    create(createRouteDto: CreateRouteDto) {
        const newRoute = new this.routeModel(createRouteDto);
        return newRoute.save();
    }

    async findAll(startCity?: string, endCity?: string) {
        const query: any = {};

        if (startCity && endCity) {
            // Flexible search: Matches if start/end are main cities OR if they appear in stops
            query['$or'] = [
                // Case 1: Direct match on Start/End fields
                {
                    startCity: { $regex: new RegExp(startCity, 'i') },
                    endCity: { $regex: new RegExp(endCity, 'i') },
                },
                // Case 2: Both cities are in the stops array
                {
                    $and: [
                        { stops: new RegExp(startCity, 'i') },
                        { stops: new RegExp(endCity, 'i') }
                    ]
                }
            ];
        } else if (startCity) {
            query['$or'] = [
                { startCity: { $regex: new RegExp(startCity, 'i') } },
                { stops: new RegExp(startCity, 'i') }
            ];
        } else if (endCity) {
            query['$or'] = [
                { endCity: { $regex: new RegExp(endCity, 'i') } },
                { stops: new RegExp(endCity, 'i') }
            ];
        }

        const routes = await this.routeModel.find(query)
            .populate({
                path: 'schedules',
                populate: { path: 'bus' }
            })
            .sort({ createdAt: -1 })
            .exec();

        // If performing a specific A -> B search, ensure direction is valid (A comes before B)
        if (startCity && endCity) {
            return routes.filter(route => {
                // If main start/end match, it's valid
                const startRegex = new RegExp(startCity, 'i');
                const endRegex = new RegExp(endCity, 'i');

                if (startRegex.test(route.startCity) && endRegex.test(route.endCity)) return true;

                // Check stops order
                const startIndex = route.stops.findIndex(s => startRegex.test(s));
                const endIndex = route.stops.findIndex(s => endRegex.test(s));

                if (startIndex !== -1 && endIndex !== -1) {
                    return startIndex < endIndex;
                }

                // Fallback: If one is main start/end and other is in stops
                if (startRegex.test(route.startCity) && endIndex !== -1) return true; // Start is Origin, End is Stop
                if (startIndex !== -1 && endRegex.test(route.endCity)) return true; // Start is Stop, End is Dest

                return false;
            });
        }

        return routes;
    }

    findOne(id: string) {
        return this.routeModel.findById(id)
            .populate({
                path: 'schedules',
                populate: { path: 'bus' }
            })
            .exec();
    }
}
