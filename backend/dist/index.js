"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let userConnected = 0;
let allSocket = [];
wss.on("connection", function (socket) {
    socket.on("message", (message) => {
        var _a;
        //@ts-ignore
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allSocket.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            const currentUserRoom = (_a = allSocket.find((x) => x.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            for (let i = 0; i < allSocket.length; i++) {
                if (allSocket[i].room == currentUserRoom) {
                    allSocket[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
    socket.on("disconnect", () => {
    });
});
