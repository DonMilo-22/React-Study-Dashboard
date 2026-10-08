# 🎓 React Study Dashboard

> A clean local-first dashboard for classes, tasks and study progress.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![LocalStorage](https://img.shields.io/badge/storage-localStorage-orange)

Study Dashboard is a small React app for keeping academic tasks visible without creating an account or configuring a backend.

## ✨ Features

- Add assignments with subject and due date
- Mark work as completed
- Filter all, pending and completed tasks
- Progress indicator
- Persistent browser storage
- Responsive interface
- Dark-friendly visual design

## 🚀 Quick start

```bash
npm install
npm run dev
```

Then open the local address shown by Vite.

## 🧠 How it works

React manages the task state while `localStorage` keeps your data after refreshing or reopening the browser. The dashboard derives progress and pending counts directly from the task list.

## 🧱 Structure

```text
src/
  App.jsx
  main.jsx
  styles.css
index.html
package.json
vite.config.js
```

## 🛠️ Requirements

Node.js 18+ and npm.

## 📦 Production build

```bash
npm run build
npm run preview
```

## 📄 License

MIT.


## 🆕 Recent changes

### 2026-10-07

- Added a dashboard stat for pending assignments due within the next seven days.

### 2026-10-06

- Added live search to filter assignments by title or subject.

### 2026-10-05

- Added a **Clear completed** action to remove all finished assignments at once.

### 2026-10-04

- Added an overdue label for pending assignments with a due date earlier than today.

### Previous update

- Assignments are now automatically ordered by due date, with undated tasks shown last.
