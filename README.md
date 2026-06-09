# Gear-Up-Glam 🏍️

Motociklu piederumu e-veikals, veidots kā 3. kursa projekts. Sastāv no React frontenda un Node.js/Express backenda ar MySQL datubāzi.

---

## Projekta struktūra

```
3_kurss_projekts-main/
├── gear-up-glam-main/        # Frontend (React + Vite)
└── gear-up-glam-backend/     # Backend (Express + Prisma + MySQL)
```

---

## Tehnoloģiju steks

### Frontend
- **React 18** ar TypeScript
- **Vite** — build rīks
- **React Router v6** — navigācija
- **TanStack Query** — servera stāvokļa pārvaldība
- **Tailwind CSS** + **shadcn/ui** — UI komponentes
- **React Hook Form** + **Zod** — formu validācija

### Backend
- **Node.js** + **Express** — serveris
- **Prisma ORM** — datubāzes pārvaldība
- **MySQL** — datubāze
- **JWT** — autentifikācija
- **bcryptjs** — paroļu šifrēšana
- **Zod** — ievades validācija

---

## Uzstādīšana un palaišana

### Priekšnosacījumi

- Node.js >= 18
- MySQL serveris (ports `3307` vai maini `.env` failā)
- npm

---

### 1. Backend

```bash
cd gear-up-glam-backend
npm install
```

Izveido datubāzi MySQL:

```sql
CREATE DATABASE moto_shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Izveido `.env` failu no parauga:

```bash
cp .env.example .env
```

`.env` saturs:

```env
DATABASE_URL="mysql://root@localhost:3307/moto_shop"
JWT_SECRET="tava-slepena-atslega"
JWT_EXPIRY="7d"
PORT=3000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

Inicializē datubāzi un ielādē datus:

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

Palaid backend:

```bash
npm run dev
```

Backend strādā uz `http://localhost:3000`

---

### 2. Frontend

```bash
cd gear-up-glam-main
npm install
npm run dev
```

Frontend strādā uz `http://localhost:5173`

---

## API maršruti

| Metode | Maršruts | Apraksts | Autentifikācija |
|--------|----------|----------|-----------------|
| POST | `/api/auth/register` | Reģistrācija | — |
| POST | `/api/auth/login` | Ielogošanās | — |
| GET | `/api/products` | Visi produkti (ar filtriem) | — |
| GET | `/api/products/:id` | Viens produkts | — |
| POST | `/api/products` | Izveidot produktu | Admin |
| PUT | `/api/products/:id` | Labot produktu | Admin |
| DELETE | `/api/products/:id` | Dzēst produktu | Admin |
| GET | `/api/products/:id/reviews` | Produkta atsauksmes | — |
| POST | `/api/products/:id/reviews` | Pievienot atsauksmi | Lietotājs |
| GET | `/api/cart` | Skatīt grozu | Lietotājs |
| POST | `/api/cart` | Pievienot grozam | Lietotājs |
| DELETE | `/api/cart/:itemId` | Noņemt no groza | Lietotājs |
| GET | `/api/orders` | Pasūtījumu vēsture | Lietotājs |
| POST | `/api/orders` | Izveidot pasūtījumu | Lietotājs |
| GET | `/api/profile` | Profila dati | Lietotājs |
| PUT | `/api/profile` | Labot profilu | Lietotājs |
| GET | `/api/categories` | Visas kategorijas | — |
| GET | `/api/users` | Visi lietotāji | Admin |
| PUT | `/api/users/:id/role` | Mainīt lomu | Admin |
| PUT | `/api/users/:id/status` | Bloķēt/atbloķēt | Admin |

Veselības pārbaude: `GET /health`

---

## Datubāzes modeļi

- **User** — lietotāji ar lomām (`user` / `admin`) un bloķēšanas iespēju
- **Profile** — papildu info: vārds, avatars, piegādes adrese
- **Product** — produkti ar kategoriju, zīmolu, cenu, krājumiem un fitment datiem
- **Category** — produktu kategorijas
- **Order** / **OrderItem** — pasūtījumi un to pozīcijas
- **Payment** — maksājumu informācija
- **Cart** / **CartItem** — iepirkumu grozs
- **Review** — produktu atsauksmes ar vērtējumu

---

## Lapas (Frontend)

| Maršruts | Lapa |
|----------|------|
| `/` | Sākumlapa |
| `/shop` | Veikals ar filtriem |
| `/login` | Ielogošanās |
| `/signup` | Reģistrācija |
| `/history` | Pasūtījumu vēsture |
| `/about` | Par mums |
| `/contact` | Kontakti |
| `/admin` | Admin panelis |

---

## Noderīgas npm komandas

### Backend

```bash
npm run dev              # Palaid ar hot-reload
npm run build            # Kompilē TypeScript
npm run start            # Palaid production versiju
npm run prisma:studio    # Atvērt Prisma Studio (datubāzes UI)
npm run prisma:migrate   # Izveidot migrāciju
npm run prisma:seed      # Ielādēt testa datus
```

### Frontend

```bash
npm run dev              # Palaid izstrādes serveri
npm run build            # Izveidot production build
npm run preview          # Priekšskatīt production build
npm run test             # Palaist testus
```

---

## Problēmu novēršana

**MySQL savienojums nedarbojas?**
- Pārbaudi, vai MySQL serveris ir ieslēgts
- Pārbaudi portu `.env` failā (noklusējums: `3307`)

**CORS kļūda frontend?**
- Pārliecinies, ka `FRONTEND_URL` backend `.env` failā ir `http://localhost:5173`

**Prisma ģenerēšanas kļūda?**
- Izdzēs `node_modules/.prisma` mapi
- Palaid `npm run prisma:generate` atkārtoti
