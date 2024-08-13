import React, { FormEvent, useState } from "react"
import { useParams } from "react-router-dom"
import { Chat } from "./chat";
import { InfoAboutChatRoom } from "./info-about-chat-room";
import { api } from "../../lib/axios";
import { LogOut, Menu, X } from "lucide-react";

export function ChatRoomDetails() {
    const { roomId, userId } = useParams()

    const [message, setMessage] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    async function createNewMessage(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const now = new Date();
        
        await api.post(
            `/chat-room/${roomId}/${userId}/create-message`,
            {
                message,
                created_at: now
            }
        )
        .then(response => {
            setMessage('')
        })
        .catch(err => {
            console.log("Error: ", err)
        })
    }

    return (
        <div>
            <div className="p-3 bg-zinc-800 w-full fixed md:hidden flex justify-between text-white">
                <div>
                    <button onClick={toggleMenu}>
                        <Menu />
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 h-screen">
                <div
                    className={`${
                        isMenuOpen ? 'block fixed inset-0 z-50' : 'hidden md:block'
                    } col-span-1 md:col-span-2 lg:col-span-1 text-white p-4 overflow-y-auto bg-zinc-800`}
                    >
                    <InfoAboutChatRoom 
                        roomId={roomId} 
                        userId={userId}
                    />

                    {isMenuOpen && (
                        <button
                            onClick={toggleMenu}
                            className="md:hidden text-white absolute top-4 right-4"
                        >
                            <X />
                        </button>
                    )}
                </div>

                <div className="col-span-4 md:col-span-3 lg:col-span-3 bg-zinc-100/20 overflow-y-auto">
                    <Chat 
                        createNewMessage={createNewMessage}
                        setMessage={setMessage}
                        message={message}
                        roomId={roomId}
                        userId={userId}
                    />
                </div>
            </div>
        </div>
    )

    
}