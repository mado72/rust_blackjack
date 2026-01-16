import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const newSocket = new WebSocket(url);
        socketRef.current = newSocket;

        newSocket.onopen = () => {
            console.log('WebSocket connection established');
        };

        newSocket.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        newSocket.onerror = (event) => {
            setError(`WebSocket error: ${event}`);
        };

        newSocket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (socketRef.current) {
            socketRef.current.send(message);
        }
    };

    return { socket, messages, error, sendMessage };
};

export default useWebSocket;