import React, { FormEvent, useEffect, useState } from 'react'
import { api } from '../../lib/axios'
import { useNavigate } from 'react-router-dom';

import { CreateChatRoomModal } from './create-chat-room-modal';
import { Rooms } from './rooms';
import { Button } from '../../components/button';
import { socket } from '../../lib/socket';
import { CreateUserModal } from './create-user-modal';



export function CreateChatRoom() {
    const navigate = useNavigate()
    
    const [isCreateChatRoomModal, setIsCreateChatRoomModal] = useState(false)
    const [isCreateUsernameModal, setIsCreateUsernameModal] = useState(false)
    const [chatRoomName, setChatRoomName] = useState('')
    const [username,  setUsername] = useState('')
    const [roomId,  setRoomId] = useState('')


    function openCreateChatRoomModal() {
        setIsCreateChatRoomModal(true)
    }

    function closeCreateChatRoomModal() {
        setIsCreateChatRoomModal(false)
    }

    function openCreateUsernameModal() {
        setIsCreateUsernameModal(true)
    }

    function closeCreateUsernameModal() {
        setIsCreateUsernameModal(false)
    }

    async function createChatRoom(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!chatRoomName) {
            // add toast
            return
        }

        const now = new Date();

        await api.post(
            '/room',
            {
                name: chatRoomName,
                created_at: now,
                username: username, 
            }
        )
        .then(response => {
            const { roomId, userId } = response.data
            navigate(`/chat-room/${roomId}/${userId}`)
        })
        .catch(err => {
            console.log("Error: ", err)
        })  
    }

    async function createUsernameInChatRoom(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        await api.post(
            `/user/${roomId}`,
            {
                name: username,
                room_id: roomId
            }
        )
        .then(response => {
            closeCreateUsernameModal()
            navigate(`/chat-room/${roomId}/${response.data.user.id}`)
        })
        .catch(err => {
            console.log("Error: ", err)
        })   
    }

    return (
        <div className='container mx-auto p-5 h-screen'>
            <Button 
                type='button' 
                onClick={openCreateChatRoomModal}
            >
                Create Chat Room
            </Button>

            <Rooms
                openCreateUsernameModal={openCreateUsernameModal}
                closeCreateUsernameModal={closeCreateUsernameModal}
                setRoomId={setRoomId}
            />

            {isCreateChatRoomModal && (
                <CreateChatRoomModal 
                    closeCreateChatRoomModal={closeCreateChatRoomModal}
                    createChatRoom={createChatRoom}
                    setChatRoomName={setChatRoomName}
                    setUsername={setUsername}
                />
            )}

            {isCreateUsernameModal && (
                <CreateUserModal 
                    createUsernameInChatRoom={createUsernameInChatRoom}
                    setUsername={setUsername}
                    closeCreateUsernameModal={closeCreateUsernameModal}
                />
            )}

            
        </div>
    )
}