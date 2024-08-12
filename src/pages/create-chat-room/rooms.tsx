import React, { useEffect, useState } from "react"
import { socket } from "../../lib/socket"
import { api } from "../../lib/axios"
import { format } from "date-fns"

interface Rooms {
    id: string
    name: string
    created_at: string
    users: {
        id: string
        name: string
    }[]
}

interface  RoomsProps {
    openCreateUsernameModal: () => void
    closeCreateUsernameModal: () => void
    setRoomId: (roomId: string) => void
}

export function Rooms({
    openCreateUsernameModal,
    setRoomId
} : RoomsProps) {
    const [rooms, setRooms] = useState<Rooms[]>([])
    const [countOnlineUsers, setCountOnlineUsers] = useState<any[]>([])

    useEffect(() => {
        socket.emit('join-index');

        const handleCreateRoom = (newRoom) => {
            setRooms((prevRooms) => [...prevRooms, newRoom]);
        }

        const handleNewUser = (newUser) => {
            setCountOnlineUsers((prevUsers) => [...prevUsers, newUser]);
        }

        const handleRemoveUser = (userToRemove) => {
            setCountOnlineUsers((prevUsers) => 
                prevUsers.filter(user => user.id !== userToRemove.id)
            );
        };

        const handleDeleteRoom = (deletedRoom: Rooms) => {
            setRooms((prevRooms) => 
                prevRooms.filter(room => room.id !== deletedRoom.id)
            );
        }

        socket.on('create-room', handleCreateRoom);
        socket.on('create-user', handleNewUser)
        socket.on('update-user', handleRemoveUser)
        socket.on('delete-room', handleDeleteRoom);

        api.get('/rooms')
            .then(response => {
                const { rooms } = response.data
                setRooms(rooms)
                rooms.map(room => setCountOnlineUsers(room.users))
            })
            .catch(err => 
                console.error('Error: ', err)
            )

        return () => {
            socket.off('create-room', handleCreateRoom) 
            socket.off('create-user', handleNewUser)
            socket.off('update-user', handleRemoveUser)
            socket.off('delete-room'); 
        };

    }, [])

    return (
        <div className='my-5'>
            <h1 className='text-3xl font-bold'>Rooms:</h1>

            <div className='flex gap-4 flex-wrap mt-4'>
                {rooms.length === 0 ? (
                    <p className="text-center">Rooms not found!</p>
                ) : (
                    rooms.map((room) => (
                        <div key={room.id} className="p-4 border hover:border-zinc-400 rounded-lg bg-zinc-200 shadow-sm w-80">
                            {/* <a href={`/create-username-chat-room/${room.id}`}> */}
                            <button 
                                type="button" 
                                className="w-full text-start" 
                                onClick={() => {openCreateUsernameModal(); setRoomId(room.id)}}
                            >
                                <div className='text-xl font-semibold truncate' title={room.name}>Enter the room: {room.name}</div>
                                <div className='text-xs'>Created in {format(room.created_at, 'PPPP')}</div>
                                <div className="flex gap-2 items-center justify-end mt-2">
                                    <div className="w-3 h-3 bg-green-600 rounded-full"></div> 
                                    <span className="text-xs">{countOnlineUsers.length} Online users</span>
                                </div>
                            </button>
                            {/* </a> */}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}