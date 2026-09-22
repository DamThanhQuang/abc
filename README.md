# Ánh Sáng Toàn Cầu

Website giới thiệu sản phẩm và quản lý nội dung cho công ty thiết bị đo lường nhiên liệu. Xây dựng bằng Next.js 16, Prisma, PostgreSQL, và NextAuth v5.

Hướng dẫn triển khai đã rà soát theo cấu hình thực tế: [DEPLOYMENT_PRODUCTION.md](./DEPLOYMENT_PRODUCTION.md). Đọc tài liệu này trước khi đưa lên Vercel; các lệnh `db:push` bên dưới chỉ dành cho thử nghiệm local.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database ORM**: Prisma 7 + Supabase PostgreSQL
- **Auth**: NextAuth v5 (Auth.js)
- **Email**: Resend
- **Object storage**: Cloudflare R2
- **Distributed rate limit**: Upstash Redis
- **UI**: Tailwind CSS v4 + shadcn/ui + Base UI
- **Language**: TypeScript

## Tính năng

- Trang public: Giới thiệu, Sản phẩm, Tin tức, Liên hệ
- Admin panel: Quản lý sản phẩm, tin tức, yêu cầu liên hệ
- Xác thực admin bằng email/password (bcrypt)
- Gửi email với Resend

## Yêu cầu

- Node.js 24
- PostgreSQL (hoặc Supabase / Neon)
- npm / yarn / pnpm

## Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/DamThanhQuang/abc.git
cd abc
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

Sao chép file `.env.example` thành `.env` và điền thông tin:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
# Supabase transaction pooler (runtime) and direct/session URL (migrations)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require"

# Auth.js secret — tạo bằng: openssl rand -base64 32
AUTH_SECRET="your-random-secret-here"
AUTH_URL="http://localhost:3000"

# Resend API key (https://resend.com → API Keys)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
ADMIN_EMAIL="admin@astc.com.vn"

# Distributed rate limit (required in production)
UPSTASH_REDIS_REST_URL="https://...upstash.io"
UPSTASH_REDIS_REST_TOKEN="..."

# Cloudflare R2
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="..."
R2_PUBLIC_URL="https://images.astc.com.vn"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### 4. Khởi tạo database

```bash
# Tạo bảng từ schema Prisma
npm run db:push

# Seed dữ liệu mẫu (tạo tài khoản admin mặc định)
npm run db:seed
```

### 5. Chạy ứng dụng

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem trang public.

Trang admin: [http://localhost:3000/dang-nhap](http://localhost:3000/dang-nhap)

## Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy môi trường development |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build production |
| `npm run lint` | Kiểm tra lỗi ESLint |
| `npm run db:push` | Đồng bộ schema Prisma lên database |
| `npm run db:migrate` | Tạo migration mới |
| `npm run db:seed` | Seed dữ liệu mẫu |
| `npm run db:studio` | Mở Prisma Studio (quản lý DB trực quan) |

## Cấu trúc thư mục

```
src/
├── app/
│   ├── (admin)/admin/      # Admin panel (sản phẩm, tin tức, yêu cầu)
│   ├── (public)/           # Trang public (giới thiệu, sản phẩm, tin tức, liên hệ)
│   ├── api/auth/           # NextAuth API routes
│   └── dang-nhap/          # Trang đăng nhập admin
├── components/
│   ├── admin/              # Components cho admin panel
│   └── public/             # Components cho trang public
├── lib/                    # Utilities (prisma client, auth config, v.v.)
├── config/                 # Cấu hình site
└── types/                  # TypeScript types
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed script
```

## Deploy

### Vercel (khuyến nghị)

1. Push code lên GitHub
2. Import project tại [vercel.com/new](https://vercel.com/new)
3. Chọn Node.js 24 và thêm các biến trong `.env.example` vào Vercel Dashboard
4. Đặt `NEXT_PUBLIC_APP_URL=https://astc.com.vn`
5. Chạy `npm run db:deploy` một lần với `DIRECT_URL`, sau đó deploy

### Tự host

```bash
npm run build
npm run start
```

## Lưu ý

- File `.env` chứa thông tin nhạy cảm — **không commit** lên git
- Sau khi thay đổi `schema.prisma`, chạy `npm run db:push` hoặc `npm run db:migrate`
- Tài khoản admin mặc định được tạo bởi `npm run db:seed` — đổi mật khẩu sau khi deploy
