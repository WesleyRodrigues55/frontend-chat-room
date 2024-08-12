import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { CreateChatRoom } from "./pages/create-chat-room"
import { ChatRoomDetails } from "./pages/chat-room-details"

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateChatRoom />
  },
  {
    path: "/chat-room/:roomId/:userId?",
    element: <ChatRoomDetails />
  }
])

export function App() {

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

