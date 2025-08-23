# 🎨 CollabDraw
> Real-time collaborative drawing web app with custom-built canvas and live multiplayer support.

## 📹 Check the Demo Video link

[![Watch the demo](./thumbnail.png)](https://drive.google.com/file/d/1qX8LpXrjJY6gZ8vstEsz88HrGBitQedt/view?usp=sharing)
or
https://drive.google.com/file/d/1qX8LpXrjJY6gZ8vstEsz88HrGBitQedt/view?usp=sharing

---

## 📐 System Architecture

### 🏗️ High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend (excelidraw-frontend)                        │
│  ├── Canvas Component (Custom Drawing Engine)                   │
│  ├── Real-time WebSocket Connection                            │
│  ├── HTTP API Client                                           │
│  ├── JWT Authentication                                        │
│  └── AI-Powered Drawing Generation                             │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ HTTP/WS
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐    ┌─────────────────────────────────┐ │
│  │   HTTP Backend      │    │      WebSocket Backend         │ │
│  │   (Port 3001)       │    │      (Port 8080)               │ │
│  │                     │    │                                 │ │
│  │ • Authentication    │    │ • Real-time Communication      │ │
│  │ • Room Management   │    │ • Canvas State Sync            │ │
│  │ • AI Integration    │    │ • User Presence                │ │
│  │ • CRUD Operations   │    │ • Drawing Events               │ │
│  └─────────────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │ Prisma ORM
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│                      PostgreSQL Database                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────────┐│
│  │    Users    │ │    Rooms    │ │           Chat              ││
│  │             │ │             │ │    (Drawing Data)           ││
│  │ • id        │ │ • id        │ │ • id                        ││
│  │ • email     │ │ • slug      │ │ • roomId                    ││
│  │ • password  │ │ • adminId   │ │ • userId                    ││
│  │ • name      │ │ • createdAt │ │ • message (JSON)            ││
│  │ • photo     │ │             │ │   └── Shape Data            ││
│  └─────────────┘ └─────────────┘ └─────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### 🔧 Component Architecture

#### Frontend Architecture (Next.js)
```
apps/excelidraw-frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme provider
│   ├── page.tsx                 # Landing page
│   ├── (room)/                  # Room routes
│   │   └── [roomId]/           # Dynamic room pages
│   ├── canvas/                  # Canvas route
│   ├── signin/                  # Authentication pages
│   └── signup/
├── components/                   # React Components
│   ├── Canvas.tsx              # Main drawing canvas
│   ├── RoomCanvas.tsx          # Room-specific canvas
│   ├── AIModal.tsx             # AI generation modal
│   ├── Toolbar.tsx             # Drawing tools
│   ├── Sidebar.tsx             # Color/style controls
│   └── ui/                     # Reusable UI components
├── draw/                        # Custom Drawing Engine
│   ├── Game.ts                 # Core canvas engine
│   ├── select.ts               # Selection tool logic
│   ├── eraser.ts               # Eraser tool logic
│   ├── http.ts                 # HTTP API calls
│   └── index.ts                # Drawing utilities
└── icons/                       # SVG icon components
```

#### Backend Architecture (Microservices)
```
apps/
├── http-backend/                # REST API Server
│   ├── src/
│   │   ├── index.ts            # Express server
│   │   ├── middleware.ts       # JWT auth middleware
│   │   └── lib/
│   │       └── utils.ts        # AI prompt generation
│   └── package.json
├── ws-backend/                  # WebSocket Server
│   ├── src/
│   │   └── index.ts            # WebSocket handlers
│   └── package.json
└── packages/                    # Shared Packages
    ├── db/                     # Database package
    │   ├── prisma/
    │   │   └── schema.prisma   # Database schema
    │   └── src/
    │       └── index.ts        # Prisma client
    ├── common/                 # Shared types
    │   └── src/
    │       └── types.ts        # Zod schemas
    └── backend-common/         # Backend utilities
        └── src/
            └── index.ts        # Shared backend code
```

### 🎯 Core Systems

#### 1. Custom Canvas Engine
The drawing engine is built from scratch using HTML5 Canvas API:

```typescript
class Game {
  // Core canvas management
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  
  // Drawing state
  private existingShapes: Shape[];
  private strokeColor: string;
  private strokeFill: string;
  private strokeWidth: number;
  
  // Tool system
  private type: string; // select, rectangle, circle, pencil, etc.
  
  // Real-time sync
  private socket: WebSocket;
  private roomId: string;
}
```

**Drawing Tools Supported:**
- ✏️ Freehand drawing (pencil)
- 📐 Geometric shapes (rectangle, circle, diamond, line, arrow)
- 📝 Text insertion
- 🎯 Selection and transformation
- 🖐️ Panning and navigation
- 🗑️ Eraser tool

#### 2. Real-Time Communication System

**WebSocket Message Types:**
```typescript
// Room management
{ type: 'join_room', roomId: string }
{ type: 'leave_room', roomId: string }

// Drawing synchronization
{ type: 'chat', roomId: string, shape: Shape }
{ type: 'eraser', roomId: string, chatId: string }
{ type: 'select', roomId: string, chatId: string, shape: Shape }

// Canvas operations
{ type: 'clear', roomId: string }
{ type: 'pan', roomId: string, existingShapes: Shape[] }
{ type: 'updatePan', roomId: string, shapes: Shape[] }

// User presence
{ type: 'user-list', roomId: string, users: string[] }
{ type: 'user-joined', roomId: string, userId: string, username: string }
{ type: 'user-left', roomId: string, userId: string }
```

#### 3. Database Schema Design

```prisma
model User {
  id       String  @id @default(uuid())
  email    String  @unique
  password String  // TODO: Hash with bcrypt
  name     String?
  photo    String?
  rooms    Room[]  @relation("RoomUsers")     // Many-to-many
  chat     Chat[]                             // User's drawings
  adminOf  Room[]  @relation("RoomAdmin")     // Rooms user created
}

model Room {
  id        Int      @id @default(autoincrement())
  slug      String   // Room name/identifier
  createdAt DateTime @default(now())
  adminId   String   // Room creator
  admin     User     @relation(fields: [adminId], references: [id], name: "RoomAdmin")
  chat      Chat[]   // All drawings in room
  users     User[]   @relation("RoomUsers")  // Participants
}

model Chat {
  id        Int     @id @default(autoincrement())
  roomId    Int     // Associated room
  message   String  // JSON serialized Shape data
  userId    String  // Drawing author
  user      User    @relation(fields: [userId], references: [id])
  room      Room    @relation(fields: [roomId], references: [id])
}
```

**Drawing Data Storage:**
Drawings are stored as JSON in the `Chat.message` field:
```json
{
  "type": "rectangle",
  "startX": 100,
  "startY": 150,
  "width": 200,
  "height": 100,
  "strokeStyle": "#ffffff",
  "strokeFill": "transparent",
  "strokeWidth": 2,
  "stStyle": "solid",
  "chatId": "unique-shape-id"
}
```

#### 4. AI Integration System

**AI-Powered Drawing Generation:**
- Integration with Google Gemini 2.5 Flash API
- Two generation modes:
  - **OBJECT**: Generate shapes for specific objects/concepts
  - **FLOWCHART**: Create process flow diagrams

**AI Prompt Engineering:**
```typescript
function createObjectDrawingPrompt(content: string, roomId: string, userId: string) {
  return `Generate a visual representation of "${content}" using basic shapes...`;
}

function createFlowchartPrompt(content: string, roomId: string, userId: string) {
  return `Create a flowchart for the process: "${content}"...`;
}
```

#### 5. Authentication & Authorization

**JWT-based Authentication Flow:**
```
1. User signup/signin → HTTP Backend
2. Password validation → Database lookup
3. JWT token generation → Signed with secret
4. Token storage → Client-side (localStorage/cookies)
5. WebSocket authentication → Token in query params
6. Request authorization → Middleware validation
```

**Security Middleware:**
```typescript
export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
```

### 🔄 Data Flow Architecture

#### Drawing Creation Flow:
```
1. User draws on canvas → Canvas event handlers
2. Shape data created → Game.ts engine
3. Shape sent via WebSocket → ws-backend
4. Shape stored in database → Prisma → PostgreSQL
5. Shape broadcasted → All room participants
6. Canvas re-rendered → All connected clients
```

#### Room Collaboration Flow:
```
1. User joins room → WebSocket connection + room ID
2. Authentication check → JWT validation
3. User added to room → UserArr in ws-backend
4. Existing shapes loaded → HTTP API call
5. Canvas initialized → All previous drawings rendered
6. Real-time sync enabled → WebSocket message handling
```

### 🏭 Deployment Architecture

#### Containerization Strategy:
```
Docker Containers:
├── Frontend Container (Dockerfile.frontend)
│   ├── Node.js 20 Alpine
│   ├── Next.js build
│   └── Port 3000
├── HTTP Backend Container (Dockerfile.backend)
│   ├── Node.js 22 Alpine
│   ├── Express server
│   └── Port 3001
└── WebSocket Backend Container (Dockerfile.ws)
    ├── Node.js 22 Alpine
    ├── WebSocket server
    └── Port 8080
```

#### Production Deployment:
- **Frontend**: Vercel (Next.js optimized)
- **Backend Services**: Render/Railway (containerized)
- **Database**: PostgreSQL (managed service)
- **CDN**: Vercel Edge Network

### 🎨 Drawing Engine Deep Dive

#### Shape System:
```typescript
interface Shape {
    type: string;           // rectangle, circle, line, pencil, text, etc.
    startX: number;         // Origin X coordinate
    startY: number;         // Origin Y coordinate
    height: number;         // Shape height
    width: number;          // Shape width
    points?: Point[];       // For pencil/complex shapes
    text?: string;          // For text shapes
    strokeStyle: string;    // Color
    strokeFill: string;     // Fill color
    stStyle: string;        // solid, dashed, dotted
    strokeWidth: number;    // Line thickness
    chatId: string;         // Unique identifier
}
```

#### Event System:
```typescript
// Mouse event handling
mouseDownHandler → Start drawing
mouseMoveHandler → Continue drawing/preview
mouseUpHandler   → Finish shape/send to server

// Tool-specific behaviors
select tool   → Shape selection/transformation
pencil tool   → Freehand path recording
shape tools   → Geometric shape creation
eraser tool   → Shape deletion
pan tool      → Canvas navigation
```

### 🔧 Performance Optimizations

#### Canvas Rendering:
- **Differential rendering**: Only redraw changed areas
- **Shape batching**: Group similar operations
- **Memory management**: Clean up unused shapes
- **Viewport culling**: Only render visible shapes

#### Network Optimization:
- **Message queuing**: Batch rapid drawing events
- **Compression**: Minimize WebSocket payload size
- **Debouncing**: Reduce rapid-fire updates
- **State synchronization**: Efficient delta updates

#### Database Optimization:
- **Connection pooling**: Prisma connection management
- **Query optimization**: Efficient shape retrieval
- **Indexing**: Optimized room/user lookups
- **JSON storage**: Flexible shape data structure

---

## ✨ Features

- 🖊️ **Real-Time Drawing**  
  Draw simultaneously with others in live rooms using WebSocket-based communication.

- 🧠 **Custom Canvas Engine**  
  Built from scratch using pure math and physics — no external canvas libraries used.

- 👥 **Room-Based Collaboration**  
  Join or create a room, and collaborate in real-time with others.

- 🔐 **JWT Authentication**  
  Secure login and session management via JSON Web Tokens.

- 🧩 **Monorepo Architecture**  
  Uses TurboRepo to handle frontend and backend within a single, scalable monorepo.

- 📦 **Reusable Packages**  
  Shared utilities and types across projects using the monorepo structure.

- 🤖 **AI-Powered Drawing**  
  Generate drawings and flowcharts using Google Gemini AI integration.

- 🎨 **Rich Drawing Tools**  
  Comprehensive set of drawing tools including shapes, freehand, text, and styling options.

---

## 🛠 Tech Stack

| Layer           | Tech Used                             |
|----------------|----------------------------------------|
| Frontend        | Next.js 15, TypeScript, Tailwind CSS  |
| Backend         | Express.js, WebSockets, Node.js       |
| Database        | PostgreSQL, Prisma ORM               |
| Authentication  | JWT, bcrypt                           |
| AI Integration  | Google Gemini 2.5 Flash API           |
| Architecture    | TurboRepo (Monorepo)                  |
| Deployment      | Docker, Vercel, Render                |
| Real-time       | WebSockets (ws library)               |
| State Mgmt      | React Hooks, Context API              |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Docker (optional, for containerized deployment)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd draw-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create `.env` files in the respective backend directories:
   
   **apps/http-backend/.env:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/drawapp"
   JWT_SECRET="your-jwt-secret-key"
   GEMINI_API_KEY="your-google-gemini-api-key"
   ```
   
   **apps/ws-backend/.env:**
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/drawapp"
   JWT_SECRET="your-jwt-secret-key"
   ```

4. **Database setup**
   ```bash
   # Generate Prisma client
   pnpm run db:generate
   
   # Run database migrations
   cd packages/db
   pnpm prisma migrate dev
   ```

5. **Start development servers**
   ```bash
   # Start all services concurrently
   pnpm run dev
   
   # Or start individually:
   pnpm run start:web       # Frontend (http://localhost:3000)
   pnpm run start:backend   # HTTP API (http://localhost:3001)
   pnpm run start:websocket # WebSocket (ws://localhost:8080)
   ```

### Production Deployment

#### Using Docker
```bash
# Build and run with docker-compose
docker-compose up --build

# Or build individual containers
docker build -f docker/Dockerfile.frontend -t draw-app-frontend .
docker build -f docker/Dockerfile.backend -t draw-app-backend .
docker build -f docker/Dockerfile.ws -t draw-app-ws .
```

#### Manual Deployment
```bash
# Build the application
pnpm run build

# Start production servers
NODE_ENV=production pnpm run start:web
NODE_ENV=production pnpm run start:backend
NODE_ENV=production pnpm run start:websocket
```

---

## 📝 API Documentation

### HTTP API Endpoints

#### Authentication
```http
POST /signup
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

```http
POST /signin
Content-Type: application/json

{
  "username": "user@example.com",
  "password": "securepassword"
}
```

#### Room Management
```http
POST /room
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "My Drawing Room"
}
```

```http
GET /rooms
Authorization: Bearer <jwt-token>
```

```http
GET /room/:slug
```

#### Drawing Data
```http
GET /chats/:roomId
```

#### AI Generation
```http
POST /generate-drawing
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "type": "OBJECT", // or "FLOWCHART"
  "content": "Draw a house with a garden",
  "roomId": "123"
}
```

### WebSocket API

#### Connection
```javascript
const socket = new WebSocket(`ws://localhost:8080?token=${jwtToken}`);
```

#### Message Types
```javascript
// Join a room
socket.send(JSON.stringify({
  type: 'join_room',
  roomId: '123'
}));

// Send drawing data
socket.send(JSON.stringify({
  type: 'chat',
  roomId: '123',
  shape: {
    type: 'rectangle',
    startX: 100,
    startY: 100,
    width: 50,
    height: 30,
    strokeStyle: '#ffffff',
    strokeFill: 'transparent',
    strokeWidth: 2,
    stStyle: 'solid',
    chatId: 'unique-id'
  }
}));

// Erase a shape
socket.send(JSON.stringify({
  type: 'eraser',
  roomId: '123',
  chatId: 'shape-to-delete'
}));
```

---

## 🎯 Usage Guide

### Drawing Tools

| Tool | Hotkey | Description |
|------|--------|-------------|
| Pan | `0` | Navigate around the canvas |
| Select | `1` | Select and move shapes |
| Rectangle | `2` | Draw rectangles |
| Circle | `3` | Draw circles |
| Diamond | `4` | Draw diamond shapes |
| Arrow | `5` | Draw arrows |
| Line | `6` | Draw straight lines |
| Pencil | `7` | Freehand drawing |
| Text | `8` | Add text labels |
| Eraser | `9` | Delete shapes |

### Styling Options
- **Stroke Colors**: Red, Green, Blue, Yellow, White
- **Fill Colors**: Red, Green, Blue, Yellow, Transparent
- **Stroke Width**: Thin (1.5px), Medium (3px), Thick (5px)
- **Stroke Style**: Solid, Dotted, Dashed

### Collaboration Features
- **Real-time Drawing**: See others draw in real-time
- **User Presence**: View who's currently in the room
- **Room Management**: Create and join named rooms
- **Persistent Canvas**: Drawings are saved and restored

### AI Drawing Generation
1. Click the "AI" button in the toolbar
2. Select generation type (Object or Flowchart)
3. Enter your description
4. The AI will generate appropriate shapes

---

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_HTTP_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_WS_BACKEND_URL=ws://localhost:8080
```

#### HTTP Backend
```env
DATABASE_URL="postgresql://username:password@localhost:5432/drawapp"
JWT_SECRET="your-super-secret-jwt-key"
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3001
```

#### WebSocket Backend
```env
DATABASE_URL="postgresql://username:password@localhost:5432/drawapp"
JWT_SECRET="your-super-secret-jwt-key"
PORT=8080
```

### CORS Configuration
The HTTP backend is configured to allow requests from:
- `https://collabdraw-hes1.onrender.com` (production)
- `http://localhost:3000` (development)

### Database Configuration
The application uses Prisma ORM with PostgreSQL. The schema supports:
- User authentication and profiles
- Room-based collaboration
- JSON storage for flexible drawing data

---

## 🧪 Testing

### Running Tests
```bash
# Run all tests
pnpm test

# Run tests for specific package
cd apps/excelidraw-frontend
pnpm test

# Run tests in watch mode
pnpm test --watch
```

### Manual Testing Checklist
- [ ] User can sign up and sign in
- [ ] User can create and join rooms
- [ ] Drawing tools work correctly
- [ ] Real-time collaboration functions
- [ ] Canvas state persists across sessions
- [ ] AI generation produces valid shapes
- [ ] Mobile responsiveness works

---

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features

### Project Structure Guidelines
- Keep components small and focused
- Use shared packages for common utilities
- Maintain clear separation between frontend and backend
- Follow the established monorepo patterns

---

## 📚 Technical Details

### Custom Canvas Engine
The drawing engine is built from scratch without external canvas libraries:
- **Event System**: Mouse/touch event handling with tool-specific behaviors
- **Shape Management**: Efficient rendering and state management
- **Memory Optimization**: Smart garbage collection and viewport culling
- **Performance**: Differential rendering and shape batching

### Real-time Architecture
- **WebSocket Communication**: Bidirectional real-time data flow
- **State Synchronization**: Efficient delta updates and conflict resolution
- **User Presence**: Live user tracking and notifications
- **Message Queuing**: Intelligent batching for performance

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Planned bcrypt integration
- **CORS Protection**: Configured origin restrictions
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection

---

## 🐛 Troubleshooting

### Common Issues

#### WebSocket Connection Fails
```bash
# Check if WebSocket server is running
netstat -an | grep 8080

# Verify JWT token is valid
# Check browser console for authentication errors
```

#### Database Connection Issues
```bash
# Test database connection
cd packages/db
pnpm prisma db pull

# Reset database if needed
pnpm prisma migrate reset
```

#### AI Generation Not Working
- Verify `GEMINI_API_KEY` is set correctly
- Check API quota and billing
- Review network connectivity to Google APIs

#### Canvas Not Rendering
- Check browser canvas support
- Verify WebGL compatibility
- Clear browser cache and cookies

### Performance Issues
- **Slow Drawing**: Check WebSocket latency
- **Memory Leaks**: Monitor browser dev tools
- **Database Lag**: Review query performance
- **Large Rooms**: Consider pagination for shapes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team** for the excellent React framework
- **Prisma Team** for the amazing ORM
- **Vercel** for hosting and deployment
- **Google AI** for the Gemini API
- **WebSocket Community** for real-time communication standards

---

## 📞 Support

For support, email support@collabdraw.com or join our [Discord community](https://discord.gg/collabdraw).

---

**Made with ❤️ by the CollabDraw Team**
