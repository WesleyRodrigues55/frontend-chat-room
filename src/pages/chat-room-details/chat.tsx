import React, { FormEvent, useEffect, useRef, useState } from "react"
import { api } from "../../lib/axios"
import { socket } from '../../lib/socket';
import { format } from "date-fns"
import { Button } from "../../components/button";

interface ChatProps {
    createNewMessage: (e: FormEvent<HTMLFormElement>) => void
    setMessage: (msg: string) => void
    message: string
    roomId: string | undefined
    userId: string | undefined
}

interface Chat {
    id: string
    message: string
    created_at: string
    user_id: string
    room_id: string
    user: {
        name: string
        active: boolean
    }
}

export function Chat({ 
    createNewMessage,
    setMessage,
    message,
    roomId, 
    userId 
} : ChatProps) {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
    const [messages, setMessages] = useState<Chat[]>([])

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        
        api.get(`/chat-room/${roomId}/messages`)
            .then(response => {
                setMessages(response.data.messages)
            })
            .catch(err => {
                console.log('Error: ', err)
            })
            
        return () => {
            socket.off('message'); 
        };

    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="h-full flex flex-col justify-end">
            <div className="flex flex-1 space-y-4 flex-col overflow-y-auto h-full px-4">
                {messages.map((message) => {
                    const isOwnMessage = userId === message.user_id;

                    return (
                        <div 
                            key={message.id} 
                            className={`flex ${userId == message.user_id ? 'justify-end' : ''}`}
                        >
                            {isOwnMessage ? (
                                <div className="border px-4 py-2 rounded-lg w-[480px] max-w-[480px] bg-white/75 shadow-sm mt-2">
                                    <p>{message.message}</p>
                                    <p className="text-end text-xs">{format(message.created_at, 'p')}</p>
                                </div>
                            ) : (
                                <div className="w-[480px] max-w-[480px] flex gap-2 items-start mt-2">
                                    <div className="w-[48px] h-[48px] border rounded-full bg-zinc-200"></div>
                                    <div className="border px-4 py-2 rounded-lg flex-1 bg-white/75 shadow-sm">
                                        <p className="text-sm font-bold">{message.user ? message.user.name : 'Unknown User'}</p>
                                        <p>{message.message}</p>
                                        <p className="text-end text-xs">{format(message.created_at, 'p')}</p>
                                    </div>
                                </div>
                            )}                            
                        </div> 
                    )
                })}
                <div ref={endOfMessagesRef} />
            </div>

            <div className="bg-zinc-900 p-4">
                <form className="flex rounded-lg overflow-hidden bg-white" onSubmit={createNewMessage}>
                    <input 
                        onChange={e => setMessage(e.target.value)}
                        value={message}
                        type="text" 
                        className="border-none p-2 flex-1 focus:outline-none focus:border-0" 
                        autoFocus
                    />                    
                    <Button 
                        type='submit' 
                    >
                        Send
                    </Button>
                </form>
            </div>          
        </div>
    )
}