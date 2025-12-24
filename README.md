# Next.js Application

This is a [Next.js](https://nextjs.org) project bootstrapped with
[`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## Prerequisites

- **Node.js**: v20 (LTS)
- **npm**: Required for installing dependencies and running migrations
- **Database**: SQLite3

---

## Getting Started

### Install Dependencies

```bash
npm install
```

---

### Run Database Migrations (Optional)

If your project includes migration scripts, install `tsx` (optional but recommended):

```bash
npm install tsx
```

Run the migration script defined in `package.json`:

```bash
npm run migrate
```

---

### Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open your browser and visit:

```
http://localhost:3000
```

You can start editing the app by modifying:

```
app/page.tsx
```

The page will automatically update as you save changes.

---

## Fonts & Optimization

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
to automatically optimize and load the **Geist** font from Vercel.

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js GitHub Repository](https://github.com/vercel/next.js)

---

## Build for Production

Generate a production-ready build:

```bash
npm run build
```

---

## Deployment on Cloud (Using PM2)

### Install PM2

```bash
npm install -g pm2
```

---

### Start the Application

```bash
pm2 start npm --name <app-name> -- run start
```

Replace `<app-name>` with your desired application name.

---

## Notes

- Ensure **Node.js v20 LTS** is installed on the server
- Run database migrations before starting the app in production
- PM2 is recommended for managing the Node.js process in production
