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

<<<<<<< HEAD
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
=======
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

This project use node version 20 LTS and sqlite3 Database. npm is must to execute the migration file

# Steps to run this project
```
npm install # install node package
```

### Installing tsx package to execute migration file (Optional)
```
npm install tsx 
```


### Running the migartion script define in package.json file
```
npm run migarte
```

### Starting the project in developer environment or use can also use pnpm to run.
```
npm run dev
```




>>>>>>> e71d9498a0ffdf18f6a5c3f0d08a74f18e19cc27
