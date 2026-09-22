# Triển khai production: astc.com.vn

Rà soát ngày 22/09/2026. Tên miền chính đã được xác nhận: **astc.com.vn**, không phải atsc.com.vn.

## 1. Kết quả kiểm tra thực tế

| Hạng mục | Kết quả |
| --- | --- |
| Supabase runtime / migration | Kết nối được transaction pooler 6543 và session pooler 5432, Singapore |
| Schema | Có đủ 6 bảng ứng dụng; cả 6 bật RLS |
| Migration | 0001_init, 0002_product_images, 0003_enable_rls đã hoàn tất |
| Admin | Đã có 1 tài khoản; không cần seed lại |
| R2 | Xác thực được bucket, đọc danh sách mẫu và HEAD ảnh public trả HTTP 200, image/webp, immutable cache |
| Ảnh đang lưu trong DB | 5 tham chiếu ảnh dùng r2.dev; cần đổi origin trước khi tắt địa chỉ cũ |
| TLS database | URL local chưa yêu cầu TLS. Thử verify-full trên Node 20 và 24 đều lỗi SELF_SIGNED_CERT_IN_CHAIN; cần CA đúng từ dashboard |
| Upstash | Chưa có hai biến Redis trong .env; production cần chúng để đăng nhập, gửi liên hệ, upload |
| URL ứng dụng | .env vẫn dùng localhost; production cần https://astc.com.vn |
| Email | Chưa cấu hình Resend; liên hệ vẫn lưu DB nhưng không gửi thông báo mail |
| Runtime máy local | Node mặc định 20; đã chạy build bằng Node 24 qua npm exec |

Các kiểm tra cloud chỉ đọc, không ghi/xóa object hay sửa database. Chưa xác minh quyền PUT/DELETE R2, custom domain/SSL/DNS, backup theo gói, token scope trong dashboard, Upstash hoặc Resend production. Không có deployment Vercel được tạo trong lượt này. Kết nối database thành công không có nghĩa cấu hình production đã hoàn tất.

Đã sửa trong mã: redirect thêm www cho cả 5 domain, giới hạn upload thống nhất 3 MiB, trả 400 khi trường file là text, bảo vệ thêm các file .env.*, kiểm tra cấu hình production chặt hơn, hỗ trợ CA database, bổ sung migration_lock.toml, đặt region Vercel sin1.

## 2. Kiến trúc cần triển khai

- Một Vercel project, tên miền chính https://astc.com.vn.
- 4 domain phụ và 5 bản www cùng vào project, redirect 308 về domain chính.
- Supabase PostgreSQL tại Singapore; Next.js chạy server Node.js và Prisma, không dùng Supabase Auth hay client Data API.
- R2 cùng bucket hiện tại, domain ảnh https://images.cotbom.vn.
- Upstash Redis phục vụ rate limit dùng chung giữa các Vercel Functions.
- Resend tùy chọn cho thông báo có yêu cầu liên hệ mới.

Website doanh nghiệp nên dùng Vercel Pro: Hobby được quy định dành cho cá nhân/phi thương mại. Xem [điều khoản Vercel](https://vercel.com/legal/terms). Chọn gói Supabase có backup và khả năng phục hồi đáp ứng yêu cầu kinh doanh; kiểm tra trực tiếp khả năng backup/PITR trong project trước khi mở web.

## 3. Chuẩn bị code và Node

Repo Git hiện tại có root tại C:\abc\fuelprecision. Mở terminal ở thư mục đó.

```powershell
cd C:\abc\fuelprecision
nvm install 24
nvm use 24
node --version
npm --version
```

Kỳ vọng Node 24.x, npm 11.x như package.json và .nvmrc. Nếu npm chưa là 11, cài npm 11 trong bản Node 24 đang chọn. Việc chạy nvm use trên Windows có thể cần quyền quản trị của máy.

```powershell
npm ci
npm test
npm run lint
npm run typecheck
```

`postinstall` đã chạy prisma generate. Giữ package-lock.json trong Git để Vercel cài đúng dependency. Lockfile đã có thay đổi từ trước lượt rà soát này; hãy review cùng phần code cần đưa lên. Không commit file .env thật. Hướng dẫn này đặt ở root vì thư mục docs đang bị .gitignore bỏ qua.

## 4. Supabase: connection, TLS và migration

### 4.1. Connection URL

Trong Supabase project → Connect, sao chép đúng chuỗi từ dashboard:

```dotenv
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD_URL_ENCODED@POOLER_HOST:6543/postgres?pgbouncer=true&sslmode=verify-full"
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD_URL_ENCODED@POOLER_HOST:5432/postgres?sslmode=require&sslaccept=strict"
```

DATABASE_URL dùng cho ứng dụng. DIRECT_URL dùng session pooler 5432 để chạy migration trên IPv4; direct db.PROJECT_REF.supabase.co thường cần IPv6 nếu chưa mua IPv4 add-on. Không tự suy ra host từ tên region. Mật khẩu trong URL phải percent-encode ký tự đặc biệt như @, #, ?, / và %. [Hướng dẫn connection của Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres).

PrismaPg đang giới hạn pool mỗi instance bằng max=1, timeout kết nối 10 giây. Không tăng pool tùy tiện khi chưa đo tải. vercel.json đặt sin1 gần Supabase Singapore.

### 4.2. CA certificate — cần làm với project hiện tại

1. Supabase → Database Settings → SSL Configuration → tải CA certificate.
2. Mở file chứng chỉ bằng editor. Copy nguyên khối từ BEGIN CERTIFICATE đến END CERTIFICATE.
3. Thêm DATABASE_SSL_CA vào .env local và Vercel Production. Trong Vercel paste nguyên PEM nhiều dòng, không bọc thêm dấu ngoặc kép. Trong .env có thể viết chuỗi nhiều dòng trong dấu ngoặc kép hoặc dùng ký tự \n.
4. Dùng hai URL ở bước 4.1.
5. Chạy kiểm tra bên dưới, kỳ vọng `client TLS=true; certificate verified=true` ở cả hai kết nối.

```powershell
node scripts/check-cloud.mjs --verify-tls
```

Helper database-config.mjs truyền CA vào node-postgres và giữ rejectUnauthorized=true. prisma.config.ts tạo một file CA tạm để migration engine dùng sslcert + sslaccept=strict. File tạm chỉ chứa chứng chỉ CA công khai.

Nếu vẫn lỗi, tải lại CA đúng project và kiểm tra đường truyền TLS của máy. Không khắc phục bằng NODE_TLS_REJECT_UNAUTHORIZED=0 hoặc tắt xác minh chứng chỉ. Kết quả TLS đã kiểm tra trong lần rà soát là lỗi khi chưa có CA; hỗ trợ CA mới chỉ được kiểm tra bằng test cấu hình, chưa có chứng chỉ dashboard để xác nhận end-to-end.

Sau khi mọi client cần thiết đã kết nối TLS thành công, bật **Enforce SSL on incoming connections** trong Supabase. Thao tác này có thể restart DB ngắn, nên thực hiện trước khi mở web hoặc vào thời gian bảo trì. [Supabase SSL enforcement](https://supabase.com/docs/guides/platform/ssl-enforcement).

### 4.3. RLS và Data API

Ứng dụng dùng Prisma qua server; không cần SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY hoặc cấu hình Supabase Auth redirect. Nếu project không có ứng dụng khác sử dụng Data API, tắt Data API trong API Settings theo [hướng dẫn Prisma của Supabase](https://supabase.com/docs/guides/database/prisma).

RLS đã bật trên 6 bảng. Role kết nối hiện có BYPASSRLS; RLS bảo vệ truy cập qua role anon/authenticated, không thay thế auth guard của Next.js và không bảo vệ khi chính mật khẩu DB bị lộ. Admin và ContactRequest phải không có policy cho phép anon/authenticated đọc hoặc ghi. Đối chiếu policy trong dashboard hoặc output `node scripts/check-cloud.mjs`.

### 4.4. Migration và admin

Sau khi cấu hình CA, kiểm tra trước:

```powershell
npx prisma migrate status
```

Project đang có đủ 3 migration. Chỉ khi có migration còn thiếu hoặc khi dùng DB mới, chạy:

```powershell
npm run db:deploy
```

Không dùng db:push, migrate dev hoặc migrate reset trên DB thật. Không gắn migrate deploy vào mọi Preview build. Khi cập nhật schema, chạy migration production theo một bước có kiểm soát trước khi phát hành code cần schema mới.

Project hiện đã có admin. Với DB mới hoàn toàn, đặt ADMIN_SEED_EMAIL và ADMIN_SEED_PASSWORD trong môi trường quản trị local rồi chạy `npm run db:seed` một lần. Seed chỉ tạo admin khi bảng trống; không reset mật khẩu admin hiện có. Dùng mật khẩu riêng đủ mạnh, không đưa ADMIN_SEED_PASSWORD vào Vercel runtime.

## 5. Cloudflare R2

Quyết định: domain ảnh dùng **images.cotbom.vn**, không dùng subdomain của domain chính. Lý do: R2 Custom Domain yêu cầu zone nằm trong Cloudflare account ("The domain being used must have been added as a zone in the same account as the R2 bucket"). Cách giữ nguyên DNS provider cũ là partial/CNAME setup, nhưng Cloudflare chỉ mở cho Business/Enterprise plan. Vì vậy hy sinh một domain phụ thay vì chuyển nameserver của astc.com.vn.

1. Giữ bucket chứa ảnh hiện tại để không phải copy object.
2. Add site `cotbom.vn` vào Cloudflare (Free plan), rồi đổi nameserver tại Mắt Bão sang cặp NS Cloudflare cấp. Kiểm tra ngày 22/09/2026: zone cotbom.vn tại Mắt Bão **trống hoàn toàn** — không A, MX, TXT, không cả www — nên không có dịch vụ nào bị gián đoạn. Nếu sau này zone đã có bản ghi, phải chép đủ MX/TXT/SPF/DKIM/DMARC sang Cloudflare *trước* khi đổi NS.
3. Cloudflare → R2 → bucket → Settings → Custom Domains → Add domain → images.cotbom.vn. Bản ghi này do R2 tự tạo và tự quản lý certificate; không tự thêm tay.
4. Chờ custom domain Active và certificate hoạt động. Mở một ảnh hiện có qua https://images.cotbom.vn/uploads/KEY.webp, kỳ vọng HTTP 200.
5. Tạo R2 API token với Object Read & Write, giới hạn đúng bucket. Lấy Access Key ID và Secret Access Key; không nhầm chúng với Cloudflare API token thông thường.
6. Vercel đặt R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME và R2_PUBLIC_URL=https://images.cotbom.vn.

Các credential R2 là biến server, không dùng tiền tố NEXT_PUBLIC_. Domain images phục vụ ảnh công khai; không lưu tài liệu riêng tư trong bucket public này. [R2 public bucket/custom domain](https://developers.cloudflare.com/r2/buckets/public-buckets/), [quyền API token](https://developers.cloudflare.com/r2/api/tokens/).

Upload hiện đi browser → /api/upload trên Vercel → R2. Vì vậy không cần mở CORS PUT của R2 cho browser. Hiển thị ảnh bằng img/Next Image cũng không yêu cầu CORS PUT. Chỉ thêm CORS cụ thể nếu sau này chuyển sang browser upload/presigned URL hoặc đọc ảnh bằng canvas. [R2 CORS](https://developers.cloudflare.com/r2/buckets/cors/).

### Đổi URL ảnh cũ trước khi tắt r2.dev

Đổi R2_PUBLIC_URL chỉ ảnh hưởng ảnh upload mới và hostname được Next Image cho phép. Ảnh cũ còn URL trong DB sẽ lỗi sau khi chỉ cho phép domain mới. Script dưới đây xử lý Product.image/images/description, Category.image/description và NewsArticle.image/content.

1. Tạo backup database và xác nhận có thể phục hồi.
2. Xác nhận cùng object đã truy cập được qua domain images.
3. Chạy dry run. Thay OLD_R2_HOST bằng host trong R2_PUBLIC_URL cũ, không nhập dấu <>.

```powershell
node scripts/migrate-image-origin.mjs --from https://OLD_R2_HOST.r2.dev --to https://images.cotbom.vn
```

Script chỉ in số dòng sẽ đổi, không in dữ liệu khách hàng. Nếu đúng, tạm dừng chỉnh sửa nội dung trong admin rồi chạy bản ghi dữ liệu:

```powershell
node scripts/migrate-image-origin.mjs --from https://OLD_R2_HOST.r2.dev --to https://images.cotbom.vn --apply
```

Script chạy trong transaction và cập nhật updatedAt; không copy/xóa object. Chỉ chạy --apply sau khi backup và domain mới đã sẵn sàng. Đặt R2_PUBLIC_URL mới và redeploy ngay sau chuyển URL để cập nhật cache trang và image allowlist. Kiểm tra ảnh chính, gallery, danh mục, bài viết và ảnh trong nội dung. Khi tất cả đã dùng domain mới, tắt Public Development URL r2.dev. Script đã được chuẩn bị; lượt rà soát này không chạy --apply.

Upload giới hạn file gửi tới server ở 3 MiB, để còn chỗ cho multipart dưới giới hạn payload 4.5 MB của Vercel. Browser nén ảnh trước khi gửi; server xác thực magic bytes và tối ưu WebP tối đa 1.5 MiB. [Giới hạn Vercel Functions](https://vercel.com/docs/functions/limitations).

## 6. Upstash Redis và email

Tạo một Redis database cho production trong Upstash; chọn Singapore hoặc region gần Vercel/Supabase nếu có. Copy REST URL và REST token, không lấy nhầm redis:// URL hoặc token chỉ đọc. Đặt UPSTASH_REDIS_REST_URL và UPSTASH_REDIS_REST_TOKEN trong Vercel Production.

Ở NODE_ENV=production, ứng dụng cần Redis khi login, liên hệ, upload. Thiếu cấu hình hoặc lỗi được trả về từ Redis có thể khiến thao tác bị từ chối. Preview cũng chạy NODE_ENV=production nên cần Redis riêng; không dựa vào bộ đếm memory dùng khi dev.

Nếu cần mail thông báo: thêm domain gửi trong Resend, cấu hình DNS đúng các bản ghi Resend cung cấp, chờ Verified, tạo API key rồi đặt RESEND_API_KEY, ADMIN_EMAIL và EMAIL_FROM. Ví dụ EMAIL_FROM=`Ánh Sáng Toàn Cầu <no-reply@astc.com.vn>`. ADMIN_EMAIL phải là hộp thư nhận thật. Không xóa MX email hiện tại để cấu hình web. Nếu chưa cần mail, để RESEND_API_KEY trống; yêu cầu liên hệ vẫn lưu trong admin.

## 7. Tạo Vercel project và biến môi trường

Đưa code đã review lên Git provider đang dùng. Vercel → Add New → Project → Import repository.

| Cài đặt | Giá trị |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | `.` nếu package.json nằm ở root repo như repo local hiện tại; `fuelprecision` chỉ khi repo remote thực sự chứa thư mục con này |
| Node.js Version | 24.x |
| Install Command | npm ci |
| Build Command | npm run build |
| Output Directory | Giữ mặc định Next.js, không đặt out |
| Production Branch | Branch bạn thực sự phát hành, thường là main |
| Functions Region | sin1 qua vercel.json |

Không dùng static export: web có admin, server actions, API upload và database. Node 24 được Vercel hỗ trợ; engines trong package.json cũng ràng buộc version. [Node trên Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

Trước Deploy, vào Settings → Environment Variables, chọn scope Production. Nhập giá trị thật, không copy dấu ngoặc kép của cú pháp .env vào ô Value.

| Biến | Giá trị / nguồn |
| --- | --- |
| DATABASE_URL | Supabase transaction pooler 6543, sslmode=verify-full |
| DATABASE_SSL_CA | Nguyên PEM tải từ Supabase SSL Configuration |
| AUTH_SECRET | Secret ngẫu nhiên riêng cho production, tối thiểu 32 ký tự |
| AUTH_TRUST_HOST | true |
| AUTH_URL | Có thể bỏ để Auth.js tự nhận Vercel; nếu đặt, dùng https://astc.com.vn |
| NEXT_PUBLIC_APP_URL | https://astc.com.vn |
| R2_ACCOUNT_ID | Cloudflare account ID |
| R2_ACCESS_KEY_ID | Access Key ID của token R2 đúng bucket |
| R2_SECRET_ACCESS_KEY | Secret Access Key tương ứng |
| R2_BUCKET_NAME | Bucket đang chứa ảnh |
| R2_PUBLIC_URL | https://images.cotbom.vn |
| UPSTASH_REDIS_REST_URL | URL https REST của Redis production |
| UPSTASH_REDIS_REST_TOKEN | REST token có quyền ghi |
| RESEND_API_KEY | Tùy chọn |
| ADMIN_EMAIL | Email nhận thông báo thật, cần nếu bật Resend |
| EMAIL_FROM | Sender thuộc domain đã xác minh, cần nếu bật Resend |
| NEXT_PUBLIC_PHONE_DISPLAY | Số điện thoại hiển thị mong muốn |
| NEXT_PUBLIC_ZALO_ID | Số Zalo không có dấu chấm |

DIRECT_URL chỉ cần trên máy/quy trình chạy migration; không cần đưa lên Vercel nếu build chỉ generate và next build như hiện tại. Không đặt ADMIN_SEED_PASSWORD trên Vercel. Không tự đặt NODE_ENV hay VERCEL_ENV trong dashboard.

Tạo AUTH_SECRET bằng terminal trên máy mình:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"
```

Sau khi thay biến môi trường, tạo deployment mới. NEXT_PUBLIC_* và R2 image allowlist được dùng khi build; thay Value mà không redeploy chưa cập nhật bản đang chạy. [Vercel environment variables](https://vercel.com/docs/environment-variables).

Production build sẽ bị chặn nếu thiếu các biến bắt buộc, dùng localhost cho auth, domain chính sai, R2 còn r2.dev/API endpoint, hoặc database không yêu cầu TLS. Gate kiểm tra hình dạng cấu hình, không thay thế phép kiểm tra kết nối dịch vụ thật.

## 8. Preview / staging

Dùng Supabase project hoặc database staging, R2 bucket staging, Redis staging và AUTH_SECRET riêng cho Preview. Không cấp credential production cho PR không tin cậy. Đặt NEXT_PUBLIC_APP_URL của Preview theo một hostname staging cố định và AUTH_URL tương ứng, hoặc để Auth.js tự nhận deployment URL. Preview vẫn cần biến ứng dụng dù prebuild chỉ bắt buộc trên VERCEL_ENV=production.

Bật Deployment Protection cho Preview trong Vercel; kiểm tra response X-Robots-Tag noindex của preview và không submit sitemap preview. Bản production dùng domain chính và không được khóa đối với khách truy cập. Không dùng một Preview URL để quản trị database thật.

## 9. Gắn 5 domain và DNS

Trong Vercel Settings → Domains, thêm 10 hostname sau vào cùng production project:

| Domain | Cách phục vụ |
| --- | --- |
| astc.com.vn | Domain chính, phục vụ website |
| www.astc.com.vn | Redirect 308 → astc.com.vn |
| cotbom.com.vn và www.cotbom.com.vn | Redirect 308 → astc.com.vn |
| cotbom.vn và www.cotbom.vn | Redirect 308 → astc.com.vn |
| mayxangdau.vn và www.mayxangdau.vn | Redirect 308 → astc.com.vn |
| mayxangdau.com và www.mayxangdau.com | Redirect 308 → astc.com.vn |

next.config.ts đã thực hiện redirect theo host. Không chọn thêm redirect Vercel từ astc.com.vn sang www, vì chiều đó sẽ tạo vòng lặp. Có thể để các hostname phụ gắn production rồi để mã redirect; không cần tạo thêm rule Cloudflare trùng lặp.

DNS provider sau khi triển khai không đồng nhất — nhớ vào đúng chỗ:

| Domain | DNS quản lý ở | Ghi chú |
| --- | --- | --- |
| astc.com.vn | Mắt Bão | Giữ nguyên nameserver hiện tại |
| cotbom.com.vn | Mắt Bão | Giữ nguyên |
| **cotbom.vn** | **Cloudflare** | Đã đổi NS ở mục 5 để dùng cho images.cotbom.vn |
| mayxangdau.vn | Mắt Bão | Giữ nguyên |
| mayxangdau.com | Mắt Bão | Giữ nguyên |

Ở DNS provider của từng domain, nhập đúng record Vercel hiển thị cho chính project của bạn:

- Apex `@`: loại và giá trị theo Vercel; thường là A.
- `www`: CNAME theo Vercel.
- TXT xác minh quyền sở hữu nếu Vercel yêu cầu.
- Xử lý A/AAAA/CNAME cũ xung đột của đúng hostname web; giữ nguyên MX/TXT cho email.

Không dùng IP/CNAME từ một hướng dẫn cũ làm giá trị mặc định. Với Cloudflare DNS, để các record web trỏ Vercel ở DNS only trong lúc cấu hình. images.cotbom.vn do chức năng R2 Custom Domain quản lý, không trỏ sang Vercel. Nếu domain có CAA hạn chế, điều chỉnh theo thông báo certificate của Vercel.

Chờ Vercel báo Valid Configuration và HTTPS hoạt động cho cả 10 hostname. HTTPS của domain phụ vẫn cần certificate dù chỉ redirect. [Thêm domain Vercel](https://vercel.com/docs/domains/working-with-domains/add-a-domain).

Ví dụ kiểm tra bằng PowerShell:

```powershell
curl.exe -I "https://cotbom.vn/san-pham?category=may-bom"
curl.exe -I "https://www.astc.com.vn/tin-tuc"
curl.exe -I "https://astc.com.vn"
```

Domain phụ kỳ vọng 308 với Location giữ path/query trên https://astc.com.vn. Domain chính không redirect ngược về www. Kiểm tra các domain phụ còn lại theo cùng cách, cả HTTP và HTTPS.

## 10. Kiểm tra trước khi mở website

1. Chạy `node scripts/check-cloud.mjs --verify-tls` với cấu hình production trên máy quản trị: database TLS + certificate verified đều true, 6 bảng RLS, migration hoàn tất, ảnh public HTTP 200.
2. Deployment Vercel Ready; xem build log và function log, không có lỗi Prisma, Redis, chứng chỉ hay thiếu biến môi trường.
3. Trang chủ, danh sách/chi tiết sản phẩm, tìm kiếm, bộ lọc, tin tức và ảnh cũ hoạt động; sitemap.xml và canonical/OG dùng astc.com.vn.
4. Khách chưa đăng nhập vào /admin phải chuyển tới /dang-nhap; gọi upload không có session phải bị từ chối.
5. Đăng nhập admin, tạo một nội dung thử, upload ảnh và lưu. Xác minh ảnh mới có domain images và nội dung public đúng trạng thái published; xóa nội dung thử khi xong.
6. Gửi một liên hệ thử, thấy nó trong admin; nếu bật email thì xác nhận mail đến đúng hộp thư. Quan sát Redis/log để xác nhận rate limit đang dùng dịch vụ thật.
7. Kiểm tra toàn bộ redirect domain và HTTPS, không vòng lặp, không mất path/query.
8. Xác nhận backup DB, giới hạn chi tiêu Vercel/Supabase/R2/Upstash và người nhận cảnh báo. Chỉ tắt r2.dev sau khi ảnh cũ đã chuyển xong.
9. Thêm Domain Property astc.com.vn trong Google Search Console, xác minh DNS và submit https://astc.com.vn/sitemap.xml.

Build local thành công không kiểm chứng bước 4–8 trên hạ tầng Vercel thật. Không bỏ qua smoke test sau deploy.

## 11. Lỗi thường gặp và rollback

| Triệu chứng | Kiểm tra |
| --- | --- |
| SELF_SIGNED_CERT_IN_CHAIN | CA đúng project, nguyên PEM, DATABASE_SSL_CA, redeploy |
| P1001 / timeout | URL/username/password đúng từ Connect, đúng port, project không pause, mạng tới pooler |
| Đăng nhập / liên hệ / upload báo không xác minh được giới hạn | Hai biến Upstash, token quyền ghi, region và log |
| Ảnh cũ lỗi, ảnh mới được | URL còn r2.dev trong DB, migrate origin và redeploy |
| Ảnh HTTP 400 từ Next Image | R2_PUBLIC_URL ở thời điểm build và hostname ảnh trong DB không khớp |
| Upload 413 | Request vượt giới hạn Vercel; browser phải nén ảnh trước khi gửi |
| Upload 403 từ R2 | Token đúng bucket và Object Read & Write; review token scope |
| Auth callback quay về localhost | Gỡ AUTH_URL local khỏi Production rồi redeploy |
| Domain redirect vòng lặp | Gỡ chiều astc → www hoặc rule Cloudflare/Vercel trái với next.config.ts |
| Form lưu nhưng không có mail | RESEND_API_KEY, sender verified, log Resend, ADMIN_EMAIL |

Nếu bản code mới lỗi, rollback/redeploy deployment Vercel tốt trước đó. Rollback Vercel không tự khôi phục database hoặc URL ảnh. Với lần chuyển origin ảnh, giữ domain cũ hoạt động trong giai đoạn kiểm tra; có thể dùng script đổi ngược origin sau khi review hoặc phục hồi backup phù hợp. Không reset schema để xử lý lỗi triển khai.
