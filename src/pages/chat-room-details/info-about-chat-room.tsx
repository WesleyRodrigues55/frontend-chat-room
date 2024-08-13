import React, { useEffect, useState } from "react"
import { socket } from "../../lib/socket";
import { api } from "../../lib/axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface RoomProps {
    roomId: string | undefined
    userId: string | undefined
}

interface Room {
    name: string
    created_at: string
    users: {
        id: string
        name: string
    }[] | null
}

export function InfoAboutChatRoom({
    roomId,
    userId
} : RoomProps) {
    const navigate = useNavigate()

    const [room, setRoom] = useState<Room | null>(null)
    const [getUsername, setGetUsername] = useState('')
    const [getUserId, setGetUserId] = useState('')

    const deleteRoom = async () => {
        await api.delete(`/room/${roomId}`)
            .then(response => {
                console.log("Deleted room!")
            })
            .catch(err => {
                console.log('Error: ', err)
            })       
    }

    function handleClickLogout() {
        api.put(`/user/${userId}`)
            .then(response => {
                if (room?.users?.length == 1 || null) {
                    deleteRoom()
                }
                navigate('/')
            })
            .catch(err => {
                console.log("Error, ", err)
            })
    }

    useEffect(() => {

        socket.on('update-user', (updatedUser) => {
            setRoom(prevRoom => {
                if (prevRoom) {
                    return {
                        ...prevRoom,
                        users: prevRoom.users?.filter(user => user.id !== updatedUser.id && updatedUser.active) || []
                    };
                }
                return prevRoom;
            });
        });

        socket.on('create-user', (newUsers) => {
            setRoom(prevRoom => {
                if (prevRoom) {
                    return {
                        ...prevRoom,
                        users: [...(prevRoom.users || []), newUsers]
                    };
                }
                return prevRoom;
            });
        });

        api.get(`/user/${userId}`)
            .then(response => {
                const { user } = response.data
                setGetUserId(user.id)
                setGetUsername(user.name)
            })
            .catch(err => {
                console.log("Error, ", err)
                return navigate(`/chat-room/${roomId}/create-username`)
            })

        api.get(`/room/${roomId}`)
            .then(response => {
                const { room } = response.data
                setRoom(room)
            })
            .catch(err => {
                console.log("Error, ", err)
                return navigate(`/`)
            })

        return () => {
            socket.off('update-user'); 
            socket.off('create-user'); 
        };

    }, [])

    return (
        <div className="flex flex-col h-full mt-10 md:mt-auto">
            {room && (
                <div className="space-y-8 flex flex-1 flex-col h-full">
                    <div>
                        {getUsername && (
                            <div className="flex gap-4 justify-between">
                                <div className="bg-blue-700 p-2 rounded-lg w-full text-center">
                                    <p>Welcome, {getUsername}!</p>
                                </div>
                                
                                <div className="w-px h-auto bg-zinc-100/20"></div>
                                <button 
                                    onClick={handleClickLogout}
                                    type="button" 
                                    className="hover:underline"
                                >
                                    Logout
                                </button> 
                            </div>                           
                        )}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold truncate" title={room.name}>{room.name}</h1>
                        <p className="text-xs">{format(room.created_at, 'PPPP')}</p>
                    </div>

                    <div className="h-full flex flex-col">
                        <div className="text-xl font-bold">Users Online: {room?.users?.length}</div>

                        <div className="space-y-4 mt-4 overflow-y-auto">
                            {room.users?.map((user) => {
                                return (
                                    <div key={user.id} className="space-y-4">
                                        <div className="flex gap-2 items-center">
                                            <div className="w-[48px] h-[48px] border border-zinc-800 rounded-full bg-zinc-200"></div>
                                            <div>
                                                <div>{user.name}</div>
                                                <div className="flex gap-2 items-center">
                                                    <div className="w-3 h-3 bg-green-600 rounded-full"></div> 
                                                    <span className="text-xs">Online</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-px w-full bg-zinc-100/20"></div>
                                    </div>
                                )
                            })}
                        </div>
                        
                    </div>
                    
                </div>
            )}
        </div>
    )
}