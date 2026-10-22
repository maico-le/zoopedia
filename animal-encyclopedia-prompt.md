# PROMPT CHO AI AGENT: Web bách khoa động vật 3D ("Zoopedia")

Bạn là một senior full-stack engineer kiêm data engineer. Hãy tự chủ xây dựng toàn bộ dự án dưới đây, làm theo từng milestone, tự chạy lệnh, tự sửa lỗi, và chỉ hỏi lại tôi khi bị chặn thật sự. Sau mỗi milestone hãy commit git với message rõ ràng và cập nhật file `PROGRESS.md`.

---

## 1. Mục tiêu sản phẩm

Một website bách khoa về giới động vật (Animalia), giao diện **3D tương tác**:

- Duyệt theo cây phân loại: **Ngành (Phylum) → Lớp (Class) → Bộ (Order) → Họ (Family) → Chi (Genus) → Loài (Species)**.
- Trang loài có **viewer 3D**: xoay nhiều góc, zoom, preset góc nhìn (trước/sau/trái/phải/trên/dưới), auto-rotate.
- **Chế độ giải phẫu**: bóc từng lớp (da → cơ → xương → hệ cơ quan), tách rời bộ phận (explode view), click vào bộ phận để xem tên + chức năng, ẩn/hiện/cô lập từng bộ phận, mặt cắt (clipping plane).
- Kiến thức sinh học đầy đủ cho mỗi loài: tên (Anh, Việt, khoa học), phân loại, hình thái, phân bố, môi trường sống, thức ăn, **tập tính**, **chu kỳ sống**, **sinh sản**, tuổi thọ, kích thước/cân nặng, tình trạng bảo tồn (IUCN), thiên địch/con mồi, mối quan hệ với con người, thông tin thú vị.
- Tìm kiếm nhanh (tên Việt có dấu / không dấu, tên Anh, tên khoa học), bộ lọc (ngành, môi trường, chế độ ăn, tình trạng bảo tồn, kích thước, có mô hình 3D/giải phẫu hay không).
- Song ngữ **Việt / Anh** (mặc định Việt).

## 2. Tech stack (bắt buộc, trừ khi có lý do chính đáng và ghi vào `DECISIONS.md`)

- **Vite + React + TypeScript**, Tailwind CSS, React Router.
- 3D: **three.js** qua **@react-three/fiber** và **@react-three/drei** (OrbitControls, useGLTF, Html, Environment, Bounds, Center, ContactShadows). Dùng **@react-three/postprocessing** chỉ khi cần (outline khi hover bộ phận).
- State: Zustand.
- i18n: i18next (vi, en).
- Tìm kiếm client-side: **MiniSearch** (hoặc Fuse.js), chuẩn hóa bỏ dấu tiếng Việt.
- Dữ liệu: **file JSON tĩnh** sinh ra từ pipeline (xem mục 5), không cần backend ở MVP. Có thể chia nhỏ theo ngành để lazy-load. Chuẩn bị sẵn để sau này chuyển sang SQLite/Postgres.
- Test: Vitest cho logic dữ liệu và search. Không cần E2E.
- Deploy tĩnh: Cloudflare Pages hoặc GitHub Pages. File GLB nặng để trong `public/models/` ở MVP, có sẵn config đổi sang CDN/R2 qua biến môi trường `VITE_ASSET_BASE_URL`.
- Pipeline dữ liệu: **Python 3.11+** (requests, pandas, tqdm) hoặc Node, chọn một và giữ nhất quán. Có cache HTTP vào thư mục `.cache/` để chạy lại không gọi API lại.

## 3. Yêu cầu hiệu năng và thiết bị

- Chạy mượt trên **điện thoại tầm trung** (ví dụ Xiaomi) lẫn desktop. Mục tiêu ≥ 30 fps trên mobile.
- Mỗi file GLB đã tối ưu: **≤ 5 MB** (mục tiêu ≤ 3 MB), nén Draco hoặc meshopt, texture ≤ 2048px (ưu tiên KTX2/WebP). Dùng `gltf-transform` trong script `scripts/optimize-models`.
- Lazy-load model: chỉ tải khi vào trang loài; hiện skeleton/loading progress; có `Suspense` + error boundary.
- `frameloop="demand"` khi không auto-rotate/animation để tiết kiệm pin.
- Tôn trọng `prefers-reduced-motion`. Có nút "Chất lượng thấp/cao" (giảm pixel ratio, tắt shadow).
- Trang vẫn **dùng được khi không có WebGL hoặc không có model 3D** (fallback: gallery ảnh + sơ đồ 2D + toàn bộ thông tin chữ).

## 4. Kiến trúc dữ liệu

### 4.1 Schema loài (`data/species/<slug>.json`)

```jsonc
{
  "id": "panthera-tigris",
  "taxonKey": { "gbif": 5219416, "col": "...", "wikidata": "Q19939", "inaturalist": 41944 },
  "names": {
    "scientific": "Panthera tigris",
    "authorship": "(Linnaeus, 1758)",
    "en": ["Tiger"],
    "vi": ["Hổ", "Cọp"],
    "otherLocal": { "vi_dialect": [] },
    "nameSource": { "vi": "wikidata|inat|wikipedia-vi|machine_translated" }
  },
  "taxonomy": {
    "kingdom": "Animalia", "phylum": "Chordata", "class": "Mammalia",
    "order": "Carnivora", "family": "Felidae", "genus": "Panthera",
    "subspecies": []
  },
  "morphology": { "lengthCm": [..], "weightKg": [..], "description": {"vi": "...", "en": "..."}, "sexualDimorphism": "..." },
  "habitat": { "biomes": ["rừng nhiệt đới", "..."], "realm": ["terrestrial"], "description": {...} },
  "distribution": { "countries": ["VN", "IN", "..."], "text": {...}, "gbifOccurrenceMapUrl": "..." },
  "diet": { "type": "carnivore", "preyOrFood": [...], "feedingBehavior": {...} },
  "behavior": { "activityPattern": "nocturnal", "social": "solitary", "communication": {...}, "migration": {...}, "defense": {...}, "text": {...} },
  "lifeCycle": { "stages": [ { "key": "egg|larva|pupa|juvenile|adult...", "name": {...}, "description": {...}, "durationDays": [..] } ], "lifespanYears": { "wild": [..], "captivity": [..] } },
  "reproduction": { "mode": "viviparous|oviparous|...", "matingSystem": "...", "season": "...", "gestationDays": [..], "clutchOrLitterSize": [..], "parentalCare": {...}, "text": {...} },
  "conservation": { "iucn": "EN", "populationTrend": "decreasing", "threats": [...], "assessmentYear": 2022 },
  "ecology": { "predators": [...], "symbiosis": [...], "ecosystemRole": {...} },
  "humanRelations": { "uses": [...], "conflicts": [...], "culturalNotes": {...} },
  "funFacts": [ { "vi": "...", "en": "..." } ],
  "media": {
    "model3d": { "glb": "models/panthera-tigris.glb", "anatomy": "anatomy/panthera-tigris.json", "license": "CC-BY-4.0", "author": "...", "sourceUrl": "..." },
    "images": [ { "url": "...", "license": "CC-BY-SA-4.0", "author": "...", "sourceUrl": "..." } ],
    "silhouette": { "svg": "...", "license": "CC0", "sourceUrl": "..." }
  },
  "provenance": [
    { "field": "behavior.text.vi", "source": "wikipedia-en", "url": "...", "license": "CC-BY-SA-4.0", "retrievedAt": "2026-..", "method": "extracted|llm_summarized|machine_translated", "needsReview": true }
  ]
}
```

Quy tắc bắt buộc:
- **Mọi trường văn bản phải có `provenance`** (nguồn, giấy phép, phương pháp). Trường nào thiếu dữ liệu thì để `null`, **tuyệt đối không bịa**.
- Có file `data/schema/species.schema.json` (JSON Schema) và script `validate-data` chạy được trong CI.
- Có chỉ số độ đầy đủ dữ liệu (`completeness` 0–100) cho mỗi loài, hiển thị trong trang admin nội bộ `/dev/data-quality`.

### 4.2 Schema giải phẫu (`public/anatomy/<slug>.json`)

Ánh xạ **tên node trong file GLB** sang thông tin bộ phận:

```jsonc
{
  "model": "models/panthera-tigris.glb",
  "layers": [
    { "id": "skin", "name": {"vi": "Da và lông", "en": "Skin and fur"}, "default": true },
    { "id": "muscle", "name": {...} },
    { "id": "skeleton", "name": {...} },
    { "id": "digestive", "name": {...} },
    { "id": "respiratory", "name": {...} },
    { "id": "circulatory", "name": {...} },
    { "id": "nervous", "name": {...} },
    { "id": "reproductive", "name": {...} }
  ],
  "parts": [
    {
      "node": "organ_heart",              // tên mesh trong GLB
      "layer": "circulatory",
      "name": { "vi": "Tim", "en": "Heart", "latin": "Cor" },
      "function": { "vi": "...", "en": "..." },
      "description": { "vi": "...", "en": "..." },
      "explodeVector": [0, 0.3, 0],       // hướng tách khi explode view
      "labelAnchor": [0, 0.1, 0],
      "relatedParts": ["organ_lungs"]
    }
  ]
}
```

Quy ước đặt tên node trong GLB: `skin_*`, `muscle_*`, `bone_*`, `organ_*`. Nếu model không có node đặt tên chuẩn, script `scripts/inspect-glb` phải in ra danh sách node để tôi map thủ công, và viewer phải **vẫn hoạt động ở chế độ chỉ xoay** (không có giải phẫu).

## 5. Chiến lược dữ liệu và nguồn miễn phí

Hãy viết pipeline `scripts/pipeline/` gồm các bước tách biệt, chạy lại được (idempotent), ghi log, có `--limit` để test nhanh. Luôn **kiểm tra giấy phép hiện hành ở trang chính thức của từng nguồn trước khi dùng**, ghi vào `docs/DATA_SOURCES.md`, và hiển thị trang **Ghi công / Giấy phép (Credits)** trong web.

### 5.1 Phân loại và tên gọi (xương sống)
1. **GBIF Backbone Taxonomy** (API `api.gbif.org/v1/species`): cây phân loại, tên khoa học chuẩn, `vernacularNames` (lọc `language=eng`, `vie`). Dữ liệu CC0/CC-BY.
2. **Catalogue of Life (ChecklistBank)**: đối chiếu và bổ sung. CC-BY.
3. **ITIS** (public domain) và **NCBI Taxonomy**: đối chiếu khi cần.
4. **Wikidata** (SPARQL, CC0): lấy `taxon name`, `taxon common name` (P1843) theo ngôn ngữ `vi` và `en`, liên kết chéo ID (GBIF, IUCN, iNaturalist, EOL...), ảnh Commons, bài Wikipedia.
5. **Tên tiếng Việt**: ưu tiên (a) Wikidata `vi`, (b) liên kết ngôn ngữ sang **vi.wikipedia.org**, (c) **iNaturalist** (`locale=vi`, `preferred_common_name`), (d) GBIF vernacular `vie`. Nếu vẫn thiếu: dùng LLM dịch tên tiếng Anh nhưng đánh dấu `nameSource.vi = "machine_translated"` và `needsReview: true`; UI hiển thị dấu "chưa kiểm chứng". Có thể bổ sung từ điển tên động vật Việt Nam do tôi cung cấp ở `data/manual/vi-names.csv` (ưu tiên cao nhất).

### 5.2 Nội dung kiến thức (tập tính, chu kỳ sống, sinh sản...)
1. **Wikipedia (en + vi) REST API** (`/api/rest_v1/page/summary`, và Action API để lấy section như Behavior, Reproduction, Life cycle, Diet). Giấy phép **CC BY-SA**: phải ghi công và chia sẻ tương tự cho phần văn bản dẫn xuất.
2. **Animal Diversity Web (animaldiversity.org, ĐH Michigan)**: nội dung chuyên sâu cho nhiều loài (behavior, reproduction, lifespan). Kiểm tra kỹ điều khoản giấy phép (có thể không cho thương mại) trước khi dùng. Nếu hạn chế, chỉ dùng làm tham chiếu và liên kết ra ngoài, không sao chép văn bản.
3. **IUCN Red List API** (cần token miễn phí, điều khoản phi thương mại, đọc kỹ): tình trạng bảo tồn, xu hướng quần thể, mối đe dọa. Nếu giấy phép không phù hợp, dùng trường `conservation_status` từ Wikidata/Wikipedia và link sang IUCN.
4. **Bộ dữ liệu đặc điểm (traits) mở**:
   - **AnAge** (tuổi thọ, HAGR),
   - **PanTHERIA** và **COMBINE** (thú),
   - **AVONET** (chim),
   - **Amniote Life-History Database** (bò sát, chim, thú),
   - **FishBase / SeaLifeBase** (cá và sinh vật biển; kiểm tra giấy phép CC BY-NC),
   - **AmphibiaWeb**, **The Reptile Database** (kiểm tra điều khoản),
   - **EOL TraitBank**, **AnimalTraits**.
   Dùng để điền số liệu định lượng (cân nặng, kích thước, thời gian mang thai, số con, tuổi thọ) vào các trường số, kèm `provenance`.
5. **Tổng hợp bằng LLM (tùy chọn, có kiểm soát)**: chỉ được tóm tắt/viết lại **dựa trên văn bản nguồn đã lấy** (RAG từ Wikipedia/nguồn mở), không dùng kiến thức tự do của mô hình để tạo sự kiện. Mỗi đoạn phải ghi `method: "llm_summarized"`, link nguồn, và `needsReview: true`. Có prompt template trong `scripts/prompts/` và script kiểm tra: mọi con số trong đoạn tóm tắt phải xuất hiện trong văn bản nguồn.

### 5.3 Hình ảnh
- **Wikimedia Commons** (qua Wikidata P18 hoặc Commons API): lưu **tác giả + giấy phép từng ảnh**.
- **iNaturalist API**: ảnh có giấy phép CC (chỉ lấy ảnh CC0/CC-BY/CC-BY-SA, **loại bỏ ảnh "all rights reserved" và CC-NC nếu dự án thương mại**).
- **PhyloPic** (silhouette, CC0/CC-BY): dùng làm icon cho cây phân loại và card loài.

### 5.4 Mô hình 3D và giải phẫu (phần khó nhất — đọc kỹ)
Thực tế: **mô hình 3D giải phẫu đầy đủ, miễn phí, theo từng loài là rất hiếm**. Vì vậy áp dụng chiến lược 3 tầng:

- **Tầng A (Featured, mục tiêu 10–20 loài)**: có model ngoài + giải phẫu nhiều lớp (da/xương/nội tạng) với node đặt tên chuẩn.
- **Tầng B (Template theo lớp/nhóm)**: dùng một model giải phẫu "đại diện" cho cả nhóm (ví dụ: cá xương, ếch, thằn lằn, chim, thú ăn thịt, thú ăn cỏ, côn trùng, mực, sao biển...) và gắn cho các loài cùng nhóm, ghi rõ trên UI "Mô hình đại diện cho nhóm X, không phải chính xác loài này".
- **Tầng C (không có model)**: gallery ảnh + silhouette + sơ đồ 2D, vẫn có đầy đủ thông tin chữ.

Nguồn mô hình 3D miễn phí để agent tìm và tự động tải (chỉ lấy model có giấy phép cho phép, lưu `license/author/sourceUrl`):
- **Sketchfab** (Download API cần token; lọc giấy phép CC0/CC-BY; tìm theo tag `anatomy`, `skeleton`, `skull`, `animal`).
- **Smithsonian 3D Digitization** (3d.si.edu) — nhiều mẫu xương/xác động vật quét 3D, phần lớn **CC0**.
- **NIH 3D** (3d.nih.gov) — một số mô hình sinh học.
- **MorphoSource**, **Phenome10K**, **DigiMorph** — dữ liệu quét CT/xương (giấy phép khác nhau, kiểm tra từng bản ghi; thường cần chuyển đổi từ STL/PLY/OBJ sang GLB).
- **Quaternius, Poly Pizza, Kenney** — model động vật low-poly **CC0** (dùng cho tầng B/phần vỏ ngoài, không có giải phẫu).
- **Blender** (script hóa bằng `bpy`) để chuẩn hóa: đặt tên node, gộp/ tách mesh, giảm poly, bake texture, xuất GLB.

Quy trình xử lý model (`scripts/models/`): tải → kiểm tra giấy phép → `inspect-glb` (in cây node) → chuẩn hóa tên node → tối ưu bằng `gltf-transform` (dedup, prune, weld, simplify, draco/meshopt, texture resize) → ghi vào `public/models/` → sinh khung `anatomy.json` để tôi/agent điền thông tin bộ phận.

Nếu không tìm được model giải phẫu phù hợp cho một loài, **đừng tự bịa hình**; chuyển loài đó sang tầng B hoặc C và ghi vào `docs/MODEL_BACKLOG.md` kèm gợi ý nguồn.

## 6. Tính năng chi tiết

### 6.1 Trang chủ
- Hero 3D nhẹ (một model xoay chậm, có thể đổi ngẫu nhiên mỗi lần vào).
- Ô tìm kiếm lớn, các lối tắt: "Khám phá theo ngành", "Loài ngẫu nhiên", "Mô hình giải phẫu", "Sắp nguy cấp".

### 6.2 Duyệt cây phân loại
- Trang `/taxa/:rank/:name`: breadcrumb, mô tả nhóm, số loài, danh sách con (card có silhouette), biểu đồ cây rút gọn (collapse/expand).
- Trang tổng quan các **ngành** với mô tả ngắn và model đại diện.

### 6.3 Trang loài `/species/:slug`
Bố cục: **viewer 3D** ở trên (hoặc bên trái trên desktop), thông tin ở dưới (tab). Các tab: *Tổng quan · Hình thái · Môi trường & Phân bố · Dinh dưỡng · Tập tính · Chu kỳ sống · Sinh sản · Bảo tồn · Thú vị · Nguồn*.
- Chu kỳ sống hiển thị dạng **timeline/vòng tròn các giai đoạn**, bấm vào giai đoạn để xem mô tả (và nếu có model cho giai đoạn đó thì đổi model).
- Thẻ thông tin nhanh: tên Việt/Anh/khoa học (có nút copy), IUCN badge, kích thước so với người (silhouette tỷ lệ).
- Nút "So sánh với loài khác" (MVP: so sánh 2 loài theo bảng thuộc tính).

### 6.4 Viewer 3D (component `AnimalViewer`)
- Orbit/zoom/pan với giới hạn hợp lý, quán tính mượt, double-click để reset camera.
- Preset camera có animation chuyển (front/back/left/right/top/bottom).
- Auto-rotate bật/tắt, môi trường ánh sáng (HDRI nhẹ) và nền đổi được (sáng/tối/studio).
- Hỗ trợ animation trong GLB (nếu có): chọn clip, play/pause, tốc độ.
- Chụp ảnh màn hình viewer (nút download PNG).
- Chế độ toàn màn hình.

### 6.5 Chế độ giải phẫu (`AnatomyPanel`)
- Danh sách lớp (layer) có toggle ẩn/hiện + slider độ trong suốt từng lớp ("bóc từng lớp" bằng slider tổng từ da đến xương).
- **Explode view**: slider 0–100% tách các bộ phận theo `explodeVector`.
- **Hover** bộ phận: highlight/outline + tooltip tên. **Click**: cô lập bộ phận (làm mờ phần còn lại), camera bay tới, mở thẻ thông tin (tên Việt/Anh/La-tinh, chức năng, mô tả, bộ phận liên quan).
- Nhãn có đường dẫn (leader line) bằng `drei/Html`, bật/tắt được.
- **Mặt cắt**: clipping plane theo trục X/Y/Z có slider.
- Danh sách bộ phận dạng cây ở bên cạnh, click là chọn trong 3D, và ngược lại (đồng bộ 2 chiều).
- Chế độ **"Kiểm tra kiến thức"**: ẩn tên, bấm vào bộ phận được hỏi (quiz nhỏ).

### 6.6 Khác
- Dark/light mode, responsive, hỗ trợ cử chỉ cảm ứng (pinch/rotate), điều khiển bàn phím cơ bản, ARIA cho phần ngoài canvas.
- URL chia sẻ được trạng thái viewer: `?layer=skeleton&part=organ_heart&cam=left`.
- SEO: sinh meta/OG tag, `sitemap.xml`, JSON-LD (`Taxon`) cho trang loài (prerender/SSG nếu khả thi, nếu không ghi vào backlog).
- Trang **Credits** tự sinh từ `provenance` + license của model/ảnh.

## 7. Cấu trúc thư mục gợi ý

```
zoopedia/
  src/
    app/ (router, layout)
    features/ (taxonomy, species, search, viewer, anatomy, credits)
    components/
    lib/ (data loaders, i18n, normalize-vi)
    store/
  public/ (models/, anatomy/, images/, locales/)
  data/ (species/, taxa/, manual/, schema/)
  scripts/ (pipeline/, models/, prompts/, validate-data)
  docs/ (DATA_SOURCES.md, MODEL_BACKLOG.md, DECISIONS.md)
  PROGRESS.md
```

## 8. Milestone (làm tuần tự, mỗi milestone phải chạy được)

**M0 – Khởi tạo**: scaffold, lint/format, CI chạy `validate-data` + vitest, `DECISIONS.md`.

**M1 – Viewer 3D cơ bản**: `AnimalViewer` với 1 model CC0 mẫu, orbit, preset camera, loading/error, fallback không WebGL. Tối ưu cho mobile.

**M2 – Pipeline taxonomy + tên**: lấy cây phân loại động vật từ GBIF cho **~100 loài đa dạng** (phủ ≥ 8 ngành: Chordata, Arthropoda, Mollusca, Annelida, Cnidaria, Echinodermata, Porifera, Platyhelminthes; trong Chordata có đủ thú, chim, bò sát, lưỡng cư, cá). Bổ sung tên Anh/Việt từ Wikidata/iNat/vi.wikipedia. Xuất JSON + schema validation + báo cáo độ đầy đủ.

**M3 – Duyệt và tìm kiếm**: trang chủ, cây phân loại, tìm kiếm bỏ dấu tiếng Việt, bộ lọc, trang loài (chưa có nội dung sâu).

**M4 – Nội dung sinh học**: lấy văn bản và số liệu (mục 5.2), điền `behavior`, `lifeCycle`, `reproduction`, `diet`, `conservation`... kèm `provenance`. Tab loài hiển thị đầy đủ; mục nào thiếu thì hiển thị "Chưa có dữ liệu" kèm nút liên kết nguồn.

**M5 – Giải phẫu**: `AnatomyPanel`, explode view, layer, click/cô lập, mặt cắt, đồng bộ danh sách–3D. Làm với **tối thiểu 3 loài Tầng A** (gợi ý: một loài thú, một loài chim, một loài cá hoặc ếch) và **tối thiểu 3 model Tầng B**.

**M6 – Chu kỳ sống, so sánh, quiz giải phẫu, chia sẻ URL trạng thái.**

**M7 – Hoàn thiện**: SEO, Credits, hiệu năng (Lighthouse mobile ≥ 80), a11y, tài liệu `README.md` hướng dẫn thêm 1 loài mới và 1 model mới.

## 9. Tiêu chí nghiệm thu (Definition of Done)

- `npm run build` sạch, `npm run validate-data` và `vitest` pass.
- Mọi loài hiển thị đủ tên Việt/Anh/khoa học hoặc có cờ "chưa kiểm chứng".
- Mọi ảnh/model/đoạn văn có nguồn + giấy phép hiển thị được ở trang Credits.
- Không có nội dung do LLM sinh mà thiếu cờ `needsReview` và nguồn.
- Viewer chạy mượt trên mobile, có fallback khi lỗi.
- Không hard-code API key; dùng `.env` và `.env.example`.
- Tôn trọng rate limit và `robots.txt` của mọi API/trang nguồn; gửi `User-Agent` có thông tin liên hệ; không scrape trang cấm.

## 10. Quy tắc làm việc

1. Đọc điều khoản giấy phép của nguồn **trước khi** dùng; nếu không chắc, mặc định **không sao chép nội dung**, chỉ liên kết.
2. Không bịa dữ liệu sinh học, không bịa tên Việt. Thiếu thì để `null` và ghi vào báo cáo.
3. Khi cần quyết định lớn (đổi stack, nguồn có giấy phép mơ hồ, model không rõ bản quyền), ghi vào `DECISIONS.md` và chọn phương án an toàn hơn về pháp lý.
4. Ưu tiên MVP chạy được hơn là làm đủ mọi thứ: hoàn thành M0–M5 chắc chắn trước khi làm M6–M7.
5. Cuối mỗi milestone: tóm tắt đã làm gì, còn gì tồn đọng, và hướng dẫn tôi chạy thử (lệnh cụ thể).

Bắt đầu từ **M0** ngay bây giờ.
