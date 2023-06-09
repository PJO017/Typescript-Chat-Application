import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

type WebSocketOrNull = WebSocket | null;

const App = () => {
  const navigate = useNavigate();

  const [webSocket, setWebsocket] = useState<WebSocketOrNull>(null);
  const [userName, setUsername] = useState<string>("");
  // const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000");
    setWebsocket(socket);
    socket.onopen = () => {
      console.log("opened ws connection");
    };
  }, []);

  const handleInputChange = (event: any) => {
    setUsername(event.target.value);
  };

  const connect = (name: string) => {
    webSocket!.send(
      JSON.stringify({
        event: "createUser",
        userName: name,
      })
    );
    // setConnected(true);
    navigate("/rooms");
  };
  return (
    <>
      <div>
        <h1>Enter Name:</h1>
        <input className="nameInput" onChange={handleInputChange} />
        <button className="submitName" onClick={() => connect(userName)}>
          Connect
        </button>
      </div>
    </>
  );
};

export default App;
