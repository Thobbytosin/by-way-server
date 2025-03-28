# ByWay E-Learning Platform - Backend API

_A robust and scalable e-learning platform_

## 🚀 Technologies Used

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB(Mongoose)
- **Authentication**: JWT & OAuth
- **Storage**: Cloudinary
- **Caching**: Redis
- **Payment Integration**: Stripe
- **Environment Management**: Dotenv

## 📦 Key Features

- User registration & authentication (Students, Instructors, Admins)
- Course creation, enrollment, and management
- Secure payment processing for courses
- Review and rating system for courses
- Real-time notifications & messaging
- Video content management (Cloudinary)
- High-performance caching with Redis

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Thobbytosin/by-way-server.git
   cd ecommerce-learning-backend
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Setup**
   ```bash
   Create .env file based on .env.example
   ```
4. **Run the server**
   ```bash
   npm start
   (development mode): npm run dev
   ```

## 📡 API Endpoints

| Endpoint                   | Method | Description                               | Auth Required |
| -------------------------- | ------ | ----------------------------------------- | ------------- |
| /api/v1/signup             | POST   | User registration (Students, Instructors) | No            |
| /api/v1/login              | POST   | User Login                                | No            |
| /api/v1/courses            | GET    | Fetch all available courses               | No            |
| /api/v1/courses/:id        | GET    | Fetch course details                      | No            |
| /api/v1/courses            | POST   | Create a new course (Instructors)         | Yes           |
| /api/v1/courses/:id/enroll | POST   | Enroll in a course (Students)             | Yes           |
| /api/v1/payments           | POST   | Process course payment                    | Yes           |
| /api/v1/reviews            | POST   | Submit a course review                    | Yes           |

## 🤝 Contributing

- Fork the project
- Create your feature branch (git checkout -b feature/AmazingFeature)
- Commit your changes (git commit -m 'Add some AmazingFeature')
- Push to the branch (git push origin feature/AmazingFeature)
- Open a Pull Request

## 📜 License

Distributed under the MIT License. See LICENSE for more information.

## 📬 Contact

Project Maintainer - Falode Tobi  
Project Link: https://github.com/Thobbytosin/by-way-server.git
