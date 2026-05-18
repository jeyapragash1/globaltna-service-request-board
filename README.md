# Mini Service Request Board

A full-stack web application

This platform allows homeowners to create service requests while tradespeople can browse requests, view details, update statuses, and manage jobs.

---

## Tech Stack

### Frontend
- Next.js (App Router)
- Tailwind CSS

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

---

## Features

### Core Features
- Create service requests
- View all jobs
- Filter jobs by category
- Filter jobs by status
- View single job details
- Update job status
- Delete jobs

### Bonus Features
- Keyword search across title and description

---

## Project Structure

```bash
globaltna-service-board/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│
├── frontend/
│   ├── app/
│   │   ├── jobs/
│   │   └── page.js