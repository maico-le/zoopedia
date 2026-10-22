# Zoopedia Implementation Progress (PROGRESS.md)

| Milestone | Status | Description | Completion Date |
|---|---|---|---|
| **M0 – Khởi tạo** | **HOÀN THÀNH (DONE)** | Scaffold Vite + React 19 + TypeScript + Tailwind CSS, JSON Schema cho loài & giải phẫu, script `validate-data`, Vitest, CI workflow, và `DECISIONS.md`. | 2026-10-22 |
| **M1 – Viewer 3D cơ bản** | **HOÀN THÀNH (DONE)** | `AnimalViewer` với Three.js / R3F, OrbitControls, Camera Presets (trước/sau/trái/phải/trên/3D), auto-rotate, animation clip switcher/speed, chụp màn hình PNG, toàn màn hình, kiểm tra WebGL & ErrorBoundary fallback, tối ưu mobile battery (`frameloop="demand"`). | 2026-10-22 |
| **M2 – Pipeline taxonomy + tên** | Chưa bắt đầu | Pipeline Python/Node lấy ~100 loài đa dạng (8 ngành), đối chiếu GBIF + Wikidata + iNat + vi.wikipedia. | - |
| **M3 – Duyệt và tìm kiếm** | Chưa bắt đầu | Trang chủ 3D, cây phân loại tương tác, MiniSearch chuẩn hóa không dấu tiếng Việt, bộ lọc đa tiêu chí. | - |
| **M4 – Nội dung sinh học** | Chưa bắt đầu | Pipeline cào nội dung tập tính, sinh sản, chu kỳ sống, số liệu traits, provenance & review flags. | - |
| **M5 – Giải phẫu 3D** | Chưa bắt đầu | `AnatomyPanel`, explode view slider, bóc lớp, cô lập bộ phận, clipping plane, 3 loài Tier A + 3 Tier B. | - |
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
