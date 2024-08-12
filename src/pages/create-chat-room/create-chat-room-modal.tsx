import { X } from "lucide-react"
import React, { FormEvent } from "react"
import { Button } from "../../components/button"

interface CreateChatRoomModalProps {
    closeCreateChatRoomModal: () => void
    createChatRoom: (e: FormEvent<HTMLFormElement>) => void
    setChatRoomName: (chatRoomName: string) => void
    setUsername: (username: string) => void
}

export function CreateChatRoomModal({ 
    closeCreateChatRoomModal, 
    createChatRoom, 
    setChatRoomName,
    setUsername
} : CreateChatRoomModalProps) {

    return (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
            <div className='w-[640px] max-w-[640px] rounded-xl py-5 px-6 shadow-shape bg-white space-y-5'>
                <div className='space-y-2'>
                    <div className='flex itemc-center justify-between'>
                        <h2 className='text-lg font-semibold'>Create chat room</h2>
                        <button onClick={closeCreateChatRoomModal}>
                            <X />
                        </button>
                    </div>
                </div>

                <form 
                    onSubmit={createChatRoom}
                    className='space-y-3'
                >
                    <div className='h-14 px-4 slate-zinc-400 border border-zinc-900 flex items-center gap-2 rounded-lg'>
                        <label htmlFor="">Chat Room Name:</label>
                        <input 
                            onChange={event => setChatRoomName(event.target.value)}
                            type="text" 
                            name='name'
                            placeholder="Enter the name of room" 
                            className="border-none p-2 flex-1 focus:outline-none focus:border-0" 
                        />
                    </div>

                    <div className='h-14 px-4 slate-zinc-400 border border-zinc-900 flex items-center gap-2 rounded-lg'>
                        <label htmlFor="">Username:</label>
                        <input 
                            onChange={event => setUsername(event.target.value)}
                            type="text" 
                            name='name'
                            placeholder="Enter the username" 
                            className="border-none p-2 flex-1 focus:outline-none focus:border-0" 
                        />
                    </div>

                    <div className='flex justify-end'>
                        <Button 
                            type='submit' 
                        >
                            Create chat room
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}