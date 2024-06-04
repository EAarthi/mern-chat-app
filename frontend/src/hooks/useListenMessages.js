import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from '../zustand/useConversation';
import notification from '../assets/sounds/notification.mp3';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const handleMessage = (newMessage) => {
      if (selectedConversation?._id === newMessage.senderId) {
        newMessage.shouldPop = true;
        const sound = new Audio(notification);
        sound.play();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    socket?.on("newMessage", handleMessage);

    return () => {
      socket?.off("newMessage", handleMessage);
    };
  }, [socket, setMessages, selectedConversation]);

  return null;
};

export default useListenMessages;
