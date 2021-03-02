import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import Parse from 'parse/react-native';

export const Chat = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let client = new Parse.LiveQueryClient({
      applicationId: "guZnL0LqTfS8g2p0WARXyLmZqNikgi2LBHmiYHlG",
      serverURL: "wss://" + "reactnativechatjs.b4a.io",
      javascriptKey: "f6zo0EDnoXziKGzNZrnc5yVDxxgokH0VmkZabzt4"
    });

    client.open();

    let query = new Parse.Query("Message");
    query.ascending("createdAt");
    query.limit(1);

    let subscription = client.subscribe(query);
    subscription.on("create", messageParse => {
      setMessages(previousMessages => GiftedChat.append(previousMessages, {
        _id: messageParse.id,
        text: messageParse.get("content"),
        createdAt: new Date(),
        user: {
          _id: "USER_ID",
          name: "Back4app",
          avatar:"https://pbs.twimg.com/profile_images/993896854961111040/dwM1HGjZ.jpg",
        }
      }))
    });
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    
    const Message = Parse.Object.extend("Message");
    const thisMessage = new Message();

    thisMessage.set("content", messages[0].text);
    thisMessage.save();
  }, [])

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
    />
  )
}