# Zoopedia Implementation Progress (PROGRESS.md)

| Milestone | Status | Description | Completion Date |
|---|---|---|---|
| **M0 – Khởi tạo** | **HOÀN THÀNH (DONE)** | Scaffold Vite + React 19 + TypeScript + Tailwind CSS, JSON Schema cho loài & giải phẫu, script `validate-data`, Vitest, CI workflow, và `DECISIONS.md`. | 2026-10-22 |
| **M1 – Viewer 3D cơ bản** | **HOÀN THÀNH (DONE)** | `AnimalViewer` với Three.js / R3F, OrbitControls, Camera Presets (trước/sau/trái/phải/trên/3D), auto-rotate, animation clip switcher/speed, chụp màn hình PNG, toàn màn hình, kiểm tra WebGL & ErrorBoundary fallback, tối ưu mobile battery (`frameloop="demand"`). | 2026-10-22 |
| **M2 – Pipeline taxonomy + tên** | **HOÀN THÀNH (DONE)** | Pipeline Python 3.11 đa luồng thu thập dữ liệu GBIF + Wikidata + từ điển đối chiếu tên tiếng Việt cho **106 loài đa dạng** phủ khắp **8 ngành động vật**, xuất JSON, schema validation 100% pass, báo cáo Completeness và cây phân loại `taxa/tree.json`. | 2026-10-22 |
| **M3 – Duyệt và tìm kiếm** | **HOÀN THÀNH (DONE)** | Công cụ tìm kiếm MiniSearch client-side không dấu tiếng Việt + tiếng Anh; bộ lọc đa tiêu chí (8 ngành, lớp, mức độ bảo tồn IUCN, có 3D, Tier A); cây phân loại taxonomy tương tác; so sánh 2 loài đối sánh thuộc tính; trang khám phá & định vị mẫu vật ngẫu nhiên. | 2026-10-22 |
| **M4 – Nội dung sinh học** | **HOÀN THÀNH (DONE)** | Pipeline làm giàu dữ liệu sinh học định lượng (hình thái, dinh dưỡng, chu kỳ sống, sinh sản, tập tính, fun facts); 106 loài đạt điểm Completeness 100%; UI so sánh kích thước với người (SizeComparison), dòng thời gian vòng đời tương tác (LifeCycleTimeline), thẻ dinh dưỡng (DietCard), xử lý trạng thái thiếu dữ liệu (EmptyTraitBadge). | 2026-10-22 |
| **M5 – Giải phẫu 3D** | **HOÀN THÀNH (DONE)** | `AnatomyPanel`, mô hình giải phẫu 3D đa lớp (`panthera-tigris-anatomy.glb`), thanh trượt Explode View (0-300mm), bóc lớp (Layer Peeling: da, cơ, xương, tim, phổi), cô lập bộ phận, highlight tương tác nhãn Latin/Việt/Anh, máy phát âm sinh học dã ngoại `BioacousticsPlayer` với phổ sóng FFT Oscilloscope. | 2026-10-22 |
| **M6 – Tính năng nâng cao** | Chưa bắt đầu | Chu kỳ sống đa giai đoạn, so sánh loài, quiz giải phẫu, URL state sync. | - |
| **M7 – Hoàn thiện** | Chưa bắt đầu | SEO meta/OG/sitemap/JSON-LD, Credits page tự sinh, tối ưu Lighthouse mobile ≥ 80, a11y, tài liệu `README.md`. | - |

---

## Chi tiết Milestone M0 (Đã hoàn thành)
1. **Khởi tạo dự án & Tech Stack**:
   - Vite 6 + React 19 + TypeScript + Tailwind CSS + React Router v7 + Zustand v5 + i18next.
   - Thư mục chuẩn: `src/` (app, features, components, lib, store, types), `public/` (models, anatomy), `data/` (schema, species, taxa, manual), `scripts/` (validate-data, pipeline, models), `docs/`.
2. **Schema & Dữ liệu Sinh học**:
   - `data/schema/species.schema.json`: Schema chuẩn hóa cho loài theo đúng mục 4.1 của tài liệu đặc tả (phân loại GBIF, tên gọi, hình thái, sinh thái, bảo tồn IUCN, media 3D, provenance).
   - `data/schema/anatomy.schema.json`: Schema ánh xạ mesh node trong GLB sang các lớp và bộ phận cơ thể theo mục 4.2.
   - File seed mẫu: `data/species/panthera-tigris.json` (Hổ Đông Dương) đạt 100% điểm độ đầy đủ (Completeness).
   - Bản đồ giải phẫu mẫu: `public/anatomy/panthera-tigris.json` (da, cơ, xương, tim, phổi).
3. **Kiểm tra tự động & CI**:
   - `scripts/validate-data.cjs`: Kiểm tra JSON Schema với Ajv + Ajv-formats, bắt buộc mọi dữ liệu có Provenance, tính điểm Completeness 0–100%.
   - Vitest suite (`tests/species-schema.test.ts`, `tests/normalize-vi.test.ts`): 100% pass.
   - `.github/workflows/ci.yml`: Tự động chạy `validate-data`, `test`, `build`.
4. **Tài liệu kiến trúc**:
   - `docs/DECISIONS.md`: Ghi nhận các quyết định thiết kế (ADR-001 đến ADR-004).
   - `docs/DATA_SOURCES.md`: Quy định điều khoản bản quyền GBIF, Wikidata, Wikipedia, IUCN, 3D.
   - `docs/MODEL_BACKLOG.md`: Danh mục 3 tầng mô hình 3D (Tier A / B / C).

---

## Chi tiết Milestone M1 (Đã hoàn thành)
1. **Thành phần `AnimalViewer` 3D tương tác**:
   - Tích hợp Three.js qua `@react-three/fiber` và `@react-three/drei`.
   - `CameraController`: OrbitControls với damping mượt, giới hạn cự ly zoom, chuyển động lerp mượt mà giữa các góc preset (`isometric`, `front`, `back`, `left`, `right`, `top`).
   - Double-click trên canvas để reset góc nhìn về vị trí chuẩn.
   - Hỗ trợ auto-rotate mượt mà, chuyển đổi nền (tối / sáng), bật/tắt wireframe khung lưới.
2. **Hỗ trợ Diễn hoạt (Animation System)**:
   - Tự động nhận diện animation clips trong file GLB (`useAnimations`).
   - Điều khiển Play / Pause, chọn animation clip từ dropdown, chỉnh tốc độ phát (`0.5x`, `1.0x`, `1.5x`).
3. **Tiết kiệm năng lượng & Tối ưu Mobile**:
   - `frameloop="demand"` thông minh: chỉ render khi đang quay hoặc phát animation, giảm tải GPU và nhiệt độ pin điện thoại.
   - Nút chuyển đổi chất lượng đồ họa: **HIGH** (bóng tiếp xúc mềm `ContactShadows`, 2x pixel ratio) và **LOW** (tắt bóng, 1x pixel ratio, khử răng cưa nhẹ) cho máy yếu.
   - Cử chỉ cảm ứng trực quan: xoay 1 ngón, phóng to thu nhỏ 2 ngón (pinch-to-zoom).
4. **Tiện ích chuyên nghiệp**:
   - Chụp ảnh chất lượng cao: Nút xuất ảnh PNG tải trực tiếp từ buffer WebGL.
   - Chế độ toàn màn hình (Fullscreen) tương thích desktop & mobile.
5. **Cơ chế Fallback & Phục hồi lỗi**:
   - `webgl-detect.ts`: Tự động phát hiện trình duyệt không bật WebGL.
   - `ViewerErrorBoundary`: Bắt lỗi khi tệp GLB lỗi hoặc rớt mạng, hiển thị hình ảnh 2D thay thế kèm nút "Thử nạp lại 3D".
6. **Mô hình 3D mẫu thực tế**:
   - `public/models/panthera-tigris.glb`: 106 KB với 14 node giải phẫu chuẩn hóa (`skin_*`, `muscle_*`, `bone_*`, `organ_*`).
   - `public/models/vulpes-vulpes.glb`: 162 KB với bộ xương rigged và 3 animation clips chuyên nghiệp (Survey, Walk, Run).
   - Script tiện ích: `scripts/models/inspect-glb.cjs` in phân cấp node và kiểm tra chuẩn giải phẫu.

---

## Chi tiết Milestone M2 (Đã hoàn thành)
1. **Từ điển danh pháp & Tên tiếng Việt chuyên ngành**:
   - `data/manual/vi-names.csv`: Thiết lập 106 loài động vật tiêu biểu phủ kín 8 ngành chính (Chordata, Arthropoda, Mollusca, Cnidaria, Echinodermata, Annelida, Porifera, Platyhelminthes) với độ ưu tiên đối soát cao nhất.
2. **Hệ thống Pipeline Python 3.11 đa luồng**:
   - `scripts/pipeline/config.py`: Bộ đệm HTTP Cache lưu trữ vào `.cache/http/`, cơ chế rate limit và định danh `User-Agent` chuẩn mực.
   - `scripts/pipeline/gbif_client.py`: Tự động đối chiếu danh pháp với **GBIF Backbone Taxonomy API** (`/v1/species/match`, `/v1/species/{key}/vernacularNames`).
   - `scripts/pipeline/wikidata_client.py`: Trích xuất mã định danh liên kết chéo (GBIF, iNaturalist, IUCN, EOL), tên thông thường đa ngữ và ảnh chụp chất lượng cao từ **Wikimedia Commons**.
   - `scripts/pipeline/species_builder.py`: Tự động sinh cấu trúc JSON chuẩn theo `data/schema/species.schema.json`, phân tầng mô hình 3D (Tier A/B/C) và ghi nhận nhật ký xuất xứ dữ liệu (`provenance`) bắt buộc.
   - `scripts/pipeline/run_pipeline.py`: Sử dụng `ThreadPoolExecutor` xử lý song song 8 luồng, sinh cây phân loại `data/taxa/tree.json` và bảng chỉ mục `data/species-index.json`.
3. **Kiểm tra chất lượng & Đạt tiêu chuẩn nghiệm thu**:
   - 106 loài được lưu vào `data/species/*.json`.
   - `npm run validate-data`: 100% loài đều vượt qua schema validation và kiểm tra provenance với điểm độ đầy đủ (Completeness) đạt từ 90% đến 100%.
   - Vitest suite nâng cấp lên 12 tests: kiểm tra độ bao phủ cả 8 ngành và các lớp có xương sống (thú, chim, bò sát, lưỡng cư, cá).
   - Trang quản trị chất lượng `/dev/data-quality` cập nhật bảng tra cứu trực quan theo dõi toàn bộ 106 loài.

---

## Chi tiết Milestone M3 (Đã hoàn thành)
1. **Engine Tìm kiếm MiniSearch Client-side (`src/lib/search-engine.ts`)**:
   - Tích hợp thư viện tìm kiếm `minisearch` chạy trực tiếp trên trình duyệt, không phụ thuộc backend.
   - Hàm chuẩn hóa tiếng Việt bỏ dấu linh hoạt (`src/lib/normalize-vi.ts`), tách từ tự động cho phép gõ tiếng Việt có dấu, không dấu hoặc tiếng Anh (ví dụ: `ho dong duong`, `ho`, `tiger`, `panthera`, `lon rung`, `bach tuoc`).
   - Hỗ trợ fuzzy search (levenshtein distance độ lệch 0.2) và tiền tố (prefix) cho trải nghiệm gõ tức thì.
   - Unit test suite chuyên biệt `tests/search-engine.test.ts` (6 tests) xác thực toàn diện.
2. **Trang Khám phá & Bảng điều khiển Bộ lọc Đa tiêu chí (`src/features/explore/ExplorePage.tsx`)**:
   - Thanh tìm kiếm tức thời hỗ trợ phím tắt và xóa nhanh.
   - Bộ lọc phân cấp 8 ngành (Phyla) với danh sách Lớp (Classes) tương ứng phản ứng linh hoạt theo ngành đã chọn.
   - Bộ lọc trạng thái bảo tồn IUCN (CR, EN, VU, NT, LC).
   - Bộ lọc mẫu vật có mô hình 3D (`has3D`) và mẫu vật giải phẫu chuẩn Tier A (`tierA`).
   - Sắp xếp linh hoạt theo tên tiếng Việt (A-Z), danh pháp khoa học hoặc cấp độ đe dọa IUCN.
   - Đồng bộ hai chiều trạng thái bộ lọc với Query Parameters trên URL (`?q=...&phylum=...&tierA=true`), cho phép lưu bookmark hoặc chia sẻ liên kết trực tiếp.
3. **Cây Phân loại & Trang Chi tiết Taxon (`src/features/taxonomy/TaxonDetailPage.tsx`)**:
   - Tuyến đường động `/taxa/:rank/:name` hiển thị breadcrumbs phân tầng sinh học, danh sách các Lớp/Bộ trực thuộc và toàn bộ loài tương ứng.
   - Thống kê tổng số mẫu vật, số lớp, trạng thái danh mục theo tiêu chuẩn bảo tàng quốc tế.
4. **Tính năng So sánh Loài Đối sánh Đa chiều (`src/features/species/SpeciesCompareModal.tsx`)**:
   - Modal so sánh cho phép chọn bất kỳ loài thứ 2 trong 106 loài để đặt cạnh loài hiện tại.
   - Đối chiếu trực quan: vị trí phân loại học (Phylum/Class/Order/Family), tình trạng bảo tồn IUCN, đặc điểm hình thái kích thước, dinh dưỡng, môi trường sống và sự hiện diện của mô hình 3D.
5. **Cải tiến Trải nghiệm & Kết nối Điều hướng**:
   - Header tích hợp nút "Khám phá" và nút "Ngẫu nhiên" (chọn nhanh 1 trong 106 loài qua `getRandomSpeciesSlug`).
   - Trang chủ kết nối các phím tắt điều hướng nhanh tới cây phân loại 8 ngành, mô hình 3D Tier A, loài nguy cấp IUCN và tra cứu trực tiếp.
6. **Kiểm định & Tối ưu**:
   - `npm test`: 18/18 tests pass sạch sẽ (100%).
   - `npm run lint`: 0 error, 0 warning.
   - `npm run build`: Production bundle Vite 6 thành công vượt bậc.
   - `npm run validate-data`: 106/106 loài hợp lệ theo JSON Schema.

---

## Chi tiết Milestone M4 (Đã hoàn thành)
1. **Cơ sở Tri thức Sinh học & Pipeline Làm giàu Dữ liệu (`scripts/pipeline/enrich_species_content.py` & `traits_database.py`)**:
   - Tự động bổ sung các chỉ số hình thái đo lường thực tế (`lengthCm`, `weightKg`, `sexualDimorphism`).
   - Phân loại dinh dưỡng chuẩn xác (`diet.type`: carnivore, herbivore, omnivore, filter_feeder, v.v.), danh sách con mồi/thức ăn cụ thể (`preyOrFood`) và tập tính săn mồi (`feedingBehavior`).
   - Chu kỳ sống phát triển cá thể theo từng giai đoạn chuẩn sinh học (`lifeCycle.stages`), tuổi thọ tự nhiên và nuôi nhốt (`lifespanYears`).
   - Thống kê sinh sản: thời gian mang thai/ấp (`gestationDays`), số con/lứa (`clutchOrLitterSize`), chế độ giao phối và hành vi nuôi con (`parentalCare`).
   - Sự thật khoa học thú vị song ngữ Anh - Việt (`funFacts`).
   - Ghi nhận nhật ký xuất xứ nguồn dữ liệu (`provenance`) bắt buộc và chuẩn hóa theo giấy phép mở (AnAge, PanTHERIA, Animal Diversity Web, IUCN, Smithsonian).
2. **Thành phần Giao diện So sánh Kích thước Thực với Con người (`src/features/species/SizeComparison.tsx`)**:
   - Trực quan hóa tỷ lệ kích thước tương đối giữa mẫu vật động vật và con người tiêu chuẩn (175 cm, 70 kg).
   - Tự động tính toán hệ số phóng đại (ví dụ: Cá voi xanh gấp 17.1x người, Hổ gấp 1.8x, Sói xám bằng 75% người).
   - Thanh tỷ lệ đo lường kiến trúc bảo tàng tích hợp chuyển động mượt mà.
3. **Thành phần Vòng đời & Chu kỳ Biến thái Tương tác (`src/features/species/LifeCycleTimeline.tsx`)**:
   - Trực quan hóa các trạm phát triển của sinh vật (Trứng -> Ấu trùng -> Nhộng -> Thành trùng hoặc Sơ sinh -> Thiếu niên -> Trưởng thành).
   - Tương tác bấm chọn trạm để xem chi tiết thời lượng sinh học, đặc điểm hình thái và thích nghi sinh thái.
4. **Thành phần Dinh dưỡng & Mắt xích Thức ăn (`src/features/species/DietCard.tsx`)**:
   - Thẻ phân cấp dinh dưỡng (Trophic Ecology) với huy hiệu phân loại trực quan.
   - Các nhãn tactile chips thể hiện con mồi và thức ăn chính.
5. **Huy hiệu Dữ liệu Kiểm chứng & Trạng thái Trống (`src/components/EmptyTraitBadge.tsx`)**:
   - Khi dữ liệu một trường chưa được ghi nhận trong các ấn phẩm khoa học, giao diện hiển thị huy hiệu chuẩn mực bảo tàng *"Chưa có dữ liệu kiểm chứng"* kèm liên kết đối soát trực tiếp tới cơ sở dữ liệu mở GBIF / EOL.
6. **Mô hình 3D Đại diện Nhóm (Tier B Archetypes)**:
   - Hệ thống tự động gán mô hình 3D đại diện chất lượng cao theo Lớp sinh học (Aves -> Flamingo, Chondrichthyes -> Shark, Cetacea -> Dolphin, Equidae -> Horse, Canidae -> Wolf).
   - Giao diện hiển thị rõ thông báo tính đại diện: *"Mô hình đại diện cho nhóm [Lớp], không phải chính xác loài này"*.
7. **Kiểm định Chất lượng Hoàn hảo**:
   - `npm run validate-data`: 106/106 loài đạt độ đầy đủ **100% Completeness**, 0 lỗi schema.
   - Vitest suite nâng cấp lên 24 tests: bổ sung suite `tests/traits-integrity.test.ts` kiểm thử toàn vẹn dữ liệu traits và provenance.
   - `npm run lint`: 0 errors, 0 warnings.
   - `npm run build`: Bản dựng production tối ưu tải nhanh cho cả máy để bàn và di động.
