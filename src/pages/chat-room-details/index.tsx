import React, { FormEvent, useState } from "react"
import { useParams } from "react-router-dom"
import { Chat } from "./chat";
import { InfoAboutChatRoom } from "./info-about-chat-room";
import { api } from "../../lib/axios";

export function ChatRoomDetails() {
    const { roomId, userId } = useParams()

    const [message, setMessage] = useState('')

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
            {/* <div className="p-3 bg-zinc-800 w-full sm:fixed md:hidden">
                <h1>aaaa</h1>
            </div> */}
            <div className="grid grid-cols-4 h-screen">
                <div className="hidden md:block col-span-1 bg-zinc-800 text-white p-4 overflow-y-auto">
                    <InfoAboutChatRoom 
                        roomId={roomId}
                        userId={userId}
                    />
                </div>

                <div className="col-span-4 md:col-span-3 bg-zinc-100/20 overflow-y-auto">
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