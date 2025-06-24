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
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white flex flex-col items-center justify-center font-sans p-4'>

      {/* Room ID Input (before joining) */}
      {!joined && (
        <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            Join a Chat Room
          </h1>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID..."
            className="w-full p-3 mb-6 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button
            onClick={handleJoin}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
          >
            Join Room
          </button>
        </div>
      )}

      {/* Chat UI (after joining) */}
      {joined && (
        <div className="flex flex-col h-[90vh] w-full max-w-2xl bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-800 to-pink-700 p-4 text-center font-bold text-xl shadow-md flex justify-between items-center">
            <span className="text-white/90">Room: {roomId}</span>
            <span className="text-white/70 text-sm">💬 Live chat</span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-900/30 space-y-3">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`rounded-lg p-3 max-w-[80%] shadow-md ${index === 0 ? 'bg-purple-900/50 text-purple-100' : 'bg-gray-700/80 text-white'}`}
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className='w-full bg-gray-800/50 p-4 flex gap-2 border-t border-gray-700'>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              className='flex-1 p-3 rounded-lg bg-gray-700/50 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 outline-none transition-all text-white placeholder-gray-400'
            />
            <button
              onClick={sendMessage}
              className='bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow hover:shadow-purple-500/20 flex items-center justify-center'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;