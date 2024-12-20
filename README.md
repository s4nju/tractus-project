# TractUs Project

## Description

This project is a simple web application that allows you to manage contracts.

## Technologies

- React
- TailwindCSS
- Zustand
- MSW
- Vite
- Shadcn UI
- Lucide Icons
- Zod
- React Hook Form

## Features

- Add, edit, delete and update contracts
- Sort contracts by client name and status
- Filter contracts by status
- Responsive design

## How to run

```bash
git clone https://github.com/s4nju/tractus-project.git
cd tractus-project
cp .env.example .env
pnpm install
```

### Run the project

```bash
pnpm run dev
```

### How to deploy

```bash
pnpm run build && pnpm run preview
```

NOTE: I have used MSW to mock the WebSocket connection. There is no backend server included in this project.
NOTE: We can change the delay of the name and status update in the .env file.
