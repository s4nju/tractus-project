import useWebSocket, { ReadyState } from "react-use-websocket";

const WEB_SOCKET_URL = "ws://localhost:3000";

export const useAppSocket = (onMessage: (data: any) => void) => {
  const { readyState, ...socket } = useWebSocket(WEB_SOCKET_URL, {
    onOpen: () => {
      console.log("WebSocket connection established");
    },
    onClose: () => {
      console.log("WebSocket connection closed");
    },
    skipAssert: true, // to skip check for mock server
    onMessage,
  });

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return { ...socket, readyState, connectionStatus, WEB_SOCKET_URL };
};
