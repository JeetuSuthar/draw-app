"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import {
  PlusCircle,
  LogIn,
  Loader2,
  Search,
  Users,
  Clock,
  ChevronRight,
  SortAsc,
  SortDesc,
  Trash2,
  Edit,
  Share,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Room {
  id: number
  slug: string
  last?: string
  participants?: number
  createdAt?: string
  updatedAt?: string
  isOwner?: boolean
}

export default function RoomManager() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoomName, setNewRoomName] = useState("")
  const [joinRoomId, setJoinRoomId] = useState("")
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showJoinDialog, setShowJoinDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "date" | "participants">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [activeTab, setActiveTab] = useState("all")
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchRooms()

    // Focus search input on load
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const fetchRooms = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get(`http://206.189.137.154:3001/rooms`, {
        headers: { Authorization: `${token}` },
      })

      // Adding mock data for demonstration
      const enhancedRooms = response.data.rooms.map((room: Room) => ({
        ...room,
        last: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
        participants: Math.floor(Math.random() * 10) + 1,
        createdAt: new Date(Date.now() - Math.random() * 20000000000).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
        isOwner: Math.random() > 0.3, // 70% chance of being the owner
      }))

      setRooms(enhancedRooms)
      toast.success("Rooms loaded successfully")
    } catch (error) {
      console.error("Error fetching rooms:", error)
      toast.error("Failed to fetch rooms")
    } finally {
      setIsLoading(false)
    }
  }

  const createRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error("Please enter a room name")
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `http://206.189.137.154:3001/room`,
        { name: newRoomName },
        {
          headers: { Authorization: `${token}` },
        },
      )
      toast.success("Room created successfully")
      router.push(`/canvas/${response.data.roomId}`)
    } catch (error) {
      console.error("Error creating room:", error)
      toast.error("Failed to create room")
    } finally {
      setIsLoading(false)
      setShowCreateDialog(false)
      setNewRoomName("")
    }
  }

  const joinRoom = async () => {
    if (!joinRoomId.trim()) {
      toast.error("Please enter a room ID")
      return
    }

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
      setJoinRoomId("")
    }
  }

  const confirmDeleteRoom = (room: Room) => {
    setRoomToDelete(room)
    setShowDeleteDialog(true)
  }

  const deleteRoom = async () => {
    if (!roomToDelete) return

    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://206.189.137.154:3001/room/${roomToDelete.id}`, {
        headers: { Authorization: `${token}` },
      })

      setRooms(rooms.filter((room) => room.id !== roomToDelete.id))
      toast.success("Room deleted successfully")
    } catch (error) {
      console.error("Error deleting room:", error)
      toast.error("Failed to delete room")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
      setRoomToDelete(null)
    }
  }

  const filteredRooms = rooms.filter((room) => {
    // Filter by search query
    const matchesSearch =
      room.slug.toLowerCase().includes(searchQuery.toLowerCase()) || room.id.toString().includes(searchQuery)

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "owned") return matchesSearch && room.isOwner
    if (activeTab === "shared") return matchesSearch && !room.isOwner

    return matchesSearch
  })

  // Sort rooms
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.slug.localeCompare(b.slug) : b.slug.localeCompare(a.slug)
    }

    if (sortBy === "participants") {
      return sortOrder === "asc"
        ? (a.participants || 0) - (b.participants || 0)
        : (b.participants || 0) - (a.participants || 0)
    }

    // Default: sort by date
    const dateA = new Date(a.updatedAt || a.last || "").getTime()
    const dateB = new Date(b.updatedAt || b.last || "").getTime()
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA
  })

  const formatLast = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      if (diffInHours === 0) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`
      }
      return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`
    }

    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`
    }

    return date.toLocaleDateString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950 p-4 md:p-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Your Rooms</h1>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" onClick={() => setShowJoinDialog(true)} className="flex-1 sm:flex-none">
                <LogIn className="mr-2 h-4 w-4" /> Join Room
              </Button>
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Create Room
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search rooms by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="date">Last updated</SelectItem>
                  <SelectItem value="participants">Participants</SelectItem>
                </SelectContent>
              </Select>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    >
                      {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{sortOrder === "asc" ? "Ascending" : "Descending"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full md:w-[400px] grid-cols-3">
              <TabsTrigger value="all">All Rooms</TabsTrigger>
              <TabsTrigger value="owned">Owned</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
          </Tabs>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-1/2" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {sortedRooms.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900">
                  <Search className="h-8 w-8 text-indigo-600 dark:text-indigo-300" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No rooms found</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery ? "Try adjusting your search or filters" : "Create a new room to get started"}
                </p>
                <div className="mt-6">
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Room
                  </Button>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedRooms.map((room) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      layout
                    >
                      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-2 flex flex-row items-start justify-between">
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {room.slug}
                            </CardTitle>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge variant={room.isOwner ? "default" : "secondary"} className="text-xs">
                                {room.isOwner ? "Owner" : "Shared"}
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400">ID: {room.id}</span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/canvas/${room.id}`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/canvas/${room.id}`)
                                  toast.success("Room link copied to clipboard")
                                }}
                              >
                                <Share className="mr-2 h-4 w-4" />
                                Copy link
                              </DropdownMenuItem>
                              {room.isOwner && (
                                <DropdownMenuItem
                                  onClick={() => confirmDeleteRoom(room)}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardHeader>

                        <CardContent className="pb-3">
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
                          </div>
                        </CardContent>

                        <CardFooter className="pt-0">
                          <Button
                            variant="ghost"
                            className="w-full justify-between group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                            onClick={() => router.push(`/canvas/${room.id}`)}
                          >
                            Open room
                            <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </>
        )}
      </motion.div>

      {/* Create Room Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Room</DialogTitle>
            <DialogDescription>Give your room a descriptive name to help you identify it later.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name</Label>
              <Input
                id="roomName"
                type="text"
                placeholder="Enter room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createRoom} disabled={isLoading || !newRoomName.trim()}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Room Dialog */}
      <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join a Room</DialogTitle>
            <DialogDescription>Enter the room ID to join an existing collaboration.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                id="roomId"
                type="text"
                placeholder="Enter Room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowJoinDialog(false)}>
              Cancel
            </Button>
            <Button onClick={joinRoom} disabled={isLoading || !joinRoomId.trim()}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
              Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Room Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Room</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this room? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            {roomToDelete && (
              <div className="p-4 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 rounded-md">
                <p className="font-medium text-gray-900 dark:text-white">{roomToDelete.slug}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">ID: {roomToDelete.id}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteRoom} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
