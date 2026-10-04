# restAPI_task
This project is a Full-Stack Task Management Application designed with a pragmatic, developer-first approach. It combines a robust REST API backend with an interactive React frontend, built with production-grade tooling and strict data validation.
# Task Manager REST API & Frontend

A lightweight, full-stack Task Management application built with **Node.js, Express, TypeScript, Prisma (PostgreSQL)**, and **React**.

## Features

- **Full Task CRUD**: Create, read, update, and delete tasks.
- **Task Properties**: Title, description, status (`TODO`, `IN_PROGRESS`, `DONE`), due date.
- **Filtering**: Filter tasks by status.
- **Validation**: Strict request validation using Zod with structured error messages.
- **Database**: PostgreSQL managed via Prisma ORM.
- **Automated Tests**: Integration tests built with Jest and Supertest.
- **Frontend**: Clean React interface with task board, table view, and filter controls.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database instance

### 1. Environment Setup
Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb?schema=public"
