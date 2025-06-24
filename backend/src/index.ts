import { WebSocketServer,WebSocket } from "ws";

const wss = new WebSocketServer({port:8080});
interface User{
socket:WebSocket,
room:String
}
let userConnected = 0;
let allSocket:User[]=[];

wss.on("connection",function(socket){


socket.on("message",(message)=>{
//@ts-ignore
const parsedMessage = JSON.parse(message);
if(parsedMessage.type==="join"){
allSocket.push({
socket,
room:parsedMessage.payload.roomId
})
}
if(parsedMessage.type==="chat"){
const currentUserRoom = allSocket.find((x)=>x.socket==socket)?.room;
for(let i=0;i<allSocket.length;i++){
if(allSocket[i].room==currentUserRoom){
allSocket[i].socket.send(parsedMessage.payload.message);
}
}
}
})
socket.on("disconnect",()=>{

})
})