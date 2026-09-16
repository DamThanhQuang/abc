# Production Readiness Audit

- Repository: `C:\abc\fuelprecision`
- Commit được audit: `a867efb`
- Ngày tổng hợp: 2026-09-14
- Phạm vi: public/admin routes, authentication, Server Actions, upload, Prisma queries, schema/seed, cấu hình và frontend liên quan.
- Không sửa source code, không chạy seed/migration, không ghi database trong quá trình audit. File này tổng hợp kết quả audit đã thực hiện, không phải một lần kiểm tra mới.

Quy ước:

- **Confirmed:** xác nhận từ implementation; một số có kiểm tra cô lập bằng mock.
- **Potential risk:** code có điều kiện gây sự cố nhưng chưa tái hiện trên deployment thật.
- **Not verified:** thiếu bằng chứng hoặc chưa kiểm tra được trong môi trường audit.

Các đường dẫn dưới đây tính từ root repository. Số dòng tham chiếu source tại thời điểm audit. README/documentation không được dùng làm bằng chứng implementation.

## Verdict

**NOT READY**

Có lỗ hổng kiểm soát quyền tại các thao tác quản trị, đường dẫn stored XSS, upload không xác thực, đăng xuất không hủy session và vấn đề cache có thể khiến admin bỏ sót yêu cầu khách hàng.

Nếu deploy lên Vercel, cơ chế upload filesystem hiện tại cũng cần thay đổi trước khi phát hành.

## Score

**35/100**

| Nhóm | Điểm |
|---|---:|
| Security / Authentication / Authorization | 5/30 |
| Database / Data Safety | 8/20 |
| Reliability / Deployment | 6/20 |
| Performance / Scalability | 9/15 |
| Testing / Type Safety / Frontend Quality | 7/15 |
| **Tổng** | **35/100** |

Đây là điểm đánh giá kỹ thuật theo bằng chứng repository, không phải tỷ lệ xác suất hệ thống hoạt động ổn định.

## Deployment Blockers

| ID | Severity | Phải xử lý trước Production |
|---|---|---|
| F01 | CRITICAL | Kiểm tra authentication/authorization trong mọi mutation quản trị. |
| F02 | CRITICAL | Chặn stored XSS trong nội dung bài viết và JSON-LD. |
| F03 | CRITICAL | Bảo vệ upload; không tin MIME/extension do client cung cấp. |
| F04 | HIGH | Loại bỏ mật khẩu seed mặc định và log password; kiểm tra tài khoản đã bootstrap. |
| F05 | BLOCKER nếu deploy Vercel | Thay upload filesystem bằng storage bền vững. |
| F06 | HIGH | Không cho public đọc sản phẩm/bài viết chưa published. |
| F07 | HIGH | Sửa đăng xuất để thực sự hủy session. |
| F08 | HIGH | Chống brute force, spam contact và lạm dụng upload. |
| F09 | HIGH | Bỏ cache dữ liệu admin và bảo đảm contact mới xuất hiện ngay. |
| F10 | HIGH | Có migration baseline và quy trình deploy database đã kiểm chứng. |

Ngoài ra, cần hoàn thành clean build, kiểm tra dependency và smoke test trên môi trường tương đương Production trước khi thông qua deployment.

## Critical & High Risks

### F01 — CRITICAL — Mutation quản trị không kiểm tra quyền

**Trạng thái: Confirmed.**

**Bằng chứng:**

- `src/lib/actions/products.ts:9,34,64`: tạo/sửa/xóa sản phẩm.
- `src/lib/actions/news.ts:9,24,39`: tạo/sửa/xóa bài viết.
- `src/lib/actions/categories.ts:9,24,39`: tạo/sửa/xóa danh mục.
- `src/lib/actions/contacts.ts:38,57`: đổi trạng thái/xóa contact.
- `src/middleware.ts:18`: middleware chỉ match `/admin/:path*`.

**Nguyên nhân:** các action kiểm tra dữ liệu bằng Zod rồi gọi Prisma, không gọi `auth()` hoặc kiểm tra admin. `"use server"` không tự cấp cơ chế kiểm soát quyền. Next.js yêu cầu bảo vệ Server Actions như endpoint public: [Next.js Data Security](https://nextjs.org/docs/app/guides/data-security).

**Kiểm tra:** thực thi `createArticle` với Prisma/cache được mock, không có session, vẫn nhận `success: true` và một lần gọi ghi database. Đây là kiểm tra implementation, chưa phải khai thác HTTP end-to-end.

**Ảnh hưởng:** mutation được expose có thể bị gọi ngoài luồng giao diện dự kiến; nguy cơ sửa/xóa nội dung, phá dữ liệu và kết hợp với F02.

**Khắc phục:** tạo guard kiểm tra session và admin còn hợp lệ; gọi trong từng action và tại nơi đọc dữ liệu nhạy cảm. Middleware chỉ làm lớp điều hướng bổ sung.

### F02 — CRITICAL — Stored XSS qua HTML bài viết và JSON-LD

**Trạng thái: Confirmed về đường truyền dữ liệu không an toàn; chưa chạy payload trên browser Production.**

**Bằng chứng:**

- `src/lib/validations.ts:39`: `content: z.string().optional()`.
- `src/lib/actions/news.ts:14`: lưu trực tiếp dữ liệu đã parse.
- `src/app/(public)/tin-tuc/[slug]/page.tsx:113`: `dangerouslySetInnerHTML={{ __html: article.content }}`.
- `src/app/(public)/tin-tuc/[slug]/page.tsx:61` và `src/app/(public)/san-pham/[slug]/page.tsx:46`: chèn `JSON.stringify(jsonLd)` trực tiếp vào `<script>`.

**Nguyên nhân:** không có sanitization server-side. Kiểm tra cô lập xác nhận schema nhận HTML chứa event-handler attribute. Tiptap trên client không bảo vệ request gọi trực tiếp. JSON serialization không tự loại chuỗi đóng thẻ `</script>` trong dữ liệu: [Next.js JSON-LD](https://nextjs.org/docs/app/guides/json-ld).

**Ảnh hưởng:** thực thi JavaScript trong origin website, sửa giao diện, phishing và thực hiện request với quyền người đang đăng nhập.

**Khắc phục:** sanitize HTML theo allowlist ở server; giới hạn URL/protocol; serialize JSON-LD an toàn, escape `<` thành `\u003c`. Thêm CSP như lớp phòng vệ bổ sung.

### F03 — CRITICAL — Upload không xác thực, chấp nhận nội dung giả MIME

**Trạng thái: Confirmed.**

**Bằng chứng:** `src/app/api/upload/route.ts:8–35`.

- Không kiểm tra session trong `POST` dòng 10.
- Dòng 19 chỉ tin `file.type`.
- Dòng 27 lấy extension từ tên file client.
- Dòng 33 ghi nguyên bytes.
- Cho phép SVG tại dòng 8.
- Parse toàn bộ multipart trước khi kiểm tra kích thước.

**Kiểm tra:** gửi `File` tên `audit.html`, MIME `image/png`, nội dung HTML vô hại vào handler với filesystem được mock. Handler trả 200, URL kết thúc `.html`, và gọi `writeFile`. Không tạo file thật.

**Ảnh hưởng:** người ngoài có thể yêu cầu ghi nội dung tùy ý; tiêu hao RAM/storage. Nếu các file được phục vụ cùng origin, HTML/SVG chủ động tạo thêm đường XSS/phishing. Khả năng phục vụ file mới phụ thuộc deployment.

**Khắc phục:** bắt buộc admin; kiểm tra `File` thực sự; xác minh/decode định dạng ảnh; sinh extension từ định dạng đã xác thực; chặn hoặc sanitize SVG; giới hạn request trước khi buffer; quota/rate limit; phục vụ media qua origin riêng.

### F04 — HIGH — Seed có password mặc định và in password ra log

**Trạng thái: Confirmed trong code; trạng thái tài khoản Production: Not verified.**

**Bằng chứng:** `prisma/seed.ts:12,23,342`; `upsert` có `update: {}` tại dòng 16.

**Nguyên nhân:** seed dùng password fallback cố định, email admin cố định và `console.log(... + password)`.

**Ảnh hưởng:** bootstrap thiếu biến môi trường tạo tài khoản dễ đoán; log CI/terminal có thể chứa password thật. Chạy seed lại với password mới không đổi password tài khoản đã tồn tại.

**Khắc phục:** bắt buộc password mạnh khi bootstrap, không có fallback, không log password; tách bootstrap admin khỏi seed demo. Nếu đã dùng seed, kiểm tra/đổi credential qua quy trình riêng.

### F05 — BLOCKER khi deploy Vercel — Upload phụ thuộc filesystem ứng dụng

**Trạng thái: Confirmed về implementation; lỗi deployment thực tế: Not verified.**

**Bằng chứng:** `src/app/api/upload/route.ts:6,30–35`.

**Nguyên nhân:** file được ghi vào `process.cwd()/public/uploads`, trả URL tương đối. Không có R2 SDK/service hoặc cơ chế lưu object storage trong source.

**Ảnh hưởng:** filesystem của function không phải nơi lưu media bền vững; ghi vào vùng read-only có thể thất bại. Đổi sang `/tmp` không giải quyết persistence: [Phản hồi hỗ trợ Vercel](https://github.com/vercel/community/discussions/314). Trên nhiều instance/container, file local có nguy cơ không đồng bộ hoặc mất khi redeploy.

**Khắc phục:** upload sang R2 hoặc storage tương đương, lưu object key/URL trong database; kiểm chứng upload và truy xuất sau redeploy.

### F06 — HIGH — Public đọc được nội dung chưa published

**Trạng thái: Confirmed.**

**Bằng chứng:**

- `src/lib/api/products.ts:92–97`: tìm theo `slug`, không có `published: true`.
- `src/lib/api/news.ts:38–42`: cùng lỗi.
- Các trang chi tiết và `generateMetadata` sử dụng trực tiếp hai hàm này.

**Ảnh hưởng:** biết slug có thể đọc bản nháp/nội dung đã ẩn; metadata cũng có thể tiết lộ nội dung. Lọc danh sách và sitemap không bảo vệ trang chi tiết.

**Khắc phục:** truy vấn public bắt buộc `published: true`; API preview riêng phải có auth. Nếu hỗ trợ hẹn giờ, kiểm tra thêm thời điểm xuất bản.

### F07 — HIGH — “Đăng xuất” không hủy session

**Trạng thái: Confirmed.**

**Bằng chứng:**

- `src/config/admin-nav.ts:17`: “Đăng xuất” trỏ tới `/dang-nhap`.
- `src/components/admin/layout/AdminSidebar.tsx:35`: render thành `<Link>`.
- `src/lib/actions/auth.ts:26`: action `logout()` có tồn tại nhưng UI không gọi.

**Ảnh hưởng:** người dùng nghĩ đã đăng xuất nhưng cookie còn hiệu lực; người dùng tiếp theo trên cùng browser có thể quay lại admin.

**Khắc phục:** nối nút logout với `signOut`/action hiện có, kiểm chứng cookie bị xóa và `/admin` yêu cầu đăng nhập lại.

### F08 — HIGH — Không có chống lạm dụng ở các điểm tốn tài nguyên

**Trạng thái: Confirmed trong application; WAF bên ngoài: Not verified.**

**Bằng chứng:**

- `src/lib/auth.ts:26–35`: tra database và bcrypt khi login.
- `src/lib/actions/contacts.ts:11–27`: mỗi request hợp lệ tạo contact và có thể gửi email.
- `src/app/api/upload/route.ts:10–33`: parse/ghi upload.

**Nguyên nhân:** không có rate limit, quota hoặc kiểm tra bot trong các luồng này.

**Ảnh hưởng:** brute force tài khoản admin, spam database/email, tăng chi phí và cạn tài nguyên.

**Khắc phục:** giới hạn login theo IP và tài khoản; contact theo IP/quota kèm chống bot phù hợp; upload theo admin và dung lượng. Với nhiều instance cần bộ đếm dùng chung hoặc enforcement ở gateway.

### F09 — HIGH — Admin bị prerender/cache; contact mới không invalidation

**Trạng thái: Confirmed trong code và artifact có sẵn; chưa clean-build lại.**

**Bằng chứng:**

- `src/app/(admin)/layout.tsx:3`: không đọc session/request.
- `src/app/(admin)/admin/page.tsx:69` và `src/app/(admin)/admin/yeu-cau/page.tsx:20`: đọc database nhưng không ép dynamic.
- `src/lib/actions/contacts.ts:16`: tạo contact nhưng không revalidate admin.
- `.next/prerender-manifest.json`: `/admin`, `/admin/yeu-cau` và nhiều trang admin có `initialRevalidateSeconds: false`.

Artifact này hỗ trợ kết luận về lần build trước, không thay thế kiểm tra build hiện tại.

**Ảnh hưởng:** admin có thể nhìn snapshot cũ và bỏ sót lead mới; dữ liệu contact nằm trong artifact prerender. Chưa có bằng chứng người chưa đăng nhập đọc được artifact qua HTTP.

**Khắc phục:** kiểm tra auth tại server, render admin động, không cache dữ liệu quản trị; kiểm tra response cache headers và luồng contact → dashboard trên production build.

### F10 — HIGH — Chưa có migration có thể tái lập database Production

**Trạng thái: Confirmed về thiếu artifact/quy trình trong repository.**

**Bằng chứng:**

- `prisma.config.ts:8–10`: cấu hình `prisma/migrations`.
- Repository chỉ có `prisma/schema.prisma` và `prisma/seed.ts`, không có migration SQL.
- `package.json:10–13`: có `db push`, `migrate dev`; không có bước production migration trong script/pipeline được tìm thấy.

**Ảnh hưởng:** chưa thể dựng schema Production từ lịch sử migration đã review; dễ lệch schema hoặc dùng nhầm lệnh development khi release.

**Khắc phục:** tạo baseline phù hợp với database thực tế; review SQL; kiểm thử trên database staging mới và bản sao dữ liệu; deploy bằng migration đã phê duyệt, kèm backup/restore.

Không tìm thấy migration phá dữ liệu để kết luận đã có thao tác destructive.

### F11 — HIGH — JWT không được thu hồi khi admin bị xóa hoặc credential thay đổi

**Trạng thái: Confirmed về cơ chế; sự cố token bị đánh cắp là Potential risk.**

**Bằng chứng:** `src/lib/auth.ts:15,43–49`; `src/middleware.ts:7`.

**Nguyên nhân:** JWT lưu ID; khi đọc session không kiểm tra admin còn tồn tại, trạng thái khóa hoặc token version. Middleware chỉ kiểm tra có `auth.user`.

**Ảnh hưởng:** xóa tài khoản/đổi password không tự vô hiệu hóa JWT đã cấp. Thư viện cài sẵn mặc định session có thời hạn dài; project không override `maxAge`.

**Khắc phục:** kiểm tra admin hiện hành ở guard; dùng session/token version hoặc cơ chế revoke phù hợp; đặt tuổi thọ session theo nhu cầu CMS.

## Medium & Low Risks

### F12 — MEDIUM — Validation query parameters không đầy đủ

**Confirmed.** `src/app/(public)/san-pham/page.tsx:25` và `src/app/(public)/tin-tuc/page.tsx:16` dùng `Math.max(1, parseInt(...))`, không xử lý `NaN`. `searchParams` không validate chuỗi/array.

**Ảnh hưởng:** `?page=abc` tạo `NaN` rồi đưa vào Prisma `skip`; query lặp `search` có thể làm `.trim()` lỗi. **Khắc phục:** validate runtime, giới hạn độ dài và số trang, xử lý giá trị không hợp lệ.

### F13 — MEDIUM — Bỏ qua lỗi trả về từ Resend

**Confirmed.** `src/lib/actions/contacts.ts:22` bỏ qua kết quả `resend.emails.send`. SDK đang cài trả `{error}` cho HTTP/network failure, xác nhận ở `node_modules/resend/dist/index.mjs:1220–1286`.

**Ảnh hưởng:** lưu contact thành công nhưng mất thông báo mà action vẫn báo thành công. **Khắc phục:** kiểm tra `error`, ghi trạng thái gửi, retry có kiểm soát; cấu hình sender thay vì hardcode.

### F14 — MEDIUM — Invalidation homepage/sitemap thiếu

**Confirmed.** `src/app/(public)/page.tsx:8` và `src/app/sitemap.ts:18` đọc dữ liệu database; mutation sản phẩm/bài viết không invalidate `/` và `/sitemap.xml`. Artifact cũ cho thấy hai route được cache không có TTL.

**Ảnh hưởng:** homepage/sitemap có thể giữ nội dung đã xóa hoặc bỏ sót nội dung mới. **Khắc phục:** xây dựng ma trận invalidation theo nơi sử dụng dữ liệu; kiểm tra thêm slug cũ khi đổi slug.

### F15 — MEDIUM — Query tải toàn bộ rồi lọc/cắt ở application

**Confirmed; tải thực tế Not verified.** `src/lib/api/products.ts:57`, `src/app/(public)/tin-tuc/[slug]/page.tsx:41`, `src/app/(admin)/admin/page.tsx:70` tải toàn bộ rồi `slice`; `src/lib/api/contacts.ts:4` không phân trang.

**Ảnh hưởng:** RAM, thời gian query/render tăng theo dữ liệu. **Khắc phục:** dùng `take`, `select`, `count`, lọc related articles tại database và phân trang admin.

### F16 — MEDIUM — Thiếu secondary index theo các query hiện tại

**Potential risk.** `prisma/schema.prisma:33–89` không khai báo secondary index cho FK/filter/sort; `src/lib/api/products.ts:39–46` tìm `contains` trên nhiều cột.

**Ảnh hưởng:** scan/sort tốn tài nguyên khi dữ liệu tăng. **Khắc phục:** đo `EXPLAIN ANALYZE`; thêm index theo query thực tế, cân nhắc trigram/full-text khi cần. Index tạo ngoài Prisma: **Not verified**.

### F17 — MEDIUM — Parse và hiển thị lỗi form admin chưa đầy đủ

**Confirmed.** `src/app/(admin)/admin/san-pham/[id]/page.tsx:46` gọi `JSON.parse` trước lớp xử lý lỗi. `src/app/(admin)/admin/danh-muc/page.tsx:32–38` bỏ qua kết quả create rồi redirect; các form delete cũng bỏ qua kết quả.

**Ảnh hưởng:** input lỗi gây exception; lỗi lưu/xóa không được thông báo rõ. **Khắc phục:** parse FormData an toàn, trả và hiển thị action state; có error boundary admin.

### F18 — MEDIUM — Ép kiểu che sai lệch DTO

**Confirmed.** `src/lib/api/news.ts:11` ép `as unknown as NewsArticle[]`; `src/types/news.ts:10` khai báo date là string trong khi Prisma trả `Date`.

**Ảnh hưởng:** TypeScript pass nhưng hợp đồng dữ liệu sai; date vào metadata/`dateTime` có thể không đúng định dạng mong muốn. **Khắc phục:** dùng Prisma payload type hoặc map DTO rõ ràng, chuyển date sang ISO.

### F19 — MEDIUM — Lost update và thiếu idempotency

**Potential risk.** `src/lib/actions/products.ts:41–51` update theo ID, thay toàn bộ specs; `src/lib/actions/contacts.ts:43` update status không kiểm tra trạng thái/version trước đó; submission tạo contact mới tại dòng 16.

**Ảnh hưởng:** hai admin có thể ghi đè thay đổi; submit lặp có thể tạo contact trùng. **Khắc phục:** optimistic concurrency cho dữ liệu cần bảo vệ và idempotency cho submission.

### F20 — MEDIUM — Chưa có CSP toàn website trong application

**Confirmed trong app.** `next.config.ts:3–10` chỉ có CSP trong cấu hình image, không có policy response toàn website.

**Ảnh hưởng:** thiếu lớp giảm thiểu XSS/clickjacking ở application. **Khắc phục:** thiết lập CSP phù hợp, `frame-ancestors`, referrer policy; kiểm tra headers từ gateway trước để tránh cấu hình trùng.

### F21 — MEDIUM — Observability và audit trail chưa đầy đủ

**Confirmed trong source.** `src/lib/actions/products.ts:29` và các action tương tự chỉ `console.error`; `src/app/(public)/error.tsx:3` không gửi telemetry.

**Ảnh hưởng:** không có audit trail thay đổi CMS, correlation ID hoặc báo động trong source. **Khắc phục:** log có cấu trúc, redact dữ liệu, audit mutation và alert lỗi quan trọng. Hệ thống log bên ngoài: **Not verified**.

### F22 — MEDIUM — Chưa có automated regression gate

**Confirmed.** `package.json:5–15` không có test script; không tìm thấy test suite/CI workflow trong repository.

**Ảnh hưởng:** lỗi auth, upload, draft và cache chưa có regression gate. **Khắc phục:** bổ sung integration/E2E tập trung vào các luồng này.

### F23 — MEDIUM — Accessibility của drawer và form chưa đầy đủ

**Confirmed từ markup/logic.** `src/components/public/layout/MobileNav.tsx:64–75` đóng drawer bằng translate, vẫn mounted; không có focus trap/Escape/inert. `src/app/(admin)/admin/san-pham/[id]/page.tsx:90–91` có label không nối input.

**Ảnh hưởng:** Tab/screen reader có thể tiếp cận menu ngoài màn hình; form thiếu tên truy cập rõ ràng. **Khắc phục:** dialog có quản lý focus, ẩn đúng khi đóng, gắn `htmlFor`/`id`. Kiểm thử browser/screen reader: **Not verified**.

### F24 — MEDIUM — Danh sách admin bỏ sót draft/unpublished

**Confirmed.** `src/app/(admin)/admin/san-pham/page.tsx:10` và `src/app/(admin)/admin/tin-tuc/page.tsx:14` dùng API public chỉ lấy `published: true`.

**Ảnh hưởng:** bản nháp/đã ẩn biến mất khỏi danh sách quản trị; tổng số sai. **Khắc phục:** tách query public và admin, thêm bộ lọc trạng thái.

### F25 — LOW — Placeholder thiếu và nội dung mẫu có thể xuất hiện public

**Confirmed.** `src/app/(admin)/admin/san-pham/tao-moi/page.tsx:37` và `src/app/(admin)/admin/tin-tuc/tao-moi/page.tsx:32` fallback tới hai `placeholder.svg` không tồn tại. `src/app/(public)/tin-tuc/[slug]/page.tsx:115–127` dùng nội dung mẫu khi bài không có body.

**Ảnh hưởng:** ảnh 404/nội dung mẫu có thể xuất hiện công khai. **Khắc phục:** cung cấp fallback thật hoặc bắt buộc nội dung hợp lệ trước publish.

### F26 — LOW — Image optimization bị tắt toàn cục

**Confirmed.** `next.config.ts:9`: `images.unoptimized: true`.

**Ảnh hưởng:** ảnh raster upload lớn được tải nguyên bản. **Khắc phục:** image optimization hoặc CDN transformation; đo LCP/băng thông trước khi chọn cấu hình.

### F27 — LOW — ESLint đang fail

**Confirmed bằng kiểm tra.** `src/components/public/layout/MobileNav.tsx:34` vi phạm `react-hooks/set-state-in-effect`. `src/components/public/products/ProductCard.tsx:3` và `ProductFilters.tsx:5` có import `cn` không dùng.

**Ảnh hưởng:** lint gate hiện fail; không đồng nghĩa build chắc chắn fail. **Khắc phục:** sửa luồng đóng menu và import dư, đưa lint vào gate.

### F28 — LOW — Metadata phụ thuộc domain hardcode và thiếu noindex phù hợp

**Confirmed.** `src/app/layout.tsx:17,36–39` và `src/config/site.ts:6` có domain hardcode, root mặc định `index: true`; login không override.

**Ảnh hưởng:** preview/domain khác có metadata sai; robots disallow không thay thế `noindex`. **Khắc phục:** site URL theo môi trường, canonical phù hợp và noindex cho login/admin/preview.

## Security Review

| Hạng mục | Kết quả |
|---|---|
| Authentication | Có Credentials provider, Zod và bcrypt; thiếu chống brute force, revoke và logout đúng. |
| Authorization | Không đạt: F01. UI/middleware không thay thế guard tại mutation. |
| Input validation | Có Zod cho phần lớn mutation; chưa đủ validation query/FormData/file, HTML, URL và giới hạn dữ liệu. |
| SQL injection | Không tìm thấy raw SQL hoặc nối chuỗi SQL trong application. Các query đã đọc dùng Prisma. |
| XSS | Không đạt: F02, F03. JSX text thông thường được escape; các sink HTML/JSON-LD không an toàn. |
| CSRF | Không thấy tắt bảo vệ mặc định của Auth.js/Server Actions. Không kết luận thiếu CSRF chỉ vì không có token tự viết. HTTP thực tế: Not verified. |
| SSRF | Không tìm thấy server fetch URL tùy ý từ người dùng trong luồng đã đọc. URL ảnh hiện chủ yếu được browser tải; không gán nhầm thành SSRF. |
| Cookie/session | Không thấy override cookie theo hướng rõ ràng không an toàn. Thư viện cài sẵn có httpOnly, sameSite=lax; secure phụ thuộc URL/config. Cookie Production: Not verified. |
| CORS | Không tìm thấy wildcard CORS trong app. Headers do hạ tầng bổ sung: Not verified. |
| CSP | Cấu hình image không phải CSP toàn website: F20. |
| Secrets | .env không được track ở HEAD và được ignore. Không tìm thấy secret server đưa vào Client Component. Seed có F04. |
| Debug/log | Không tìm thấy debugger hoặc bật auth debug trong source. Log password của seed là lỗi thực sự. |

Client/Server boundary hiện tương đối rõ: Client Components import Server Actions qua cơ chế Next.js; không tìm thấy client import trực tiếp Prisma. Các module database/query chưa có `server-only` guard để ngăn import nhầm về sau.

**Not verified:** secret trong toàn bộ lịch sử Git, credential đang dùng thật, cấu hình WAF/CDN, TLS, header và cookie của deployment.

## Database & Data Safety

Architecture xác nhận từ code:

- PostgreSQL qua Prisma 7.9.1, adapter `@prisma/adapter-pg` và `pg`.
- Model: `Admin`, `Category`, `Product`, `TechnicalSpec`, `NewsArticle`, `ContactRequest`.
- Database lưu URL ảnh dạng string, không lưu file binary.
- `docker-compose.yml` chỉ dựng PostgreSQL 16, không dựng application.

Điểm đang làm đúng:

- Có primary key, unique email/slug và foreign key trong schema.
- Product và technical specs được tạo/cập nhật bằng nested write. Không có cơ sở gọi đây là thao tác rời rạc thiếu transaction.
- Xóa product cascade technical specs là hành vi được khai báo rõ.
- Có Prisma instance dùng lại ở module; development còn lưu trên `globalThis`.

Rủi ro cần xử lý:

- Migration chưa có: F10.
- Lost update/idempotency: F19.
- `prisma/seed.ts:198,277,287` tạo dữ liệu sản phẩm, tin tức và contact mẫu, không có guard môi trường. Không dùng nguyên seed demo để bootstrap Production.
- `docker-compose.yml:5–10` publish port 5432 và dùng credential cố định. **Potential risk nếu dùng nguyên compose trên host public:** database có thể bị phơi ra. Khắc phục bằng credential riêng, private network/bind phù hợp và quyền tối thiểu. Không có bằng chứng compose đang chạy Production.
- `src/lib/db.ts:7` không cấu hình rõ pool limit, connection timeout hoặc statement timeout. **Potential risk khi scale:** singleton không giới hạn tổng connection giữa nhiều instance. Cần cấu hình theo ngân sách connection và đo tải.

**Not verified:** Supabase thật, pooler, quyền database role, RLS, TLS database, schema drift, backup/PITR, restore, dung lượng và query plan. Dùng PostgreSQL không tự chứng minh đã tích hợp Supabase.

## Performance & Scalability

- Public listing có pagination tại database và chạy query/count song song.
- Có tải dư ở homepage, related articles, dashboard và contact list: F15.
- Không tìm thấy vòng lặp query N+1 điển hình trong application; trang danh mục admin dùng `groupBy`.
- `generateMetadata` và page gọi cùng query chi tiết nhưng chưa có request memoization rõ ràng.
- Public listing đọc `searchParams` và query database trực tiếp, không có explicit data cache.
- Admin và homepage lại có bằng chứng static cache không phù hợp hoặc invalidation thiếu.
- Ảnh bị tắt optimization toàn cục.
- Không có load test để định lượng khả năng chịu tải.

Ưu tiên giới hạn query và sửa cache correctness trước khi bổ sung cache rộng hơn.

**Not verified:** throughput, p95/p99 latency, connection saturation, cold start, Core Web Vitals và chi phí theo tải.

## Reliability & Error Handling

Có public error boundary, loading UI, `notFound()`, error message chung cho nhiều mutation. Đây là nền tảng hữu ích và hạn chế lộ lỗi nội bộ trực tiếp.

Các thiếu sót:

- Form admin chưa xử lý kết quả lỗi đầy đủ.
- Parse FormData có thể throw trước lớp xử lý lỗi.
- Email failure bị bỏ qua; không có retry/delivery state cho notification.
- Không có audit trail mutation hoặc integration giám sát lỗi trong source.
- Không có cơ chế chống submit trùng và ghi đè đồng thời.
- Cache contact/admin có thể làm mất khả năng phát hiện yêu cầu mới dù record đã được lưu.

Không có bằng chứng exception gây crash toàn process; các lỗi nêu trên chủ yếu ảnh hưởng request, dữ liệu hoặc khả năng vận hành.

## Build / Deployment / Environment

### Architecture và tech stack thực tế

| Thành phần | Xác nhận |
|---|---|
| Framework | Next.js 16.2.12, App Router |
| UI | React 19.2.4, TypeScript strict, Tailwind CSS 4, Base UI, Tiptap |
| Backend | Server Components, Server Actions, Route Handlers |
| Authentication | NextAuth/Auth.js 5.0.0-beta.32, Credentials, JWT, PrismaAdapter |
| Database | Prisma/adapter-pg 7.9.1, PostgreSQL |
| Storage | Local filesystem public/uploads |
| Email | Resend 6.18.1, chạy khi có API key |
| Font | next/font/google: Inter, Manrope |
| Build | postinstall → prisma generate; build → next build; start → next start |
| CI/CD | Không tìm thấy pipeline trong repository |

Luồng chính:

```text
Public pages (Server Components) → src/lib/api → Prisma → PostgreSQL
Admin forms → Server Actions → Zod → Prisma → PostgreSQL
Login → Auth.js Credentials → bcrypt + Admin table → JWT cookie
ImageUpload (client) → POST /api/upload → public/uploads (local filesystem)
ContactForm → submitContact → PostgreSQL → Resend (nếu cấu hình)
```

### Cấu hình cần lưu ý

- `.env:1,4` local có `DATABASE_URL` trỏ localhost, `AUTH_URL` dùng HTTP localhost; `RESEND_API_KEY` trống. Đây là cấu hình local, không phải bằng chứng Production cấu hình sai.
- `EMAIL_FROM` có trong `.env` nhưng action gửi email dùng sender hardcode tại `src/lib/actions/contacts.ts:23`.
- Không có runtime env schema/fail-fast rõ ràng.
- Không pin Node bằng `engines`/version file trong repository. Lockfile cho thấy Prisma yêu cầu `^20.19 || ^22.12 || >=24.0`; Node đang kiểm tra là 20.19.0.
- `src/middleware.ts:1` import toàn bộ auth → database/adapter. Artifact cũ chứa middleware bundle Edge. Khả năng tương thích trên target cần smoke test; chưa xác nhận runtime fail. Có thể tách cấu hình auth nhẹ hoặc dùng runtime phù hợp sau khi kiểm chứng.
- `src/lib/auth.ts:14` cấu hình PrismaAdapter nhưng schema không có model Auth.js tiêu chuẩn như `User`/`Account`/`Session`. Credentials+JWT có thể không dùng các adapter method đó; không kết luận login hiện tại hỏng. Loại adapter không cần thiết hoặc triển khai schema nếu dùng chức năng phụ thuộc nó.
- NextAuth đang là beta: cần test tương thích và chiến lược nâng cấp, không tự coi beta là lỗ hổng.

**Not verified:** clean install/build hiện tại, Vercel deployment, domain/DNS, production environment, migration rollout và rollback.

Artifact `.next` có sẵn không được coi là bằng chứng build hiện tại pass.

## Testing & Quality

| Kiểm tra | Kết quả |
|---|---|
| TypeScript --noEmit --incremental false | PASS |
| ESLint | FAIL: 1 error, 2 warnings |
| Upload handler với mock filesystem | Xác nhận nhận .html giả MIME và không cần session |
| Create article với mock database/cache | Xác nhận ghi dữ liệu không có session |
| Schema nhận HTML event attribute | Xác nhận |
| Parse page không hợp lệ | Xác nhận tạo NaN |
| Static asset references | Thiếu hai placeholder SVG |
| Test suite có sẵn | Không tìm thấy |
| Dependency vulnerability scan | Not verified |
| Clean production build / E2E / browser accessibility | Not verified |

Các kiểm tra cô lập dùng source transpile trong bộ nhớ, mock database/filesystem/cache; không gọi ghi vào database hoặc filesystem thật.

`npm audit` không thực thi được do lỗi quyền truy cập npm trong môi trường; thử truy vấn registry advisory cũng bị `EACCES`. Đây là giới hạn môi trường audit, không phải finding lỗi dependency của project. Không có cơ sở tuyên bố dependency sạch hoặc gán CVE cụ thể.

TypeScript pass chưa đủ vì các ép kiểu `as unknown as` che sai lệch dữ liệu thực tế. Frontend có nhiều `alt`, label và landmark hữu ích, nhưng chưa đạt mức có thể tuyên bố accessibility đã kiểm chứng.

## Production Checklist

- [ ] Guard auth/admin tại mọi mutation và truy vấn nhạy cảm.
- [ ] Regression test request không đăng nhập không thể ghi/xóa dữ liệu.
- [ ] Sanitize HTML và serialize JSON-LD an toàn.
- [ ] Upload có auth, kiểm tra nội dung thật, quota và giới hạn request.
- [ ] Media lưu bền vững và tồn tại sau redeploy.
- [ ] Public không đọc được draft/unpublished content.
- [ ] Logout hủy session; có chiến lược revoke session.
- [ ] Rate limit login/contact/upload.
- [ ] Không còn default credential hoặc password trong log.
- [ ] Admin không bị static cache; contact mới hiển thị ngay.
- [ ] Homepage/sitemap cập nhật đúng sau mutation.
- [ ] Migration baseline được review và thử trên staging.
- [ ] Backup và restore được kiểm chứng.
- [ ] Pool/timeout/database role phù hợp môi trường chạy.
- [ ] Xử lý lỗi email và hiển thị lỗi form admin.
- [ ] Phân trang và giới hạn query không cần tải toàn bộ.
- [ ] Production env, domain, sender email và Node version đúng.
- [ ] Dependency scan hoàn tất.
- [ ] Lint, clean build và integration/E2E pass.
- [ ] Log/audit/alert đủ để phát hiện sự cố.
- [ ] Keyboard/mobile accessibility và metadata SEO được kiểm tra.
- [ ] Loại dữ liệu demo, nội dung placeholder và ảnh 404.

## Recommended Fix Order

### P0 — Ngăn security incident

F01 → F02 → F03 → F04 → F06 → F07 → F08. Bổ sung test âm tính cho auth/upload/XSS cùng lúc. Xử lý khả năng revoke session F11.

### P1 — Bảo đảm deploy và vận hành đúng

F05 nếu dùng Vercel; F09–F10; production env/runtime; xử lý email; clean build; dependency scan; backup/restore và smoke test toàn bộ luồng CMS.

### P2 — Ổn định khi dữ liệu và traffic tăng

Validation query/FormData, error state admin, cache invalidation public, phân trang/query/index, connection pool, concurrency, DTO/type safety và observability.

### P3 — Hoàn thiện trải nghiệm

Accessibility, image optimization, SEO, placeholder/demo content, lint cleanup và các control giao diện chưa có hành vi.

## Final Assessment

**Project chưa đủ an toàn để deploy Production.** Các blocker xuất phát từ code thực tế: mutation không kiểm tra quyền, dữ liệu không được sanitize trước khi render, upload chấp nhận nội dung giả định dạng và logout không hủy session. Cache admin và thiếu migration tiếp tục tạo rủi ro vận hành.

Kiến trúc Next.js full-stack hiện tại có thể giữ lại; chưa có lý do phải tách backend riêng. Cần sửa các điểm kiểm soát quyền, dữ liệu, storage và deployment, rồi kiểm chứng trên production build trước khi đánh giá lại.
