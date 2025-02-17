"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-toastify"
import { PlusCircle, LogIn, Loader2, Search, Users, Clock, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface Room {
  id: number
  slug: string
  last?: string
  participants?: number
}

export default function RoomManager() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState("")
  const [joinRoomId, setJoinRoomId] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:3001/rooms", {
        headers: { Authorization: `${token}` },
      })
      // Adding mock data for demonstration
      const enhancedRooms = response.data.rooms.map((room: Room) => ({
        ...room,
        last: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        participants: Math.floor(Math.random() * 10) + 1
      }))
      setRooms(enhancedRooms)
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast.error("Failed to fetch rooms")
    } finally {
      setIsLoading(false)
    }
  }

  const createRoom = async () => {
    if (newRoomName) {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await axios.post(
          "http://localhost:3001/room",
          { name: newRoomName },
          {
            headers: { Authorization: `${token}` },
          }
        )
        toast.success("Room created successfully")
        router.push(`/canvas/${response.data.roomId}`)
      } catch (error) {
        console.error("Error creating room:", error)
        toast.error("Failed to create room")
      } finally {
        setIsLoading(false)
        setShowCreateDialog(false)
      }
    }
  }

  const joinRoom = async () => {
    if (joinRoomId) {
      setIsLoading(true)
      try {
        router.push(`/canvas/${joinRoomId}`)
        toast.success("Joined the room successfully")
      } catch (error) {
        console.error("Error joining room:", error)
        toast.error("Failed to join room")
      } finally {
        setIsLoading(false)
        setShowJoinDialog(false)
      }
    }
  }

  const filteredRooms = rooms.filter(room => 
    room.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.id.toString().includes(searchQuery)
  )

  const formatLast = (dateString: string) => {
    const date = new Date(dateString)
    const diffInDays = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  
    // Cap the difference at 7 days
    const days = Math.min(diffInDays, 7)
  
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(days, 'day')
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 dark:text-indigo-200">
            Your Rooms
          </h1>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setShowJoinDialog(true)}
                className="flex-1 sm:flex-none"
              >
                <LogIn className="mr-2 h-4 w-4" /> Join Room
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="flex-1 sm:flex-none"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Room
              </Button>
            </div>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <Card
                key={room.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => router.push(`/canvas/${room.id}`)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-center text-xl font-bold text-indigo-700 dark:text-indigo-300">
                    {room.slug}
                    <ChevronRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {room.participants} 
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatLast(room.last!)}
                      </div>
                    </div>
                    <span className="text-xs">ID: {room.id}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a Room</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Enter Room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
              Cancel
            </Button>
            <Button onClick={joinRoom} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Join
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a Room</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Enter Room Name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createRoom} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}