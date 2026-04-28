<div align="center">

<br/>

```
███╗   ███╗███████╗ █████╗ ██╗      ███████╗██╗  ██╗ █████╗ ██████╗ ███████╗
████╗ ████║██╔════╝██╔══██╗██║      ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝
██╔████╔██║█████╗  ███████║██║      ███████╗███████║███████║██████╔╝█████╗  
██║╚██╔╝██║██╔══╝  ██╔══██║██║      ╚════██║██╔══██║██╔══██║██╔══██╗██╔══╝  
██║ ╚═╝ ██║███████╗██║  ██║███████╗ ███████║██║  ██║██║  ██║██║  ██║███████╗
╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
```

### 🍽️ Smart Hostel Meal Management — QR-Powered, Role-Based, Real-Time

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://v0-mealshare-frontend-ui.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<br/>

</div>

---

## 📖 What is Meal-Share?

**Meal-Share** is a full-stack hostel meal management system that replaces paper slips and manual sign-offs with a seamless, QR-code-driven experience. Students opt in to meals (breakfast, lunch, snacks, dinner), receive QR codes, and staff scan them at the counter — all in real time.

> Built for hostel environments where meal tracking across floors and hundreds of students needs to be fast, transparent, and tamper-proof.

---

## ✨ Features

### 👤 For Students
- Secure sign up & login with JWT authentication
- Opt in / opt out of any meal for the day — **breakfast, lunch, snacks, dinner**
- QR code automatically generated and stored per meal slot
- Dashboard shows current meal status and redemption history
- Auto-reset of meal preferences every day at midnight

### 🧑‍🍳 For Staff
- Staff-specific login portal
- Scan or fetch QR codes filtered by **floor** and **meal time**
- Real-time redemption marking — prevents duplicate entries
- View all pending (unredeemed) QR codes at a glance

### 🛡️ For Admins
- Admin login with elevated privileges
- Manage all users across the system
- Enable / disable meal slots for individual students
- Full visibility into meal redemption state across floors

### 🌐 General
- 🌙 **Dark / Light theme** toggle
- 📱 Fully responsive — works on mobile, tablet, and desktop
- ⚡ Fast and reactive UI with real-time state updates
- 🔒 Role-based access control across Student / Staff / Admin portals

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui (New York style) |
| **UI Components** | Radix UI primitives |
| **Icons** | Lucide React |
| **Theming** | next-themes |
| **HTTP Client** | Axios |
| **Notifications** | Sonner |
| **Backend** | Node.js + Express |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT + bcryptjs |
| **Deployment** | Vercel (Frontend) |

---

## 🗂️ Project Structure

```
Meal-Share/
├── my-app/                     # Next.js Frontend
│   ├── app/
│   │   ├── page.tsx            # Landing / entry point
│   │   ├── login/              # Student login
│   │   ├── signup/             # Student registration
│   │   ├── admin-login/        # Admin portal entry
│   │   ├── staff-login/        # Staff portal entry
│   │   └── dashboard/
│   │       ├── page.tsx        # Student dashboard
│   │       ├── student-dashboard.tsx
│   │       ├── admin/          # Admin dashboard
│   │       └── staff/          # Staff dashboard
│   ├── components/
│   │   ├── auth-provider.tsx   # Authentication context
│   │   ├── theme-provider.tsx  # Dark/light mode
│   │   ├── theme-toggle.tsx
│   │   ├── logo.tsx
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/
│   │   └── use-toast.ts
│   └── lib/
│       └── utils.ts
│
└── server/                     # Express Backend
    ├── index.js                # App entry point
    ├── db/
    │   └── connectdb.js        # MongoDB connection
    ├── models/
    │   ├── User.js             # User schema (qrCode, qrStatus, floor)
    │   └── model.js
    └── routes/
        ├── auth.js             # Login / signup / JWT
        ├── user.js             # QR upload, fetch, meal time ops
        ├── staff.js            # QR scanning by floor & meal
        └── admin.js            # Admin user management
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** v18+
- **npm** or **yarn**
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/shashavali-8524/Meal-Share.git
cd Meal-Share
```

---

### 2️⃣ Set Up the Backend (Express Server)

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

Start the server:

```bash
node index.js
```

> The backend will be running at `http://localhost:5000`

---

### 3️⃣ Set Up the Frontend (Next.js App)

```bash
cd my-app
npm install
```

Create a `.env.local` file inside `my-app/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

> The frontend will be running at `http://localhost:3000`

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/signup` | Register a new student |
| `POST` | `/login` | Student login, returns JWT |
| `POST` | `/admin/login` | Admin login |
| `POST` | `/staff/login` | Staff login |

### User Routes — `/api/user`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/getQRCodeTime` | Get enabled meal slots for a user |
| `POST` | `/setQRCodeTime` | Enable a meal slot for today |
| `POST` | `/uploadQR` | Upload QR code binary for a user |
| `GET` | `/getQR` | Fetch stored QR code image |

### Staff Routes — `/api/staff`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/fetchQRsByTime` | Fetch & redeem a QR by meal time + floor |
| `GET` | `/availableQRs` | List all pending unredeemed QRs |

### Admin Routes — `/api/admin`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all registered users |
| `PUT` | `/user/:id` | Update a user's meal permissions |
| `DELETE` | `/user/:id` | Remove a user |

---

## 🎭 User Roles & Flow

```
Student                   Staff                     Admin
  │                          │                         │
  ├─ Sign Up / Login         ├─ Staff Login            ├─ Admin Login
  ├─ Select Meals for Day    ├─ Select Floor           ├─ View All Users
  ├─ Get QR Code             ├─ Select Meal Type       ├─ Enable/Disable
  ├─ Show QR at Counter ───► ├─ Scan / Fetch QR        │   Meal Slots
  └─ Meal Redeemed ✅        └─ Mark as Redeemed ✅    └─ Manage System
```

---

## 🌐 Deployment

The frontend is deployed on **Vercel**:

🔗 **[https://v0-mealshare-frontend-ui.vercel.app/](https://v0-mealshare-frontend-ui.vercel.app/)**

To deploy your own fork:

1. Push your frontend (`my-app/`) to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Set the root directory to `my-app`
4. Add your `NEXT_PUBLIC_API_URL` environment variable
5. Deploy 🚀

For the backend, you can deploy to:
- **Railway** — `railway up`
- **Render** — connect your GitHub repo
- **Fly.io** — `flyctl deploy`

---

## 🔮 Roadmap

- [ ] Email / SMS notifications when meals reset daily
- [ ] Meal analytics dashboard for admin (charts & trends)
- [ ] Printable QR code export as PDF
- [ ] Push notifications for meal window reminders
- [ ] Student meal history with calendar view
- [ ] Bulk meal import / export via CSV
- [ ] PWA support for offline QR display

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature-name`
5. **Open** a Pull Request

Please follow conventional commit messages and keep PRs focused on a single change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ by [shashavali](https://github.com/shashavali-8524)**

*If this project helped you, consider giving it a ⭐ on GitHub!*

</div>
