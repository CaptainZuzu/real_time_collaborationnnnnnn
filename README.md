# Real-time Document Collaboration App

A full-stack application that enables real-time document collaboration with features like user authentication, document sharing, and live editing.

## Features

- 🔐 User Authentication (Register/Login)
- 📝 Create, Read, Update, Delete documents
- 👥 Real-time collaboration
- 🔒 Document sharing and permissions
- 📱 Responsive design
- ⚡ Real-time updates using Socket.IO

## Tech Stack

### Frontend
- React.js
- Vite
- Socket.IO Client
- TailwindCSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.IO
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/CaptainZuzu/real_time_collaborationnnnnnn.git
   cd real_time_collaborationnnnnnn
   ```

2. Install Frontend Dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install Backend Dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Create Environment Files:

   In the backend folder, create `.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/collab-docs
   JWT_SECRET=your-super-secret-key-change-this-in-production
   ```

5. Start MongoDB:
   - Make sure MongoDB is running on your system
   - Default port: 27017

6. Start the Backend Server:
   ```bash
   cd backend
   npm run dev
   ```
   The server will start on http://localhost:5000

7. Start the Frontend Server:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will start on http://localhost:5173

## API Documentation

The API documentation is available at http://localhost:5000/api/info when the backend server is running.

### Postman Collection
A Postman collection is included in the `backend` folder. Import `Real-time-Doc-Collab.postman_collection.json` into Postman to test the API endpoints.

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- React.js team for the amazing frontend framework
- MongoDB team for the powerful database
- Socket.IO team for real-time capabilities 