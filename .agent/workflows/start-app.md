---
description: Start the Full Stack Application (DB, Backend, Frontend)
---

1. Start Database
```bash
docker-compose up -d
```

2. Start Backend
```bash
cd apps/backend
npx prisma generate
// turbo
start npx nest start
```

3. Start Frontend
```bash
cd apps/frontend
// turbo
start npm run dev
```
