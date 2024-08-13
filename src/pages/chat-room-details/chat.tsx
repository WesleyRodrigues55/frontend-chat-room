import React, { FormEvent, useEffect, useRef, useState } from "react"
import { api } from "../../lib/axios"
import { socket } from '../../lib/socket';
import { format } from "date-fns"
import { Button } from "../../components/button";
import { Heart, LoaderCircle } from "lucide-react";

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
    user_id: string | null
    room_id: string | null
    react: number
    user: {
        name: string
        active: boolean
    },
    reaction: {
        id: string
        react: boolean
        chat_room_id: string
        user_id: string
    }[]
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
    const [loading, setLoading] = useState(true);
    const [countLikes, setCountLikes] = useState(0)

    const scrollToBottom = () => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    async function handleLike(chatRoomId: string) {
        api.put(`/chat-room/${chatRoomId}/${userId}/${roomId}/react-message`)
            .then(response => {
                console.log('Like')
            })
            .catch(err => {
                console.log('Error: ', err)
            })
    }

    function linkify(text: string): React.ReactNode {
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        const parts = text.split(urlPattern);
    
        return parts.map((part, index) => 
            urlPattern.test(part) ? (
                <a key={index} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {part}
                </a>
            ) : (
                <React.Fragment key={index}>{part}</React.Fragment>
            )
        );
    }

    useEffect(() => {
        const handleNewLike = (updatedReact) => {
            setMessages((prevMessages) => 
                prevMessages.map((message) => {
                    if (message.id === updatedReact.chat_room_id) {
                        // Garantir que `message.reaction` é um array
                        const reactions = message.reaction || [];
        
                        const existingReactionIndex = reactions.findIndex(
                            (reaction) => reaction.user_id === updatedReact.user_id
                        );
        
                        if (existingReactionIndex >= 0) {
                            // Remove a reação existente
                            const updatedReactions = [...reactions];
                            updatedReactions.splice(existingReactionIndex, 1);
        
                            return { ...message, react: updatedReact.react, reaction: updatedReactions };
                        } else {
                            // Adiciona a nova reação
                            return { 
                                ...message, 
                                react: updatedReact.react, 
                                reaction: [...reactions, updatedReact] 
                            };
                        }
                    }
                    return message;
                })
            );
        };
        

        socket.on('reaction', handleNewLike)

        return () => {
            socket.off('reaction', handleNewLike)
        }

    }, [])

    useEffect(() => {

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        
        api.get(`/chat-room/${roomId}/messages`)
            .then(response => {
                const { messages } = response.data
                setMessages(messages)
                setLoading(false)
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
        <>
            {loading ? (
            <div className="flex items-center justify-center h-full">
                <LoaderCircle className="animate-spin size-10" />
            </div>
        ) : (
            <div className="h-full flex flex-col justify-end pt-14">
                <div className="flex flex-1 space-y-4 flex-col overflow-y-auto h-full px-4">
                    {messages.map((message) => {
                        const isOwnMessage = userId === message.user_id;
                        const hasReaction = message.reaction && message.reaction.length > 0 ? message.reaction.length : null
                        
                        return (
                            <div key={message.id} >
                                <div className={`flex ${userId == message.user_id ? 'justify-end' : ''}`}>
                                    {isOwnMessage ? (
                                        <div className="border px-4 py-2 rounded-lg w-[480px] max-w-[480px] bg-white/75 shadow-sm mt-2 break-words break-all">
                                            <p>{linkify(message.message)}</p>
                                            <div className="flex justify-between gap-2 items-center text-xs mt-2">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => handleLike(message.id)}>
                                                        <Heart className="size-4"/>
                                                    </button>
                                                    <span>{hasReaction}</span>
                                                </div>
                                                {format(message.created_at, 'p')}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-[480px] max-w-[480px] flex gap-2 items-start mt-2 break-words break-all">
                                            <div className="w-[48px] h-[48px] border rounded-full bg-zinc-200"></div>
                                            <div className="border px-4 py-2 rounded-lg flex-1 bg-white/75 shadow-sm">
                                                <p className="text-sm font-bold">{message.user ? message.user.name : 'Unknown User'}</p>
                                                <p>{linkify(message.message)}</p>
                                                <div className="flex justify-between gap-2 items-center text-xs mt-2">
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => handleLike(message.id)}>
                                                            <Heart className="size-4"/>
                                                        </button>
                                                        <span>{hasReaction}</span>
                                                    </div>
                                                    {format(message.created_at, 'p')}
                                                </div>
                                            </div>
                                        </div>
                                    )}                    
                                </div> 
                            </div>
                        )
                    })}
                    <div ref={endOfMessagesRef} />
                </div>

                <div className="bg-zinc-900 p-4">
                    <form className="flex rounded-lg overflow-hidden bg-white" onSubmit={createNewMessage}>
                        <textarea 
                            onChange={e => setMessage(e.target.value)}
                            value={message}
                            className="border-none p-2 flex-1 focus:outline-none focus:border-0" 
                            rows={1}
                            cols={1}
                            autoFocus
                        ></textarea>                 
                        <Button 
                            type='submit' 
                        >
                            Send
                        </Button>
                    </form>
                </div>          
            </div>
        )}
        </>
        
    )
}