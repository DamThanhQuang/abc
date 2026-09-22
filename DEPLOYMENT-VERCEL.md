# Triển khai production lên Vercel

Tài liệu này dành cho website Ánh Sáng Toàn Cầu với domain chính
`https://astc.com.vn`. Không đưa giá trị secret thật vào Git, ticket hoặc ảnh chụp
màn hình.

## 1. Đưa mã nguồn lên GitHub

Kiểm tra thay đổi rồi commit lên nhánh `main`:

```powershell
git status
git diff --check
npm run lint
npm run typecheck
npm test
npm run build
git add .
git commit -m "Prepare production deployment"
git push origin main
```

Không commit file `.env`. File này đã được Git ignore.

## 2. Chuẩn bị Supabase

1. Tạo backup trước khi thay đổi schema hoặc URL ảnh.
2. Trong Supabase Dashboard, mở **Connect**.
3. Sao chép **Transaction pooler** (port `6543`) làm `DATABASE_URL`.
4. Sao chép **Session pooler** (port `5432`) làm `DIRECT_URL`. Session pooler
   thường phù hợp hơn direct host nếu máy chạy migration không có IPv6.
5. Giữ `sslmode=require`; URL-encode mật khẩu nếu chứa ký tự đặc biệt.
6. Trong `.env` cục bộ, đặt `ADMIN_SEED_EMAIL` và một
   `ADMIN_SEED_PASSWORD` mạnh, duy nhất, dài ít nhất 10 ký tự.
7. Kiểm tra trạng thái rồi áp dụng migration. Dùng `db:deploy`, không dùng
   `db:push` trên production:

```powershell
npx prisma migrate status
npm run db:deploy
npm run db:seed
```

`db:seed` chỉ tạo admin nếu bảng `Admin` đang trống. Sau khi seed xong, xóa
`ADMIN_SEED_PASSWORD` khỏi máy nếu không còn cần.

## 3. Chuẩn bị Cloudflare R2

1. Tạo hoặc chọn bucket production.
2. Tạo S3 API token chỉ có quyền **Object Read & Write** trên đúng bucket.
3. Ghi lại `Account ID`, `Access Key ID`, `Secret Access Key`, tên bucket.
4. Trong **R2 > bucket > Settings > Custom Domains**, kết nối
   `images.astc.com.vn` và đợi trạng thái **Active**.
5. Domain dùng cho R2 phải nằm trong Cloudflare zone cùng account với bucket.
   Nếu dùng Cloudflare làm DNS cho `astc.com.vn`, để Cloudflare tạo record R2;
   các record website trỏ Vercel nên để **DNS only**.
6. Đặt `R2_PUBLIC_URL=https://images.astc.com.vn`.
7. Khi custom domain đã chạy và URL cũ không còn trong database, tắt public
   development URL `r2.dev`.

Kiểm tra URL ảnh cũ trước khi tắt `r2.dev`:

```sql
SELECT id, image FROM "Product" WHERE image LIKE '%r2.dev%';
SELECT id, image FROM "NewsArticle" WHERE image LIKE '%r2.dev%';
SELECT id, image FROM "Category" WHERE image LIKE '%r2.dev%';
SELECT id, images FROM "Product"
WHERE EXISTS (SELECT 1 FROM unnest(images) AS item WHERE item LIKE '%r2.dev%');
```

Nếu có kết quả, backup database rồi thay đúng origin cũ bằng
`https://images.astc.com.vn`, hoặc tải lại ảnh qua admin. Không dùng một regex
chung có thể vô tình sửa URL ảnh thuộc nhà cung cấp khác.

Upload đi từ server Vercel sang R2, nên browser CORS không cần thiết cho luồng
hiện tại.

## 4. Tạo Upstash Redis

1. Tạo Redis database ở region gần Singapore, hoặc cài Upstash Integration
   trực tiếp trong Vercel.
2. Liên kết database với project Vercel.
3. Xác nhận hai biến sau xuất hiện cho cả Production và Preview:
   `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

Production dùng Redis này để rate-limit đăng nhập, gửi liên hệ và upload. Nếu
thiếu Redis hoặc Redis lỗi, các thao tác trên sẽ fail-closed.

## 5. Cấu hình Resend (tùy chọn)

Nếu muốn nhận email khi có liên hệ mới:

1. Verify domain hoặc subdomain gửi mail trong Resend bằng các DNS record Resend
   cung cấp.
2. Tạo API key chỉ có quyền **Sending access**, giới hạn vào domain đó.
3. Chuẩn bị `RESEND_API_KEY`, `ADMIN_EMAIL`, `EMAIL_FROM`.
4. `EMAIL_FROM` phải dùng domain đã verify, ví dụ
   `Ánh Sáng Toàn Cầu <no-reply@astc.com.vn>`.

Nếu không dùng email, bỏ trống cả ba biến; yêu cầu liên hệ vẫn được lưu vào DB.

## 6. Import project vào Vercel

1. Vào **Add New > Project**, import GitHub repository và chọn nhánh production
   là `main`.
2. Root Directory: `.`.
3. Framework Preset: **Next.js**.
4. Node.js Version: **24.x**.
5. Giữ cấu hình build mặc định:
   - Install Command: mặc định (`npm install`).
   - Build Command: `npm run build`.
   - Output Directory: mặc định của Next.js; không nhập `out`.
6. Trong **Settings > Functions**, chọn region **Singapore (`sin1`)** nếu
   Supabase project đang ở Singapore.
7. Trong **Settings > Deployment Protection**, chọn **Vercel Authentication +
   Standard Protection** để bảo vệ Preview/deployment URL nhưng vẫn cho domain
   production công khai.

## 7. Environment Variables trên Vercel

### Production — bắt buộc

```text
AUTH_SECRET
DATABASE_URL
NEXT_PUBLIC_APP_URL
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_PUBLIC_URL
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Quy tắc:

- `NEXT_PUBLIC_APP_URL` phải đúng `https://astc.com.vn`, không có path.
- `DATABASE_URL` dùng Supavisor transaction pooler port `6543`.
- `AUTH_SECRET` là chuỗi ngẫu nhiên ít nhất 32 ký tự. Có thể tạo bằng
  `openssl rand -base64 33`.
- Không đặt `AUTH_URL` trên Vercel; Auth.js v5 suy ra host từ request/Vercel.
- Có thể đặt `AUTH_TRUST_HOST=true`, dù Auth.js tự nhận diện Vercel.
- Không đặt `DIRECT_URL` trên Vercel nếu migration chỉ chạy từ máy quản trị.
- Không đặt `ADMIN_SEED_PASSWORD` trên Vercel.

### Production — theo tính năng

```text
NEXT_PUBLIC_PHONE_DISPLAY
NEXT_PUBLIC_ZALO_ID
RESEND_API_KEY
ADMIN_EMAIL
EMAIL_FROM
```

Ba biến Resend phải cùng có hoặc cùng bỏ. Sau khi thay đổi env, phải redeploy vì
Vercel không áp biến mới vào deployment cũ.

### Preview

Preview cũng chạy với `NODE_ENV=production`, nên cần `AUTH_SECRET`, Upstash và
các biến DB/R2. An toàn nhất là dùng Supabase/R2/Upstash staging riêng. Nếu tạm
dùng production resources, bật Standard Protection, không seed lại và không thử
CRUD/upload trên Preview. Giữ `NEXT_PUBLIC_APP_URL=https://astc.com.vn` để
canonical luôn trỏ domain chính.

## 8. Deploy lần đầu

1. Nhấn **Deploy** sau khi đã nhập env.
2. Prebuild gate sẽ chủ động fail nếu thiếu biến bắt buộc, DB còn trỏ localhost,
   canonical sai, `AUTH_SECRET` quá ngắn hoặc R2 còn dùng `r2.dev`.
3. Khi build xong, kiểm tra deployment log không có lỗi Prisma, Auth.js, R2 hoặc
   Upstash.
4. Mở URL Vercel tạm và kiểm tra trang chủ, sản phẩm, tin tức, liên hệ và đăng
   nhập admin trước khi gắn DNS production.

## 9. Domains và DNS

Thêm các domain sau vào **Project > Settings > Domains**:

```text
astc.com.vn
cotbom.com.vn
cotbom.vn
mayxangdau.vn
mayxangdau.com
```

Nên thêm cả `www.astc.com.vn` và các `www` domain phụ nếu người dùng có thể truy
cập chúng.

1. Đặt `astc.com.vn` làm production domain chính.
2. Với từng domain phụ, chọn **Edit > Redirect to > astc.com.vn**.
3. Với `www.astc.com.vn`, cũng redirect về `astc.com.vn`.
4. Tại DNS provider/registrar, tạo chính xác record Vercel đang hiển thị cho từng
   domain. Không đoán hoặc dùng IP từ hướng dẫn cũ.
5. Xóa record A/AAAA/CNAME cũ bị trùng host. Nếu DNS ở Cloudflare, để record
   website ở **DNS only** trong lúc verify Vercel.
6. Chờ tất cả domain trong Vercel hiện **Valid Configuration** và chứng chỉ SSL
   active.

Source code cũng có redirect 308 dự phòng cho bốn apex domain phụ và giữ nguyên
path/query. Redirect ở Vercel vẫn nên được cấu hình vì chạy trước application.

## 10. Kiểm tra sau deploy

Chạy các lệnh sau:

```powershell
curl.exe -I https://astc.com.vn
curl.exe -I https://astc.com.vn/admin
curl.exe -I https://astc.com.vn/robots.txt
curl.exe -I https://astc.com.vn/sitemap.xml
curl.exe -I https://cotbom.vn/san-pham?category=test
curl.exe -I https://mayxangdau.com/tin-tuc
```

Kỳ vọng:

- Domain chính trả `200`.
- `/admin` chưa đăng nhập redirect về `/dang-nhap`.
- Domain phụ trả `308` đến đúng path trên `https://astc.com.vn`.
- Có HSTS, CSP, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`.
- `robots.txt` trỏ sitemap của `astc.com.vn`; sitemap chỉ chứa domain chính.
- HTML có canonical của `astc.com.vn`; `/admin` và `/dang-nhap` là `noindex`.

Sau đó kiểm tra bằng trình duyệt:

1. Đăng nhập bằng admin đã seed; kiểm tra cookie session có `Secure`,
   `HttpOnly`, `SameSite=Lax`.
2. Tạo/sửa/xóa một bản ghi thử có kiểm soát rồi xóa dữ liệu thử.
3. Upload JPEG/PNG/WebP/AVIF dưới 4,5 MB; URL trả về phải thuộc
   `images.astc.com.vn` và ảnh hiển thị được.
4. Gửi form liên hệ; kiểm tra bản ghi ở admin và email Resend nếu đã bật.
5. Kiểm tra Vercel Runtime Logs và Supabase Logs không có lỗi connection limit.
6. Gửi sitemap trong Google Search Console cho property `https://astc.com.vn`.

## 11. Rollback

Nếu lỗi ứng dụng, dùng **Vercel > Deployments > Promote/Rollback** về deployment
ổn định trước đó. Rollback code không tự rollback database; vì vậy migration
production phải tương thích ngược hoặc có kế hoạch database rollback/restore
riêng.
