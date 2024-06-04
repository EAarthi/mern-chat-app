import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from '../zustand/useConversation';
import notification from '../assets/sounds/notification.mp3';

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    console.log("Effect is running");
    console.log("Socket: ", socket);
    console.log("Selected Conversation: ", selectedConversation);

    const handleMessage = (newMessage) => {
      console.log("New message received: ", newMessage);
      if (selectedConversation?._id === newMessage.senderId) {
        console.log("Message is from the selected conversation");
        newMessage.shouldPop = true;
        const sound = new Audio(notification);
        sound.play();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        console.log("Message is not from the selected conversation");
      }
    };

    if (socket) {
      socket.on("newMessage", handleMessage);
    }

    return () => {
      if (socket) {
        socket.off("newMessage", handleMessage);
      }
    };
  }, [socket, setMessages, selectedConversation]);

  return null;
};

export default useListenMessages;
