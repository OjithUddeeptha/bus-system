import { Module } from '@nestjs/common';
import { LiveLocationGateway } from './live-location.gateway';

@Module({
    providers: [LiveLocationGateway],
})
export class TrackingModule { }
