import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const wsRef = useRef(null);

  useEffect(() => {
    if (!joined) return;

    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: { roomId }
      }));
    };

    ws.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };

    wsRef.current = ws;

    return () => ws.close();
  }, [joined, roomId]);

  const sendMessage = () => {
    if (input.trim() && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "chat",
        payload: { message: input }
      }));
      setInput("");
    }
  };

  const handleJoin = () => {
    if (roomId.trim()) {
      setJoined(true);
      setMessages(["👋 Joined room: " + roomId]);
    }
  };

  return (
    <div className='min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans p-4'>

      {/* Join Room */}
      {!joined && (
        <div className="bg-zinc-900/80 backdrop-blur-lg p-8 rounded-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] border border-zinc-700 w-full max-w-md transition-all transform hover:scale-[1.02] hover:shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-white text-center">
            Join a Chat Room
          </h1>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID..."
            className="w-full p-3 mb-6 rounded-lg bg-zinc-800 border border-zinc-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button
            onClick={handleJoin}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg active:scale-95 active:translate-y-[1px] ring-1 ring-indigo-400/30"
          >
            Join Room
          </button>
        </div>
      )}

      {/* Chat UI */}
      {joined && (
        <div className="flex flex-col h-[90vh] w-full max-w-2xl bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 shadow-2xl">
          {/* Header */}
          <div className="bg-zinc-800 p-4 text-center font-bold text-xl border-b border-zinc-700 shadow-sm">
            Room: {roomId}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-950 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{ transform: `rotate(${index % 2 === 0 ? 0.4 : -0.4}deg)` }}
                className={`rounded-lg p-3 max-w-[80%] transition transform duration-300 ease-in-out hover:scale-105 hover:shadow-2xl hover:ring-1 hover:ring-indigo-500/40 ${
                  index === 0
                    ? 'bg-indigo-900 text-indigo-100 shadow-lg'
                    : 'bg-zinc-800 text-white shadow-md'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className='w-full bg-zinc-900 p-4 flex gap-2 border-t border-zinc-800'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className='flex-1 p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all text-white placeholder-gray-400'
            />
            <button
              onClick={sendMessage}
              className='bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg active:scale-95 active:translate-y-[1px] ring-1 ring-indigo-400/30 flex items-center justify-center'
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
