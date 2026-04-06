<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS 4" />
  <img src="https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Cloudinary-Media_Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
</p>

# 🎓 The Journey — Batch 2023-26

> *A premium, full-stack web application built to preserve, celebrate, and relive the college memories of BCA Batch 2023-26.*

**The Journey** is more than just a website — it's a digital time capsule. Designed with a sleek dark-mode aesthetic powered by glassmorphism, smooth Framer Motion animations, and a masonry gallery layout, it captures the spirit of three years of friendship, growth, and shared experiences.

---

## ✨ Features

### 🌐 Public Pages (Accessible to Everyone)
| Page | Route | Description |
|------|-------|-------------|
| **The Journey** | `/` | Hero landing page with an animated timeline of key milestones — from the first day of college to final semesters. Events are loaded dynamically from the backend with images hosted on Cloudinary. |
| **The Batch** | `/batch` | "Meet the Batch" directory showcasing every batch member with profile cards, profile pictures, and clickable social media links (Instagram, LinkedIn, GitHub, Portfolio). Members are sorted by roll number. |
| **The Wall** | `/wall` | A community memory wall where messages, stories, and tagged memories are displayed in beautifully framed cards. Supports likes, comments, categories, and date-based filtering. |
| **Album** | `/album` | A responsive masonry photo gallery with semester-based filtering (1st Sem → 6th Sem). Photos are rendered in a Pinterest-style layout with smooth lazy-loading. |

### 🔐 Mates-Only Pages (Require Authentication)
| Page | Route | Description |
|------|-------|-------------|
| **Login** | `/login` | Roll number + name based authentication for verified batch members. Issues JWT tokens for session management. |
| **Add Message** | `/create-memory` | A rich form to compose and publish memories with titles, content, photo attachments, tags, and category selection. |
| **Profile** | `/profile` | Personal profile page with an editable glassmorphic profile card. Upload profile pictures (stored on Cloudinary) and manage social links. |
| **Stickers** | `/stickers` | Browse and view stickers uploaded by batch mates. |
| **Upload Sticker** | `/upload-sticker` | Upload custom stickers for the batch community. |

### 🛡️ Security & Infrastructure
- **JWT Authentication** with Bearer token management
- **Protected Routes** using a `ProtectedRoute` wrapper component
- **Rate Limiting** — separate limits for general API and auth endpoints
- **Input Validation** via `express-validator`
- **CORS Configuration** — custom middleware for cross-origin security
- **Cloudinary Integration** for scalable image/media storage with `multer` for file uploads
- **Password Hashing** with `bcryptjs`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│  React 19 · Vite 8 · TailwindCSS 4 · Framer Motion     │
│  Deployed on Vercel (SPA with client-side routing)      │
└──────────────────────┬──────────────────────────────────┘
                       │  REST API (fetch)
                       ▼
┌─────────────────────────────────────────────────────────┐
│                       SERVER                            │
│  Node.js · Express 5 · JWT Auth · Rate Limiting         │
│  Multer (file uploads) · express-validator               │
└──────────┬───────────────────────────┬──────────────────┘
           │                           │
           ▼                           ▼
┌────────────────────┐    ┌───────────────────────┐
│     MongoDB        │    │     Cloudinary         │
│  (Mongoose 9 ODM)  │    │  (Image/Media CDN)     │
│                    │    │                        │
│  • Users           │    │  • Profile Pictures    │
│  • Memories        │    │  • Memory Photos       │
│  • Photos          │    │  • Journey Event Imgs  │
│  • JourneyEvents   │    │  • Stickers            │
└────────────────────┘    └───────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI component library |
| **Vite** | 8 | Build tool and dev server |
| **TailwindCSS** | 4 | Utility-first CSS framework |
| **Framer Motion** | 12 | Animations and micro-interactions |
| **React Router** | 7 | Client-side routing |
| **Lucide React** | 1.7 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | — | Runtime environment |
| **Express** | 5 | Web framework |
| **Mongoose** | 9 | MongoDB ODM |
| **JWT** | 9 | Authentication tokens |
| **bcryptjs** | 3 | Password hashing |
| **Cloudinary** | 2 | Cloud media management |
| **Multer** | 2 | File upload middleware |
| **express-validator** | 7 | Request validation |
| **express-rate-limit** | 8 | API rate limiting |

### Deployment
| Service | Purpose |
|---------|---------|
| **Vercel** | Frontend hosting (SPA rewrites configured) |
| **MongoDB Atlas** | Cloud database |
| **Cloudinary** | Media CDN / image storage |

---

## 📁 Project Structure

```
Batch 2023-26/
├── Frontend/                          # React SPA
│   ├── public/                        # Static assets & favicon
│   ├── src/
│   │   ├── assets/                    # Static images, fonts
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx         # Site-wide footer
│   │   │   │   ├── Layout.jsx         # Page layout wrapper
│   │   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   │   └── ProtectedRoute.jsx # Auth route guard
│   │   │   ├── section/
│   │   │   │   ├── HeroSection.jsx    # Animated hero banner
│   │   │   │   └── MasonryLayoutSection.jsx  # Masonry grid
│   │   │   └── ui/
│   │   │       ├── Button.jsx         # Reusable button
│   │   │       ├── Card.jsx           # Base card component
│   │   │       ├── Input.jsx          # Form input
│   │   │       ├── TextArea.jsx       # Form textarea
│   │   │       ├── MateCard.jsx       # Batch member card
│   │   │       ├── MessageFrame.jsx   # Memory/message display
│   │   │       ├── PhotoFrame.jsx     # Photo display frame
│   │   │       └── ProfileCard.jsx    # Glassmorphic profile card
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # Authentication provider
│   │   │   └── AuthContextStore.js    # Context store exports
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── TheJurney.jsx      # Landing page + timeline
│   │   │   │   ├── TheBatch.jsx       # Batch members directory
│   │   │   │   ├── TheWall.jsx        # Community memory wall
│   │   │   │   └── Album.jsx          # Photo gallery
│   │   │   └── mates/
│   │   │       ├── Login.jsx          # Authentication page
│   │   │       ├── AddMessage.jsx     # Create memory form
│   │   │       ├── Profile.jsx        # User profile page
│   │   │       ├── StickersDisplay.jsx # View stickers
│   │   │       └── UploadSticker.jsx  # Upload stickers
│   │   ├── services/
│   │   │   └── api.js                 # Centralized API service layer
│   │   ├── utils/                     # Utility functions
│   │   ├── App.jsx                    # Root component + router
│   │   ├── main.jsx                   # App entry point
│   │   └── index.css                  # Global styles & design tokens
│   ├── vercel.json                    # Vercel SPA rewrite rules
│   ├── vite.config.js                 # Vite configuration
│   └── package.json
│
├── Backend/                           # Express REST API
│   ├── config/
│   │   ├── database.js                # MongoDB connection setup
│   │   └── cloudinary.js              # Cloudinary SDK config
│   ├── controllers/
│   │   ├── authController.js          # Login, register, token logic
│   │   ├── userController.js          # User CRUD + profile updates
│   │   ├── memoryController.js        # Memory CRUD, likes, comments
│   │   ├── photoController.js         # Photo upload, CRUD, likes
│   │   └── journeyController.js       # Timeline event management
│   ├── middleware/
│   │   ├── auth.js                    # JWT verification middleware
│   │   ├── cors.js                    # CORS configuration
│   │   ├── rateLimit.js               # API & auth rate limiters
│   │   ├── upload.js                  # Multer file upload config
│   │   └── validation.js              # Request validation rules
│   ├── models/
│   │   ├── User.js                    # User schema (profile, social links, roles)
│   │   ├── Memory.js                  # Memory schema (posts, likes, comments)
│   │   ├── Photo.js                   # Photo schema (albums, semesters, tags)
│   │   └── JourneyEvent.js            # Timeline event schema
│   ├── routes/
│   │   ├── auth.js                    # POST /login, /register, GET /me
│   │   ├── users.js                   # User management endpoints
│   │   ├── memories.js                # Memory CRUD + social endpoints
│   │   ├── photos.js                  # Photo upload + management
│   │   └── journeys.js                # Journey timeline endpoints
│   ├── utils/
│   │   └── helpers.js                 # Shared utility functions
│   ├── seed.js                        # Database seeder script
│   ├── server.js                      # Express app entry point
│   └── package.json
│
└── README.md                          # You are here
```

---

## 🔌 API Reference

Base URL: `/api`

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | ✗ | Login with roll number + name |
| `POST` | `/auth/register` | ✗ | Register a new user |
| `GET` | `/auth/me` | ✓ | Get current authenticated user |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users` | ✓ | List all batch members |
| `GET` | `/users/:id` | ✗ | Get a specific user's profile |
| `PUT` | `/users/:id` | ✓ | Update user profile (supports FormData for profile picture) |
| `DELETE` | `/users/:id` | ✓ | Delete a user account |
| `GET` | `/users/:id/memories` | ✗ | Get all memories by a user |
| `GET` | `/users/:id/photos` | ✗ | Get all photos by a user |

### Memories
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/memories` | ✗ | List memories (supports query params for filtering) |
| `GET` | `/memories/my/history` | ✓ | Get authenticated user's memories |
| `GET` | `/memories/:id` | ✗ | Get a single memory |
| `POST` | `/memories` | ✓ | Create a new memory |
| `PUT` | `/memories/:id` | ✓ | Update a memory |
| `DELETE` | `/memories/:id` | ✓ | Delete a memory |
| `POST` | `/memories/:id/like` | ✓ | Toggle like on a memory |
| `POST` | `/memories/:id/comments` | ✓ | Add a comment to a memory |

### Photos
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/photos` | ✗ | List photos (filterable by semester, album, tags) |
| `GET` | `/photos/:id` | ✗ | Get a single photo |
| `POST` | `/photos/upload` | ✓ | Upload photos (multipart/form-data) |
| `PUT` | `/photos/:id` | ✓ | Update photo metadata |
| `DELETE` | `/photos/:id` | ✓ | Delete a photo |
| `POST` | `/photos/:id/like` | ✓ | Toggle like on a photo |

### Journey Events
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/journeys` | ✗ | List all timeline events |
| `POST` | `/journeys` | ✓ | Create a timeline event (supports image upload) |
| `PUT` | `/journeys/:id` | ✓ | Update a timeline event |
| `DELETE` | `/journeys/:id` | ✓ | Delete a timeline event |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or later recommended)
- **npm** (v9+)
- **MongoDB** instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account ([Sign up free](https://cloudinary.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/rumman2004/The-Journey.git
cd The-Journey
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/batch2023-26
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Seed the database (optional):
```bash
node seed.js
```

Start the backend server:
```bash
npm start
```

The API will be available at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:
```env
VITE_API_URI=http://localhost:5000/api
```

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for Production

```bash
cd Frontend
npm run build
```

The optimized build output will be in `Frontend/dist/`.

---

## 🌍 Deployment

### Frontend (Vercel)
1. Connect the repository to [Vercel](https://vercel.com/).
2. Set the **Root Directory** to `Frontend`.
3. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Add the environment variable `VITE_API_URI` pointing to your deployed backend URL.
5. The `vercel.json` is already configured to handle SPA client-side routing rewrites.

### Backend
Deploy the `Backend/` directory to any Node.js hosting provider (e.g., Render, Railway, Fly.io) and set the required environment variables.

---

## 📊 Database Models

### User
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name (required) |
| `rollNumber` | Number | Unique roll number (required) |
| `profilePicture` | String | Cloudinary URL |
| `socialLinks` | Object | Instagram, LinkedIn, GitHub, Portfolio URLs |
| `batch` | String | Defaults to `2023-26` |
| `role` | Enum | `student` or `admin` |
| `isVerified` | Boolean | Verification status |

### Memory
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Memory title (max 100 chars) |
| `content` | String | Memory body (max 2000 chars) |
| `author` | ObjectId → User | Who wrote it |
| `photos` | [String] | Array of Cloudinary URLs |
| `tags` | [String] | Searchable tags |
| `category` | Enum | `event`, `achievement`, `personal`, `group`, `other` |
| `likes` | [ObjectId → User] | Users who liked |
| `comments` | [Embedded] | Nested comments with user ref and content |
| `memoryDate` | Date | When the memory occurred |

### Photo
| Field | Type | Description |
|-------|------|-------------|
| `imageUrl` | String | Cloudinary URL (required) |
| `publicId` | String | Cloudinary public ID for deletion |
| `semester` | Enum | `1st sem` through `6th sem`, or `General` |
| `album` | String | Album group identifier |
| `tags` | [String] | Searchable tags |
| `likes` | [ObjectId → User] | Users who liked |

### JourneyEvent
| Field | Type | Description |
|-------|------|-------------|
| `year` | String | Event year |
| `month` | String | Event month |
| `index` | String | Sort order within timeline |
| `title` | String | Event title (max 150 chars) |
| `description` | String | Event description (max 2000 chars) |
| `imageUrl` | String | Cloudinary URL |
| `uploadedBy` | ObjectId → User | Event creator |

---

## 🤝 Contributing

This is a personal project for **BCA Batch 2023-26**. If you're a batchmate and want to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<p align="center">
  Built with ❤️ by <strong>Rumman Ahmed</strong>
</p>