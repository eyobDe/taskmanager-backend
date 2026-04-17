# TaskMaster Pro - Backend API

![Deployed on Railway](https://img.shields.io/badge/Deployed-Railway-black?logo=railway)

## Overview

A robust Node.js/Express backend API handling complex task dependencies, subtasks, and project management. Built with MongoDB and Mongoose for scalable data persistence.

## Live API

**Production URL**: `https://taskmanager-backend-production-049a.up.railway.app`

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Architecture**: RESTful API with embedded document design

## Key Architectural Decisions

### Embedded Dependency Arrays
Instead of complex SQL-style joins, we use Mongoose's embedded arrays for task dependencies and subtasks:

```javascript
// Task document structure
{
  title: "Task name",
  dependsOn: [
    { taskId: ObjectId, taskTitle: "Dependent task", is_completed: false }
  ],
  subtasks: [ObjectId] // Array of subtask IDs
}
```

### Optimized Dashboard Query
The dashboard endpoint enforces a strict "≤3 Query" limit using targeted Mongoose `.populate()`:

```javascript
// Single query with strategic population
const user = await User.findById(userId)
  .populate({
    path: 'projects',
    populate: {
      path: 'tasks',
      populate: {
        path: 'dependsOn.taskId',
        select: 'title is_completed'
      }
    }
  });
```

## API Endpoints

### User & Dashboard
| Method | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/users/:id/dashboard` | Fetch user's projects with populated tasks and dependencies |

### Projects
| Method | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/projects` | Create new project |
| `GET` | `/api/projects/:id` | Get specific project |

### Tasks
| Method | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/tasks` | Create new task with dependencies |
| `PUT` | `/api/tasks/:id/complete` | Mark task as complete (validates dependencies) |
| `GET` | `/api/tasks/:id` | Get specific task |

### Subtasks
| Method | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/api/tasks/:taskId/subtasks` | Create subtask for a task |
| `PUT` | `/api/tasks/subtasks/:subtaskId/complete` | Mark subtask as complete |

## Request/Response Examples

### Create Task
```bash
POST /api/tasks
Content-Type: application/json

{
  "title": "Complete user authentication",
  "project_id": "60d5ecb8b392d700153ee123",
  "assignee_id": "60d5ecb8b392d700153ee123",
  "due_date": "2024-12-31",
  "dependency_ids": ["60d5ecb8b392d700153ee124"]
}
```

### Complete Task
```bash
PUT /api/tasks/60d5ecb8b392d700153ee123/complete
```

Response:
```json
{
  "id": "60d5ecb8b392d700153ee123",
  "title": "Complete user authentication",
  "is_completed": true,
  "unblocked_task_ids": ["60d5ecb8b392d700153ee125"],
  "unblocked_task_titles": ["Deploy to production"]
}
```

## Local Development Setup

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskmanager-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create `.env` file in root:
   ```env
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/taskmanager
   # or MongoDB Atlas: MONGO_URI=mongodb+srv://...

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Database Seeding (Optional)**
   Populate initial data:
   ```bash
   npm run seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3000`

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── projectController.js
│   ├── taskController.js
│   └── userController.js
├── models/              # Mongoose schemas
│   ├── Project.js
│   ├── Task.js
│   ├── Subtask.js
│   └── User.js
├── middleware/          # Express middleware
│   └── errorHandler.js
├── config/             # Database configuration
│   └── database.js
└── routes/             # API routes
    ├── projects.js
    ├── tasks.js
    └── users.js
```

## Key Features

- **Circular Dependency Detection**: Prevents infinite dependency loops
- **Atomic Operations**: All updates are atomic to prevent data corruption
- **Optimistic Updates**: Frontend receives immediate feedback
- **Dependency Validation**: Backend enforces completion rules
- **Error Handling**: Comprehensive error responses with proper HTTP status codes

## Deployment

The application is deployed on Railway with automatic scaling and zero-downtime deployments.

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
