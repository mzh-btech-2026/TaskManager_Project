Task Management System

A full-stack Task Management System built using Java, Spring Boot, React, and PostgreSQL.

About the Project

This is my first full-stack development project. I developed this application to practise Java backend development, REST API integration, database management, and frontend development.

The application allows users to create, view, update, search, filter, and manage tasks with different statuses and priorities.

Technology Stack
Backend
Java 21
Spring Boot 3
Spring Web
Spring Data JPA
Hibernate
PostgreSQL
Frontend
React
Vite
JavaScript ES6
HTML5
CSS3
JavaScript Fetch API
Development Tools
IntelliJ IDEA
VS Code
Postman
Git
GitHub
Features
Task Management
Create new tasks
View all active tasks
Update existing tasks
Manage task descriptions
Set task due dates
Task Status and Priority
Pending
In Progress
Completed
Low Priority
Medium Priority
High Priority
Advanced Task Operations
Search tasks by title
Filter tasks by status
Filter tasks by priority
Soft delete tasks
Permanently delete tasks
Database
PostgreSQL integration
Persistent task storage
Database operations using Spring Data JPA and Hibernate
Application Architecture
text
React Frontend
      |
      | Fetch API
      | HTTP / JSON
      |
Spring Boot Backend
      |
      | Controller
      | Service
      | Repository
      |
Spring Data JPA / Hibernate
      |
PostgreSQL Database

Project Structure
text
task-management-system/
│
├── task-manager-backend/
│
└── task-manager-frontend/

REST API Endpoints
Method	Endpoint	Description
GET	/api/tasks	Retrieve tasks
GET	/api/tasks/{id}	Retrieve task by ID
POST	/api/tasks	Create task
PUT	/api/tasks/{id}	Update task
DELETE	/api/tasks/{id}	Delete task

Additional endpoints may be used for searching, filtering, soft deletion, and permanent deletion depending on the backend implementation.

How to Run the Project
Backend
Clone the repository.
Open the backend project in IntelliJ IDEA.
Configure PostgreSQL credentials in application.properties.
Run the Spring Boot application.
Frontend
Open the frontend folder in VS Code.
Install dependencies:
bash
npm install

Start the React application:
bash
npm run dev

Learning Outcomes

Through this project, I practised:

Java Object-Oriented Programming
Spring Boot application development
REST API development
Controller-Service-Repository architecture
Spring Data JPA and Hibernate
PostgreSQL database integration
React components and hooks
Fetch API integration
CRUD operations
Soft delete and permanent delete
Search and filtering
Git and GitHub
Project Status

Completed – Week 1 Full-Stack Development Project.

Author

My first full-stack Java development project.
