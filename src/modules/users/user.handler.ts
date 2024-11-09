import { omit } from 'ramda';
import { PUBLIC_USER_DATA_TO_OMIT, PartialUser } from './user.interface';
import * as userService from './user.service';
import { type Socket, Namespace, type Server as ServerSocket } from 'socket.io';
import { socketAuthenticate } from '../../server/socketMiddlewares';

export default (socketServer: ServerSocket) => {
  const userNamespace = socketServer.of('/users');

  userNamespace.use(socketAuthenticate);

  userNamespace.on('connection', (socket: Socket) => {
    const userId: string = socket.data._id;
    socket.join(userId);
  });

  userNamespace.on('disconnect', (socket: Socket) => {
    const userId: string = socket.data._id;
    console.log('disconnection');
    // make user active
  });
};
