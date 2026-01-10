import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class LiveLocationGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('updateLocation')
    handleLocationUpdate(@MessageBody() data: { busId: string; lat: number; lng: number; speed: number }) {
        // Broadcast to all clients listening for this bus or route
        // For simplicity, broadcasting to everyone for now
        this.server.emit('busLocationUpdated', data);
        return data;
    }
}
