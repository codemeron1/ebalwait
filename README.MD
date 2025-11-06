# EbalWait - Employee Evaluation System

E-Balwait is a web-based evaluation tool intended for students enrolled in the System Integration and Architecture 2 course. It allows group members to assess each other's performance and contribution to their project in a structured and fair manner.

## 🚀 Features

- **User Authentication & Authorization**: Secure login system with role-based access
- **Multi-Role Support**: Team Manager, Lead Programmer, API Tester, Documentation Specialist, API Programmer
- **Interactive Evaluation Forms**: Comprehensive rating questionnaires with criteria-based scoring
- **Real-time Dashboard**: Home page with pending evaluations and evaluation summaries
- **Results & Analytics**: Detailed evaluation results with data visualization
- **Dark/Light Mode**: Modern UI with theme toggle functionality
- **Mobile Responsive**: Optimized for desktop and mobile devices
- **Account Management**: User settings and profile management

## 🏗️ Architecture

### Frontend (Evaluator)
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.x
- **Routing**: React Router DOM
- **HTTP Client**: Axios

### Backend (Server)
- **Runtime**: Node.js with Express
- **Database**: Firebase Firestore
- **Authentication**: JWT with bcrypt password hashing
- **CORS**: Enabled for cross-origin requests

## 📦 Project Structure

```
ebalwait/
├── evaluator/          # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Application pages/routes
│   │   ├── context/    # React context providers
│   │   └── types/      # TypeScript type definitions
│   └── public/         # Static assets
├── server/             # Node.js backend API
│   ├── datasets/       # JSON data files (roles, criteria)
│   ├── types/          # Backend type definitions
│   └── utils/          # Utility functions
└── README.md          # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codemeron1/ebalwait.git
   cd ebalwait
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Firebase**
   - Add your Firebase configuration to `fbKey.json`
   - Update Firebase settings in `firebase.js`

4. **Setup Frontend**
   ```bash
   cd ../evaluator
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   The API server will run on `http://localhost:3000` (or configured port)

2. **Start the Frontend Development Server**
   ```bash
   cd evaluator
   npm run dev
   ```
   The React app will run on `http://localhost:5173`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the server directory:
```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Firebase Setup
1. Create a Firebase project
2. Enable Firestore database
3. Generate service account key and save as `server/fbKey.json`
4. Update Firebase configuration in `server/firebase.js`

## 🎯 Usage

1. **Login/Register**: Access the system through the authentication pages
2. **Dashboard**: View pending evaluations and summaries on the home page
3. **Evaluations**: Complete rating questionnaires for team members
4. **Results**: Review evaluation results and analytics
5. **Settings**: Manage account settings and preferences

## 🛠️ Development

### Frontend Development
```bash
cd evaluator
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd server
npm start            # Start server
npm test             # Run tests (when available)
```

## 🚀 Deployment

### Frontend (Vercel)
The project includes `vercel.json` configuration for easy deployment to Vercel.

### Backend
Deploy to your preferred Node.js hosting platform (Heroku, Railway, DigitalOcean, etc.)

## 📈 Roadmap

Current development priorities (see `roadmap.md` for detailed progress):
- ✅ Dark mode theme implementation
- ✅ Mobile responsiveness
- ✅ Authentication system
- ✅ Evaluation result pages
- ✅ Settings page with account management
- 🔄 Backend token persistence
- 📋 Enhanced evaluation criteria
- 📊 Advanced analytics and reporting

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Review the documentation and roadmap
- Check the development progress in `roadmap.md`
