import { Server as ServerSocket } from 'socket.io';
import userHandler from '../modules/users/user.handler';

export default function socketRoutes(socketServer: ServerSocket) {
  userHandler(socketServer);
}
