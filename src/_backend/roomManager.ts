import { app, io } from './global';
import { Message } from './message';
import { Room } from './room';

export class RoomManager {
    constructor(public roomModel: Room, public msgModel: Message) {

    }

    removeRoom (id: string) {
        this.roomModel.Model.findByIdAndDelete({ _id: id }, (err, res) => {
            if (err) console.log(err);
        });
        io.emit('roomRemoved', id);

        this.msgModel.Model.deleteMany({roomId: id}, (err) => {
            if (err) console.log(err);
        });
    }
}