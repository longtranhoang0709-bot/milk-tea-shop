# Milk Tea Shop (Next.js + Express + MySQL)

## Giới thiệu

Dự án xây dựng website bán trà sữa online sử dụng:

* Frontend: Next.js
* Backend: Express (Node.js)
* Database: MySQL + Prisma ORM

---

# Công nghệ sử dụng

## Frontend

* Next.js
* Tailwind CSS
* Axios
* Zustand
* React Hot Toast

## Backend

* Express.js
* Prisma ORM
* MySQL
* dotenv
* cors
* nodemon

---

# Cài đặt dự án

# FRONTEND SETUP

## Cài dependencies

cd frontend
npm install

## Cài thêm thư viện

npm install axios
npm install zustand
npm install react-hot-toast

## Chạy frontend

npm run dev

# BACKEND SETUP

## Cài dependencies

cd backend
npm install

## Cài thêm thư viện

npm install express cors dotenv
npm install prisma --save-dev
npm install @prisma/client
npm install nodemon --save-dev

---
# PRISMA SETUP

## Khởi tạo 

npx prisma init


## Sync database

npx prisma db pull

## Generate Prisma Client

npx prisma generate

---

# Chạy backend

npm run dev

