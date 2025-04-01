# ByWay E-Learning Platform - Backend API

_A robust and scalable e-learning platform_

## 🚀 Technologies Used

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB(Mongoose)
- **Authentication**: JWT & OAuth
- **Storage**: Cloudinary
- **Caching**: Redis
- **API Testing**: Postman
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

- User Endpoints

| Endpoint                          | Method | Description                         | Auth Required |
| --------------------------------- | ------ | ----------------------------------- | ------------- |
| /api/v1/registration              | POST   | User registration (Students, Admin) | No            |
| /api/v1/activate-user             | POST   | Account Activation                  | No            |
| /api/v1/login                     | POST   | User Login                          | No            |
| /api/v1/logout                    | GET    | User Signs Out                      | Yes           |
| /api/v1/refresh                   | GET    | Refresh tokens                      | Yes           |
| /api/v1/me                        | GET    | Fetch user details                  | Yes           |
| /api/v1/social-auth               | POST   | User Login (with social accounts)   | No            |
| /api/v1/update-user-info          | PUT    | Update User details                 | Yes           |
| /api/v1/update-user-password      | PUT    | Update User password                | Yes           |
| /api/v1/update-profile-picture    | PUT    | Update User Profile Picture         | Yes           |
| /api/v1//get-all-users            | GET    | Fetch all users                     | Yes (Admin)   |
| /api/v1/get-all-admins            | GET    | Fetch all admins                    | Yes (Admin)   |
| /api/v1/update-user-role          | PUT    | Update user roles                   | Yes (Admin)   |
| /api/v1/delete-user/:userId       | DELETE | Delete user account                 | Yes (Admin)   |
| /api/v1/update-user-videos-viewed | PUT    | Update viewed courses               | Yes           |
| /api/v1/get-users-latest          | GET    | User latest details                 | Yes           |

- Course Endpoints

| Endpoint                              | Method | Description                               | Auth Required |
| ------------------------------------- | ------ | ----------------------------------------- | ------------- |
| /api/v1/create-course                 | POST   | Upload Course (Admin)                     | Yes (Admin)   |
| /api/v1/edit-course/:course_id        | PUT    | Update Course (Admin)                     | Yes (Admin)   |
| /api/v1/get-course/:course_id         | GET    | Fetch a Course (not all details)          | No            |
| /api/v1/get-courses                   | GET    | Fetch all Courses (not all details)       | No            |
| /api/v1/get-course-content/:course_id | GET    | Fetch course data (Paid Users)            | Yes           |
| /api/v1/add-question                  | PUT    | Post question on a course (Paid Users)    | Yes           |
| /api/v1/add-answer                    | PUT    | Reply a question on a course (Paid Users) | Yes           |
| /api/v1/add-review/:course_id         | PUT    | Post a review (Paid Users)                | Yes           |
| /api/v1/add-reply-review              | PUT    | Reply a review (Admin)                    | Yes (Admin)   |
| /api/v1/get-all-courses               | GET    | Fetch all courses (Admin)                 | Yes (Admin)   |
| /api/v1/delete-course/:courseId       | DELETE | Delete a course (Admin)                   | Yes (Admin)   |

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
