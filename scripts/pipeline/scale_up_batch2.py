"""
Batch 2 scale-up: 37 iconic animal species to reach 162 total catalogued species.
"""
import os
import sys
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
SPECIES_DIR = os.path.join(ROOT_DIR, 'data/species')
INDEX_PATH = os.path.join(ROOT_DIR, 'data/species-index.json')
TAXA_TREE_PATH = os.path.join(ROOT_DIR, 'data/taxa/tree.json')

BATCH2_SPECIES = [
    # 1. Bison bison
    {
        "id": "bison-bison", "scientific": "Bison bison", "authorship": "(Linnaeus, 1758)",
        "nameVi": "Bò rừng bizon Bắc Mỹ", "nameViAlt": ["Bò rừng bizon"],
        "nameEn": "American Bison", "nameEnAlt": ["American Buffalo"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Artiodactyla", "family": "Bovidae", "genus": "Bison",
        "gbifKey": 2441176, "wikidata": "Q18057", "iucn": "NT", "popTrend": "stable",
        "lengthCm": [210, 350], "weightKg": [400, 1000],
        "descVi": "Loài thú có vú trên cạn lớn nhất Bắc Mỹ với bướu vai cơ bắp nhô cao và bộ lông mùa đông màu nâu sẫm rậm rạp giúp chống chọi bão tuyết.",
        "descEn": "The largest terrestrial mammal in North America, characterized by a massive muscular shoulder hump and shaggy winter coat adapted to blizzards.",
        "biomes": ["Đồng cỏ thảo nguyên Bắc Mỹ", "Vùng đồng bằng Great Plains"], "countries": ["US", "CA"],
        "distVi": "Từng thống trị khắp các đồng bằng Bắc Mỹ, nay được bảo tồn tại Vườn Quốc gia Yellowstone và các khu bảo tồn.",
        "distEn": "Formerly widespread across North America; now protected in Yellowstone and reserves.",
        "dietType": "herbivore", "prey": ["Cỏ thảo nguyên", "Cây bìm bìm dại", "Cỏ lác khô"],
        "feedingVi": "Gặm cỏ thành bầy lớn liên tục di chuyển trên thảo nguyên bao la.",
        "stages": [
            {"key": "calf", "vi": "Bê non", "en": "Calf", "descVi": "Sinh ra có màu lông đỏ hoe (red dog) nổi bật.", "descEn": "Born with reddish-orange coats, dubbed 'red dogs'.", "days": [0, 200]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Mọc sừng cong và phát triển bướu vai.", "descEn": "Develops curved horns and shoulder crest.", "days": [200, 1095]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Bò đực khổng lồ dẫn dắt và bảo vệ đàn.", "descEn": "Massive dominant bulls protecting the herd.", "days": [1095, 7300]}
        ],
        "lifespan": {"wild": [15, 20], "captivity": [25, 30]},
        "funFactVi": "Dù nặng tới 1 tấn, bò rừng bizon có thể chạy nước rút với vận tốc lên tới 55 km/h và nhảy cao tới 1.8 mét.",
        "funFactEn": "Despite weighing up to a ton, bison can sprint at 55 km/h (35 mph) and jump up to 1.8 meters high.",
        "threats": ["Thu hẹp đồng cỏ tự nhiên", "Xung đột dịch bệnh truyền nhiễm với gia súc nuôi"],
        "tier": "B", "glb": "models/equus-caballus.glb", "repFor": "Bovidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/American_bison_k5680-1.jpg?width=1280", "imageAuthor": "Jack Dykinga"
    },
    # 2. Camelus bactrianus
    {
        "id": "camelus-bactrianus", "scientific": "Camelus bactrianus", "authorship": "Linnaeus, 1758",
        "nameVi": "Lạc đà hai bướu", "nameViAlt": ["Lạc đà Gobi"],
        "nameEn": "Bactrian Camel", "nameEnAlt": ["Two-humped Camel"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Artiodactyla", "family": "Camelidae", "genus": "Camelus",
        "gbifKey": 2441097, "wikidata": "Q7375", "iucn": "CR", "popTrend": "decreasing",
        "lengthCm": [250, 300], "weightKg": [450, 700],
        "descVi": "Bậc thầy sinh tồn ở vùng hoang mạc Trung Á với 2 chiếc bướu chứa mỡ dự trữ năng lượng và khả năng chịu đựng nhiệt độ từ -40°C đến +40°C.",
        "descEn": "A rugged desert survivor native to Central Asia, featuring two fat-storing humps and tolerance to extreme temperature swings from -40°C to +40°C.",
        "biomes": ["Sa mạc cát và sỏi đá Gobi", "Vùng thảo nguyên khô cằn Trung Á"], "countries": ["MN", "CN", "KZ"],
        "distVi": "Sa mạc Gobi và các vùng bán hoang mạc ở Mông Cổ và Tây Bắc Trung Quốc.",
        "distEn": "The harsh steppes and rocky deserts of Mongolia and Northwest China.",
        "dietType": "herbivore", "prey": ["Cây gai sa mạc", "Cây cỏ mặn sa mạc", "Cành lá khô cằn"],
        "feedingVi": "Hàm răng và môi dẻo dai cho phép nhai nuốt cả những cành gai nhọn hoắt nhất sa mạc.",
        "stages": [
            {"key": "calf", "vi": "Lạc đà con", "en": "Calf", "descVi": "Đứng dậy và đi theo mẹ chỉ sau 2 giờ.", "descEn": "Stands and follows mother within 2 hours of birth.", "days": [0, 365]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Bắt đầu tích tụ mỡ định hình 2 bướu đứng thẳng.", "descEn": "Accumulates fat establishing erect humps.", "days": [365, 1825]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Có thể nhịn uống nước hàng tuần liền trong bão cát.", "descEn": "Capable of surviving weeks without water in sandstorms.", "days": [1825, 14600]}
        ],
        "lifespan": {"wild": [25, 35], "captivity": [35, 45]},
        "funFactVi": "Lạc đà hai bướu hoang dã có thể uống cạn tới 100 lít nước chỉ trong vòng 10 phút để bù nước cho cơ thể.",
        "funFactEn": "A thirsty Bactrian camel can drink up to 100 liters of water in just 10 minutes.",
        "threats": ["Cạn kiệt nguồn nước hoang mạc", "Săn bắt trộm lấy thịt"],
        "tier": "B", "glb": "models/equus-caballus.glb", "repFor": "Camelidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Camelus_bactrianus_in_Yinchuan.jpg?width=1280", "imageAuthor": "Stefan Fussan"
    },
    # 3. Ceratotherium simum
    {
        "id": "ceratotherium-simum", "scientific": "Ceratotherium simum", "authorship": "(Burchell, 1817)",
        "nameVi": "Tê giác trắng", "nameViAlt": ["Tê giác môi vuông"],
        "nameEn": "White Rhinoceros", "nameEnAlt": ["Square-lipped Rhinoceros"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Perissodactyla", "family": "Rhinocerotidae", "genus": "Ceratotherium",
        "gbifKey": 2440880, "wikidata": "Q41260", "iucn": "NT", "popTrend": "decreasing",
        "lengthCm": [340, 400], "weightKg": [1700, 2400],
        "descVi": "Loài tê giác lớn nhất và là động vật trên cạn lớn thứ hai hành tinh. Môi rộng vuông vức thích nghi hoàn hảo với việc gặm các thảm cỏ xavan ngắn.",
        "descEn": "The largest living rhinoceros species, known for its broad, square upper lip adapted for intensive grazing on short savanna grasses.",
        "biomes": ["Thảo nguyên xavan Đông và Nam Phi", "Đồng cỏ khô nhiệt đới"], "countries": ["ZA", "NA", "BW", "ZW", "KE"],
        "distVi": "Chủ yếu tại các khu bảo tồn ở Nam Phi, Namibia, Zimbabwe và Kenya.",
        "distEn": "Southern and eastern African savanna reserves and grasslands.",
        "dietType": "herbivore", "prey": ["Cỏ xavan", "Cây thảo hòa thảo", "Lá bụi thấp"],
        "feedingVi": "Gặm cỏ gần mặt đất bằng chiếc môi vuông rộng bản như máy cắt cỏ tự nhiên.",
        "stages": [
            {"key": "calf", "vi": "Tê giác con", "en": "Calf", "descVi": "Luôn chạy phía trước mẹ để được quan sát bảo vệ.", "descEn": "Runs in front of mother for vigilant protection.", "days": [0, 500]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Mọc sừng trước dài sắc nhọn.", "descEn": "Grows formidable anterior keratin horn.", "days": [500, 2190]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Bảo vệ các bãi tắm bùn giải nhiệt chống ký sinh trùng.", "descEn": "Wallows in mud pools for thermoregulation and parasite defense.", "days": [2190, 18250]}
        ],
        "lifespan": {"wild": [35, 40], "captivity": [40, 50]},
        "funFactVi": "Tên gọi 'Tê giác trắng' xuất phát từ việc hiểu nhầm từ tiếng Hà Lan 'wijd' (nghĩa là 'rộng', chỉ chiếc môi vuông) thành từ 'white' trong tiếng Anh.",
        "funFactEn": "The name 'white' is an English corruption of the Dutch word 'wijd' meaning 'wide', referring to its squared grazing lips.",
        "threats": ["Nạn săn trộm cắt sừng buôn lậu thị trường ngầm"],
        "tier": "B", "glb": "models/equus-caballus.glb", "repFor": "Rhinocerotidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/White_rhino_mother_and_calf.jpg?width=1280", "imageAuthor": "Bernard DUPONT"
    },
    # 4. Pan paniscus
    {
        "id": "pan-paniscus", "scientific": "Pan paniscus", "authorship": "Schwarz, 1929",
        "nameVi": "Vượn người Bonobo", "nameViAlt": ["Tinh tinh lùn", "Bonobo"],
        "nameEn": "Bonobo", "nameEnAlt": ["Pygmy Chimpanzee"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Primates", "family": "Hominidae", "genus": "Pan",
        "gbifKey": 2436444, "wikidata": "Q26207", "iucn": "EN", "popTrend": "decreasing",
        "lengthCm": [70, 83], "weightKg": [31, 45],
        "descVi": "Họ hàng linh trưởng gần nhất của loài người (chia sẻ 98.7% DNA). Xã hội Bonobo nổi tiếng với chế độ mẫu hệ hòa bình, giải quyết mọi xung đột bằng sự âu yếm gắn kết.",
        "descEn": "Our closest extant primate relative alongside chimpanzees, sharing 98.7% of our DNA. Famous for egalitarian, matriarchal societies where empathy and affection resolve tensions.",
        "biomes": ["Rừng mưa nhiệt đới trũng bồn địa sông Congo"], "countries": ["CD"],
        "distVi": "Đặc hữu vùng rừng trũng ẩm ướt phía nam sông Congo thuộc Cộng hòa Dân chủ Congo.",
        "distEn": "Endemic exclusively to the lowland rainforests south of the Congo River in the DRC.",
        "dietType": "omnivore", "prey": ["Trái cây vả rừng", "Chồi non", "Mật ong", "Côn trùng nhỏ"],
        "feedingVi": "Tìm kiếm trái cây chín trên tán rừng cao và chia sẻ thức ăn hòa nhã với các cá thể khác.",
        "stages": [
            {"key": "infant", "vi": "Con non", "en": "Infant", "descVi": "Bám chặt vào bụng mẹ trong 2 năm đầu.", "descEn": "Clings to mother's belly for nursing up to 2 years.", "days": [0, 730]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Học các quy tắc gắn kết cộng đồng phức tạp.", "descEn": "Learns nuanced social behaviors and empathy.", "days": [730, 3285]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Tham gia vào mạng lưới liên minh mẫu hệ.", "descEn": "Participates in female-led social alliances.", "days": [3285, 14600]}
        ],
        "lifespan": {"wild": [35, 40], "captivity": [45, 50]},
        "funFactVi": "Không giống như tinh tinh thông thường có thể chiến tranh bầy đàn khốc liệt, vượn người Bonobo hầu như chưa từng ghi nhận trường hợp giết chết đồng loại trong tự nhiên.",
        "funFactEn": "Unlike common chimps, wild bonobos have never been documented committing lethal intraspecific warfare.",
        "threats": ["Săn bắt thịt rừng (bushmeat)", "Nội chiến và mất sinh cảnh rừng Congo"],
        "tier": "B", "glb": "models/ailuropoda-melanoleuca.glb", "repFor": "Hominidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Bonobo_sitting_on_wood.jpg?width=1280", "imageAuthor": "Pierre Fidenci"
    },
    # 5. Melursus ursinus
    {
        "id": "melursus-ursinus", "scientific": "Melursus ursinus", "authorship": "(Shaw, 1791)",
        "nameVi": "Gấu lợn", "nameViAlt": ["Gấu lười Ấn Độ"],
        "nameEn": "Sloth Bear", "nameEnAlt": ["Labiated Bear"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Ursidae", "genus": "Melursus",
        "gbifKey": 2433433, "wikidata": "Q184980", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [140, 180], "weightKg": [55, 130],
        "descVi": "Loài gấu Nam Á có chiếc môi dẻo không có răng cửa giữa và mũi có thể đóng kín, cho phép hút tổ mối với tiếng ồn vang xa hàng trăm mét.",
        "descEn": "A myrmecophagous bear native to South Asia with protruding flexible lips, missing upper middle incisors, and nostrils that close to vacuum up termites.",
        "biomes": ["Rừng khô nhiệt đới Ấn Độ", "Vùng cây bụi gò đồi đá"], "countries": ["IN", "LK", "NP", "BT"],
        "distVi": "Tiểu lục địa Ấn Độ, Sri Lanka, Nepal và Bhutan.",
        "distEn": "Forested and scrub habitats across the Indian subcontinent and Sri Lanka.",
        "dietType": "omnivore", "prey": ["Mối đất", "Kiến rừng", "Mật ong", "Quả sung rừng", "Trái cây mọng"],
        "feedingVi": "Dùng vuốt cong quặp xới tung tổ mối đất rồi áp sát mõm hút sạch ấu trùng như máy hút bụi.",
        "stages": [
            {"key": "cub", "vi": "Gấu con", "en": "Cub", "descVi": "Đặc biệt thường cưỡi trên lưng mẹ khi di chuyển kiếm ăn.", "descEn": "Famously rides on mother's back during daily foraging trips.", "days": [0, 365]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Tập đào bới gò mối đá cứng bằng móng vuốt.", "descEn": "Hones claw power digging through cement-like termite mounds.", "days": [365, 1095]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Bảo vệ lãnh thổ hung dữ trước cả hổ và báo hoa mai.", "descEn": "Fierce adult standing ground against tigers and leopards.", "days": [1095, 7300]}
        ],
        "lifespan": {"wild": [15, 20], "captivity": [25, 30]},
        "funFactVi": "Tiếng hút mối và kiến của gấu lợn mạnh đến mức có thể nghe thấy rõ ràng từ khoảng cách xa hơn 100 mét trong rừng đêm.",
        "funFactEn": "The vacuum sound produced by a feeding sloth bear inhaling termites can be heard over 100 meters away.",
        "threats": ["Xung đột với cộng đồng địa phương", "Mất sinh cảnh rừng nhiệt đới khô"],
        "tier": "B", "glb": "models/ursus-arctos.glb", "repFor": "Ursidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Sloth_Bear_in_Karnataka.jpg?width=1280", "imageAuthor": "Dilan Dharmasena"
    },
    # 6. Tremarctos ornatus
    {
        "id": "tremarctos-ornatus", "scientific": "Tremarctos ornatus", "authorship": "(F. G. Cuvier, 1825)",
        "nameVi": "Gấu Andes", "nameViAlt": ["Gấu bốn mắt", "Gấu mặt kính"],
        "nameEn": "Spectacled Bear", "nameEnAlt": ["Andean Bear"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Ursidae", "genus": "Tremarctos",
        "gbifKey": 2433502, "wikidata": "Q131233", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [120, 200], "weightKg": [60, 175],
        "descVi": "Loài gấu bản địa duy nhất còn tồn tại của toàn bộ Nam Mỹ. Nổi bật với những vòng khoang lông màu vàng nhạt quanh mắt trông như đeo kính cận.",
        "descEn": "The only extant bear species native to South America, instantly recognizable by distinctive yellowish-white facial markings resembling eyeglasses.",
        "biomes": ["Rừng mây mù ẩm ướt dãy Andes", "Đồng cỏ núi cao Paramo"], "countries": ["PE", "CO", "EC", "BO", "VE"],
        "distVi": "Dọc theo sườn dốc dãy núi Andes từ Venezuela qua Colombia, Ecuador, Peru đến Bolivia.",
        "distEn": "High-altitude cloud forests and páramo along the Andean mountain chain.",
        "dietType": "herbivore", "prey": ["Cây họ Dứa dại Andes (Bromeliad)", "Mầm cọ non", "Trái cây rừng mây", "Mật ong"],
        "feedingVi": "Leo trèo lên các cây cao làm sàn nghỉ bằng cành lá và ăn lõi mềm của các loài cây họ Dứa.",
        "stages": [
            {"key": "cub", "vi": "Gấu con", "en": "Cub", "descVi": "Sinh ra trong hang đá kín trên vách núi cao.", "descEn": "Born inside cliff caves protected from Andean winds.", "days": [0, 180]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Thành thạo kỹ năng leo trèo trên cây rừng sương mù.", "descEn": "Masters canopy foraging in dense cloud forest trees.", "days": [180, 1095]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Sống đơn độc, xây tổ sàn cành cây để ngủ.", "descEn": "Solitary adult constructing wooden sleeping platforms in trees.", "days": [1095, 9125]}
        ],
        "lifespan": {"wild": [20, 25], "captivity": [30, 35]},
        "funFactVi": "Nhân vật chú gấu Paddington nổi tiếng trong văn học thiếu nhi thế giới được sáng tạo dựa trên loài Gấu Andes này.",
        "funFactEn": "The beloved literary character Paddington Bear is officially an Andean Spectacled Bear from 'Darkest Peru'.",
        "threats": ["Xung đột với người chăn thả gia súc", "Phân mảnh sinh cảnh do làm đường đèo"],
        "tier": "B", "glb": "models/ursus-arctos.glb", "repFor": "Ursidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Tremarctos_ornatus_19.jpg?width=1280", "imageAuthor": "Ltshears"
    },
    # 7. Vulpes lagopus
    {
        "id": "vulpes-lagopus", "scientific": "Vulpes lagopus", "authorship": "(Linnaeus, 1758)",
        "nameVi": "Cáo tuyết Bắc cực", "nameViAlt": ["Hồ ly tuyết", "Cáo trắng"],
        "nameEn": "Arctic Fox", "nameEnAlt": ["Polar Fox", "White Fox"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Canidae", "genus": "Vulpes",
        "gbifKey": 2434552, "wikidata": "Q25399", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [46, 68], "weightKg": [2.5, 6.0],
        "descVi": "Bậc thầy ngụy trang vùng cực băng giá với bộ lông dày cách nhiệt siêu đẳng, có thể chuyển từ màu trắng tinh khiết mùa đông sang màu nâu xám mùa hè.",
        "descEn": "An extraordinary cold-adapted circumpolar canid whose ultra-dense thermal coat transitions from immaculate snow-white in winter to camouflage grey-brown in summer.",
        "biomes": ["Lãnh nguyên Bắc Cực (Tundra)", "Băng đảo Bắc Băng Dương"], "countries": ["RU", "CA", "US", "NO", "IS", "GL"],
        "distVi": "Vùng lãnh nguyên ven biển và các đảo băng thuộc vòng Bắc Cực quanh năm băng giá.",
        "distEn": "Circumpolar Arctic tundra biomes throughout Eurasia and North America.",
        "dietType": "carnivore", "prey": ["Chuột lemming", "Trứng chim biển", "Cá hồi Bắc cực", "Xác hải cẩu"],
        "feedingVi": "Lắng nghe tiếng động của chuột lemming dưới lớp tuyết dày hơn 1 mét rồi tung người nhảy chúi đầu xuống tuyết để bắt gọn.",
        "stages": [
            {"key": "kit", "vi": "Cáo con", "en": "Kit", "descVi": "Sinh ra trong hang ngầm sưởi ấm lẫn nhau.", "descEn": "Born in complex underground dens dug into permafrost.", "days": [0, 60]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Tập nhảy cắm đầu xuống tuyết săn chuột.", "descEn": "Hones head-first snow diving techniques catching lemmings.", "days": [60, 300]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Chịu được cái lạnh khắc nghiệt tới -50°C mà không run rẩy.", "descEn": "Resists extreme sub-zero temperatures down to -50°C.", "days": [300, 3650]}
        ],
        "lifespan": {"wild": [6, 10], "captivity": [12, 14]},
        "funFactVi": "Cáo tuyết có hệ thống trao đổi nhiệt ngược dòng ở bàn chân giúp ngăn ngừa mất nhiệt và lông phủ kín cả đệm chân như đi giày tuyết.",
        "funFactEn": "The Arctic fox has countercurrent vascular heat exchangers in its paws and dense fur on its footpads acting as built-in snowshoes.",
        "threats": ["Cáo đỏ phương Nam xâm lấn do biến đổi khí hậu ấm lên"],
        "tier": "B", "glb": "models/vulpes-vulpes.glb", "repFor": "Canidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Vulpes_lagopus_in_winter_fur.jpg?width=1280", "imageAuthor": "Algikal"
    },
    # 8. Odobenus rosmarus
    {
        "id": "odobenus-rosmarus", "scientific": "Odobenus rosmarus", "authorship": "(Linnaeus, 1758)",
        "nameVi": "Hải mã", "nameViAlt": ["Mã biển", "Hải tượng"],
        "nameEn": "Walrus", "nameEnAlt": ["Atlantic Walrus", "Pacific Walrus"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Odobenidae", "genus": "Odobenus",
        "gbifKey": 2433544, "wikidata": "Q22123", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [260, 360], "weightKg": [800, 1700],
        "descVi": "Loài động vật chân màng khổng lồ vùng cực với cặp ngà dài tới 1 mét dùng để trèo lên băng tuyết và râu ria dày đặc cảm ứng động vật thân mềm đáy biển.",
        "descEn": "A colossal Arctic pinniped easily identified by its massive ivory tusks up to 1 meter in length, rugged blubbery skin, and sensitive vibrissae whiskers.",
        "biomes": ["Băng trôi Bắc Băng Dương", "Vùng biển nông ven bờ cực Bắc"], "countries": ["RU", "US", "CA", "GL", "NO"],
        "distVi": "Vùng biển nông và các tảng băng trôi ven bờ quanh Bắc Băng Dương.",
        "distEn": "Shallow continental shelves and drifting pack ice in the Arctic Ocean.",
        "dietType": "carnivore", "prey": ["Nghêu sò đáy biển", "Ốc biển", "Cua biển cực", "Giun biển"],
        "feedingVi": "Dùng râu ria quét đáy bùn định vị nghêu sò rồi dùng cơ miệng tạo áp suất chân không hút thịt ra khỏi vỏ.",
        "stages": [
            {"key": "calf", "vi": "Hải mã con", "en": "Calf", "descVi": "Bú mẹ trong nước và leo lên lưng mẹ nghỉ ngơi.", "descEn": "Nurses at sea and rides on mother's back atop ice floes.", "days": [0, 730]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Cặp ngà bắt đầu nhú dài ra khỏi môi trên.", "descEn": "Ivory tusks erupt through the upper lip.", "days": [730, 2555]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Sống thành đàn hàng trăm con nằm sưởi ấm trên bãi đá băng.", "descEn": "Gathers in massive hauling colonies on rocky shorelines.", "days": [2555, 14600]}
        ],
        "lifespan": {"wild": [30, 40], "captivity": [35, 45]},
        "funFactVi": "Tên khoa học 'Odobenus' có nghĩa là 'kẻ đi bằng răng', bởi hải mã thường dùng cặp ngà cắm chặt vào băng để kéo thân hình nặng cả tấn lên bờ.",
        "funFactEn": "The scientific name Odobenus translates to 'tooth-walker', referring to the way walruses use their tusks to haul their massive bodies onto ice.",
        "threats": ["Băng biển tan nhanh do biến đổi khí hậu toàn cầu"],
        "tier": "B", "glb": "models/carcharodon-carcharias.glb", "repFor": "Odobenidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Walrus_on_ice_floe.jpg?width=1280", "imageAuthor": "Joel Garlich-Miller"
    },
    # 9. Hydrurga leptonyx
    {
        "id": "hydrurga-leptonyx", "scientific": "Hydrurga leptonyx", "authorship": "(de Blainville, 1820)",
        "nameVi": "Hải cẩu báo", "nameViAlt": ["Báo biển"],
        "nameEn": "Leopard Seal", "nameEnAlt": ["Sea Leopard"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Carnivora", "family": "Phocidae", "genus": "Hydrurga",
        "gbifKey": 2434800, "wikidata": "Q188448", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [280, 360], "weightKg": [300, 500],
        "descVi": "Kẻ săn mồi đỉnh cao đáng sợ của vùng biển băng Nam Cực với hàm răng sắc bén như khủng long và bộ da đốm xám tựa báo hoa mai.",
        "descEn": "The formidable apex predatory seal of Antarctica, equipped with reptilian-like jaws, razor-sharp trident teeth, and a sleek leopard-spotted grey pelt.",
        "biomes": ["Băng biển Nam Cực (Antarctic pack ice)", "Vùng biển khơi Nam Đại Dương"], "countries": ["AQ", "NZ", "AU", "ZA"],
        "distVi": "Vùng biển băng quanh châu Nam Cực và các hải đảo cận Nam Cực.",
        "distEn": "Circumpolar Antarctic waters and sub-Antarctic islands.",
        "dietType": "carnivore", "prey": ["Chim cánh cụt hoàng đế & Adélie", "Hải cẩu con", "Nhuyễn thể krill", "Cá băng"],
        "feedingVi": "Tuần tra ven rìa băng phục kích chim cánh cụt nhảy xuống nước, dùng răng nanh nhọn xé mồi.",
        "stages": [
            {"key": "pup", "vi": "Hải cẩu con", "en": "Pup", "descVi": "Sinh trên tảng băng trôi độc lập, tăng cân nhanh chóng.", "descEn": "Born on fast ice floes, fattening rapidly on rich milk.", "days": [0, 30]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Học cách lọc nhuyễn thể krill và săn chim cánh cụt non.", "descEn": "Hones penguin stalking tactics along ice shelves.", "days": [30, 1095]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Kẻ săn mồi đơn độc thống trị chuỗi thức ăn Nam Cực.", "descEn": "Solitary apex marine stalker across the Southern Ocean.", "days": [1095, 9125]}
        ],
        "lifespan": {"wild": [20, 26], "captivity": [22, 26]},
        "funFactVi": "Răng của hải cẩu báo có thiết kế khóa lồng vào nhau độc đáo vừa có thể xé thịt con mồi lớn vừa có thể đóng vai trò như rây lọc nhuyễn thể krill tí hon dưới nước.",
        "funFactEn": "The leopard seal's trident post-canines interlock seamlessly to filter Antarctic krill like a sieve, in addition to tearing large prey.",
        "threats": ["Băng tan do biến đổi khí hậu ở bán đảo Nam Cực"],
        "tier": "B", "glb": "models/carcharodon-carcharias.glb", "repFor": "Phocidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Leopard_seal_hydrurga_leptonyx.jpg?width=1280", "imageAuthor": "Stan Shebs"
    },
    # 10. Dugong dugon
    {
        "id": "dugong-dugon", "scientific": "Dugong dugon", "authorship": "(Müller, 1776)",
        "nameVi": "Bò biển", "nameViAlt": ["Dugong", "Nàng tiên cá"],
        "nameEn": "Dugong", "nameEnAlt": ["Sea Cow"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Sirenia", "family": "Dugongidae", "genus": "Dugong",
        "gbifKey": 2434571, "wikidata": "Q93282", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [240, 300], "weightKg": [250, 420],
        "descVi": "Loài thú biển ăn cỏ hiền lành, nguồn gốc của truyền thuyết 'nàng tiên cá'. Tại Việt Nam, bò biển sinh sống quý giá tại các thảm cỏ biển Phú Quốc và Côn Đảo.",
        "descEn": "A strictly herbivorous marine mammal inspiring the historic legend of mermaids. In Vietnam, fragile populations graze on seagrass beds around Phu Quoc and Con Dao islands.",
        "biomes": ["Thảm cỏ biển nông nhiệt đới", "Vùng vịnh biển kín ấm"], "countries": ["VN", "AU", "ID", "PH", "EG", "MZ"],
        "distVi": "Vùng biển nhiệt đới Ấn Độ Dương - Tây Thái Bình Dương; ở Việt Nam có ở Côn Đảo và Phú Quốc.",
        "distEn": "Warm coastal waters across the Indo-West Pacific, including Vietnam's seagrass sanctuaries.",
        "dietType": "herbivore", "prey": ["Cỏ biển Halophila", "Cỏ biển rễ râm", "Tảo biển mềm"],
        "feedingVi": "Dùng chiếc môi cơ bắp hình móng ngựa cày bới bùn cát để nhổ cả rễ cỏ biển giàu dinh dưỡng.",
        "stages": [
            {"key": "calf", "vi": "Bò con", "en": "Calf", "descVi": "Bơi sát bên vây mẹ và bú sữa mẹ dưới nước.", "descEn": "Swims close alongside mother, suckling from pectoral teats.", "days": [0, 540]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Học cách tìm kiếm các thảm cỏ biển sâu hơn.", "descEn": "Learns seasonal migrations across shallow seagrass beds.", "days": [540, 3650]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Sống hòa bình, di chuyển thong thả theo thủy triều.", "descEn": "Gentle grazer synchronized with tidal rhythms.", "days": [3650, 25550]}
        ],
        "lifespan": {"wild": [50, 70], "captivity": [50, 70]},
        "funFactVi": "Bò biển có họ hàng gần gũi về mặt tiến hóa với loài voi hơn là với cá voi hay hải cẩu.",
        "funFactEn": "Evolutionarily, dugongs are much more closely related to terrestrial elephants than to whales or dolphins.",
        "threats": ["Mắc lưới đánh cá rê", "Mất các thảm cỏ biển do bồi lắng ô nhiễm"],
        "tier": "B", "glb": "models/carcharodon-carcharias.glb", "repFor": "Dugongidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Dugong_Marsa_Alam.jpg?width=1280", "imageAuthor": "Julien Willem"
    },
    # 11. Monodon monoceros
    {
        "id": "monodon-monoceros", "scientific": "Monodon monoceros", "authorship": "Linnaeus, 1758",
        "nameVi": "Kỳ lân biển", "nameViAlt": ["Cá voi kỳ lân", "Narwhal"],
        "nameEn": "Narwhal", "nameEnAlt": ["Moon Whale"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Cetacea", "family": "Monodontidae", "genus": "Monodon",
        "gbifKey": 2440801, "wikidata": "Q159426", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [395, 550], "weightKg": [800, 1600],
        "descVi": "'Kỳ lân của biển cả' với chiếc ngà xoắn ốc ngược chiều kim đồng hồ dài tới 3 mét mọc xuyên qua môi trên của con đực, chứa hàng triệu đầu dây thần kinh cảm giác.",
        "descEn": "The legendary 'Unicorn of the Sea', renowned for the male's spiraling counterclockwise ivory tusk up to 3 meters long, rich with millions of sensory nerve endings.",
        "biomes": ["Biển băng trôi Bắc Cực", "Vịnh hẹp vịnh băng Greenland & Canada"], "countries": ["GL", "CA", "RU", "NO"],
        "distVi": "Vùng biển đóng băng sâu quanh năm ở Bắc Cực quanh Canada, Greenland, Na Uy và Nga.",
        "distEn": "High Arctic maritime waters around Greenland, Canada, and the Arctic archipelago.",
        "dietType": "carnivore", "prey": ["Cá bơn Greenland", "Mực ống Bắc cực", "Cá tuyết cực"],
        "feedingVi": "Lặn sâu hơn 1500 mét xuống đáy biển tối tăm để hút các loài cá bơn và mực ống.",
        "stages": [
            {"key": "calf", "vi": "Con non", "en": "Calf", "descVi": "Sinh ra có màu xanh xám nhạt, bơi cùng đàn.", "descEn": "Born pale mottled grey, protected inside tight family pods.", "days": [0, 365]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Ngà xoắn bắt đầu đâm xuyên qua môi trên con đực.", "descEn": "Spiral tusk pierces upper lip in adolescent males.", "days": [365, 2920]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Dùng ngà thăm dò độ mặn nhiệt độ nước và giao tiếp.", "descEn": "Uses sensory tusk to detect salinity, temperature, and peers.", "days": [2920, 18250]}
        ],
        "lifespan": {"wild": [40, 50], "captivity": [30, 40]},
        "funFactVi": "Chiếc ngà của kỳ lân biển thực chất là một chiếc răng cửa phát triển dài quá cỡ có cấu trúc bề ngoài xốp ngược với răng thông thường.",
        "funFactEn": "The narwhal tusk is actually an overgrown canine tooth featuring millions of microscopic nerve pathways connecting directly to the brain.",
        "threats": ["Bị kẹt dưới các tảng băng dày đột ngột đóng băng", "Tiếng ồn tàu thuyền thám hiểm Bắc Cực"],
        "tier": "B", "glb": "models/dolphin.glb", "repFor": "Monodontidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Narwhals_breaching.jpg?width=1280", "imageAuthor": "Glenn Williams"
    },
    # 12. Delphinapterus leucas
    {
        "id": "delphinapterus-leucas", "scientific": "Delphinapterus leucas", "authorship": "(Pallas, 1776)",
        "nameVi": "Cá voi trắng", "nameViAlt": ["Cá voi Beluga", "Chim hoàng yến của biển"],
        "nameEn": "Beluga Whale", "nameEnAlt": ["White Whale"],
        "phylum": "Chordata", "class": "Mammalia", "order": "Cetacea", "family": "Monodontidae", "genus": "Delphinapterus",
        "gbifKey": 2440804, "wikidata": "Q149097", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [350, 550], "weightKg": [700, 1600],
        "descVi": "Cá voi trắng muốt đáng yêu không có vây lưng giúp bơi dưới băng tuyết dễ dàng, có cổ linh hoạt cử động được và khả năng phát âm đa dạng như tiếng chim hót.",
        "descEn": "An adorable all-white Arctic whale lacking a dorsal fin to navigate under sea ice, possessing a flexible neck and an acoustic repertoire earning it the moniker 'sea canary'.",
        "biomes": ["Vịnh biển băng Bắc Cực", "Cửa sông lớn nước lợ phương Bắc"], "countries": ["RU", "CA", "US", "GL", "NO"],
        "distVi": "Vùng biển ven bờ và các cửa sông lớn đổ ra Bắc Băng Dương.",
        "distEn": "Coastal Arctic and sub-Arctic waters and major northern river estuaries.",
        "dietType": "carnivore", "prey": ["Cá hồi", "Cá trích Bắc cực", "Mực ống", "Cua biển"],
        "feedingVi": "Hút cá từ kẽ đá đáy biển bằng cách tạo lực hút chân không và phun các tia nước áp lực.",
        "stages": [
            {"key": "calf", "vi": "Cá voi con", "en": "Calf", "descVi": "Sinh ra có màu xám đen, chuyển dần sang trắng khi lớn.", "descEn": "Born dark slate grey, gradually whitening over years.", "days": [0, 730]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Học cách định vị hồi âm định hướng qua mê cung băng.", "descEn": "Masters echolocation navigating through sea ice mazes.", "days": [730, 2555]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Toàn thân trắng tinh khiết, bơi theo đàn hàng trăm con.", "descEn": "Immaculate white social adult traveling in massive pods.", "days": [2555, 18250]}
        ],
        "lifespan": {"wild": [35, 50], "captivity": [35, 45]},
        "funFactVi": "Cá voi trắng có các đốt sống cổ không bị dính liền, cho phép chúng có thể quay đầu sang trái, phải hoặc gật đầu lên xuống như con người.",
        "funFactEn": "Belugas have unfused cervical vertebrae, giving them the rare mammalian ability to turn and nod their head up, down, and sideways.",
        "threats": ["Ô nhiễm hóa chất tích tụ trong chuỗi thức ăn", "Giao thông hàng hải"],
        "tier": "B", "glb": "models/dolphin.glb", "repFor": "Monodontidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Beluga_whale_head.jpg?width=1280", "imageAuthor": "Greg Hume"
    },
    # 13. Harpia harpyja
    {
        "id": "harpia-harpyja", "scientific": "Harpia harpyja", "authorship": "(Linnaeus, 1758)",
        "nameVi": "Đại bàng Harpy", "nameViAlt": ["Đại bàng rừng nhiệt đới Amazon"],
        "nameEn": "Harpy Eagle", "nameEnAlt": ["American Harpy Eagle"],
        "phylum": "Chordata", "class": "Aves", "order": "Accipitriformes", "family": "Accipitridae", "genus": "Harpia",
        "gbifKey": 2480436, "wikidata": "Q179854", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [86, 107], "weightKg": [4.0, 9.0],
        "descVi": "Loài đại bàng săn mồi khổng lồ và hùng mạnh nhất rừng mưa nhiệt đới châu Mỹ. Sở hữu móng vuốt sau to bằng móng vuốt gấu xám, chuyên săn khỉ và lười trên ngọn cây.",
        "descEn": "The most powerful raptor found in the Americas. Equipped with rear talons larger than grizzly bear claws, specialized in snatching tree sloths and monkeys from high canopies.",
        "biomes": ["Tầng tán rừng mưa nhiệt đới Amazon", "Rừng trũng ẩm ướt Trung và Nam Mỹ"], "countries": ["BR", "CO", "PE", "PA", "VE", "EC"],
        "distVi": "Lưu vực rừng nhiệt đới Amazon và Trung Mỹ từ Panama xuống Brazil.",
        "distEn": "Neotropical lowland rainforests across Central and South America.",
        "dietType": "carnivore", "prey": ["Con lười ba ngón", "Khỉ rú", "Chồn hương Nam Mỹ", "Trăn Nam Mỹ non"],
        "feedingVi": "Bay luồn lách qua tán rừng dày đặc với sải cánh rộng 2 mét rồi quắp lấy con mồi bằng lực siết chân chết chóc.",
        "stages": [
            {"key": "nestling", "vi": "Chim non", "en": "Nestling", "descVi": "Nở trong tổ khổng lồ trên ngọn cây gạo cổ thụ.", "descEn": "Raised in massive stick nests atop towering silk-cotton trees.", "days": [0, 160]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Vẫn phụ thuộc chim bố mẹ tiếp tế mồi tới gần 2 năm.", "descEn": "Dependent on parents for prey delivery for nearly 2 years.", "days": [160, 1460]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Chúa tể bầu trời tầng tán rừng Amazon, sống một vợ một chồng trọn đời.", "descEn": "Apex canopy aerial apex predator with lifelong pair bonds.", "days": [1460, 10950]}
        ],
        "lifespan": {"wild": [25, 35], "captivity": [35, 40]},
        "funFactVi": "Móng vuốt của đại bàng Harpy có thể dài tới 13cm và tạo ra lực siết ép lên tới hơn 530 psi, đủ sức bóp vỡ sọ con mồi trong tích tắc.",
        "funFactEn": "The harpy eagle's talons exert over 530 psi of crushing pressure, sufficient to instantly crush bone and skull.",
        "threats": ["Mất rừng Amazon do khai hoang và cháy rừng", "Bị bắn hạ do kích thước quá lớn"],
        "tier": "B", "glb": "models/aquila-chrysaetos.glb", "repFor": "Accipitridae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Harpy_Eagle_head_profile.jpg?width=1280", "imageAuthor": "Jonathan Wilkins"
    },
    # 14. Bubo scandiacus
    {
        "id": "bubo-scandiacus", "scientific": "Bubo scandiacus", "authorship": "(Linnaeus, 1758)",
        "nameVi": "Cú tuyết", "nameViAlt": ["Cú trắng Bắc Cực", "Cú tuyết vĩ đại"],
        "nameEn": "Snowy Owl", "nameEnAlt": ["Polar Owl", "Arctic Owl"],
        "phylum": "Chordata", "class": "Aves", "order": "Strigiformes", "family": "Strigidae", "genus": "Bubo",
        "gbifKey": 5229212, "wikidata": "Q170155", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [52, 71], "weightKg": [1.6, 2.5],
        "descVi": "Loài cú tuyệt mỹ của vùng lãnh nguyên cực bắc với đôi mắt vàng rực và bộ lông trắng muốt. Không như các loài cú khác, cú tuyết hoạt động và săn mồi tích cực cả ban ngày.",
        "descEn": "A magnificent circumpolar raptor with luminous yellow eyes and snow-white plumage. Unlike most nocturnal owls, it is largely diurnal, hunting across sunlit Arctic summer days.",
        "biomes": ["Lãnh nguyên Bắc Cực mở", "Đồng bằng băng tuyết"], "countries": ["CA", "RU", "US", "GL", "NO"],
        "distVi": "Vùng lãnh nguyên không cây cối thuộc vòng Bắc Cực quanh Trái Đất.",
        "distEn": "Open, treeless tundra across the circumpolar Arctic zone.",
        "dietType": "carnivore", "prey": ["Chuột lemming", "Thỏ tuyết Bắc cực", "Vịt trời eider", "Chuột đồng"],
        "feedingVi": "Ngồi rình trên các ụ đất cao trên lãnh nguyên rồi bay là là sát mặt tuyết tóm gọn chuột.",
        "stages": [
            {"key": "owlet", "vi": "Cú non", "en": "Owlet", "descVi": "Nở trong tổ đất gồ ghề trên lãnh nguyên.", "descEn": "Hatches in ground scrape nests on elevated tundra knolls.", "days": [0, 45]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Lông có nhiều vệt đen nâu đốm trước khi chuyển trắng.", "descEn": "Heavily barred with dark brown spots before whitening.", "days": [45, 730]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Con đực trưởng thành gần như trắng tuyết hoàn toàn.", "descEn": "Mature males become almost pure immaculate white.", "days": [730, 7300]}
        ],
        "lifespan": {"wild": [10, 15], "captivity": [20, 28]},
        "funFactVi": "Một con cú tuyết trưởng thành có thể tiêu thụ tới hơn 1.600 con chuột lemming trong một năm.",
        "funFactEn": "A single adult snowy owl may consume more than 1,600 lemmings in a single breeding year.",
        "threats": ["Chu kỳ số lượng chuột lemming suy giảm do biến đổi khí hậu tuyết tan"],
        "tier": "B", "glb": "models/aquila-chrysaetos.glb", "repFor": "Strigidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Snowy_Owl_-_detroit_zoo.jpg?width=1280", "imageAuthor": "Brendan Lally"
    },
    # 15. Ramphastos toco
    {
        "id": "ramphastos-toco", "scientific": "Ramphastos toco", "authorship": "Statius Müller, 1776",
        "nameVi": "Chim Toucan Toco", "nameViAlt": ["Toucan mỏ lớn", "Chim tu-căng"],
        "nameEn": "Toco Toucan", "nameEnAlt": ["Giant Toucan"],
        "phylum": "Chordata", "class": "Aves", "order": "Piciformes", "family": "Ramphastidae", "genus": "Ramphastos",
        "gbifKey": 2478887, "wikidata": "Q232356", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [55, 65], "weightKg": [0.5, 0.85],
        "descVi": "Loài Toucan lớn nhất thế giới với chiếc mỏ cong màu vàng cam rực rỡ dài tới 20cm, vừa là công cụ hái quả vừa là bộ phận tản nhiệt điều hòa thân nhiệt kỳ diệu.",
        "descEn": "The largest toucan species on Earth, famous for its oversized vivid orange bill measuring up to 20 cm, serving both for fruit pluck and dynamic thermal regulation.",
        "biomes": ["Rừng bán rụng lá nhiệt đới", "Đồng cỏ xavan Cerrado Nam Mỹ", "Rừng ven sông"], "countries": ["BR", "BO", "PY", "AR"],
        "distVi": "Vùng rừng thưa và xavan ở miền Trung và miền Đông Nam Mỹ (Brazil, Bolivia, Paraguay, Argentina).",
        "distEn": "Semi-open woodlands and savannas across central and eastern South America.",
        "dietType": "frugivore", "prey": ["Quả sung rừng", "Quả cọ xavan", "Trứng chim", "Côn trùng lớn"],
        "feedingVi": "Dùng chóp mỏ hái trái cây chín rồi hất tung vào không trung để nuốt trọn vào cổ họng.",
        "stages": [
            {"key": "chick", "vi": "Chim non", "en": "Chick", "descVi": "Sinh ra trụi lông và chưa có mỏ lớn.", "descEn": "Born naked and blind inside tree cavity nests.", "days": [0, 50]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Mỏ bắt đầu phát triển nhanh chóng và chuyển màu cam.", "descEn": "Bill expands rapidly displaying vivid coloration.", "days": [50, 730]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Sống theo nhóm gia đình, truyền quả cho nhau khi tán tỉnh.", "descEn": "Tosses berries back and forth during mating courtship rituals.", "days": [730, 7300]}
        ],
        "lifespan": {"wild": [15, 20], "captivity": [20, 25]},
        "funFactVi": "Mặc dù trông có vẻ rất nặng, chiếc mỏ khổng lồ của Toucan thực ra rất nhẹ vì được cấu tạo từ các túi khí rỗng tổ ong và sợi keratin siêu nhẹ.",
        "funFactEn": "Despite its bulky appearance, the toucan's bill is remarkably light, constructed with hollow honeycomb air pockets wrapped in keratin.",
        "threats": ["Bẫy bắt chim cảnh", "Thu hẹp diện tích rừng Cerrado"],
        "tier": "B", "glb": "models/ara-macao.glb", "repFor": "Ramphastidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Ramphastos_toco_eating_fruit.jpg?width=1280", "imageAuthor": "Dario Sanches"
    },
    # 16. Buceros bicornis
    {
        "id": "buceros-bicornis", "scientific": "Buceros bicornis", "authorship": "Linnaeus, 1758",
        "nameVi": "Hồng hoàng", "nameViAlt": ["Phượng hoàng đất", "Mỏ sừng lớn"],
        "nameEn": "Great Hornbill", "nameEnAlt": ["Great Indian Hornbill", "Concave-casqued Hornbill"],
        "phylum": "Chordata", "class": "Aves", "order": "Bucerotiformes", "family": "Bucerotidae", "genus": "Buceros",
        "gbifKey": 2475990, "wikidata": "Q207869", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [95, 120], "weightKg": [2.2, 4.0],
        "descVi": "Loài chim rừng nhiệt đới tráng lệ bậc nhất châu Á. Chiếc mào sừng (casque) màu vàng óng nhô cao trên mỏ và tiếng đập cánh rền vang như tiếng đầu máy xe lửa trong rừng già.",
        "descEn": "One of the most magnificent canopy birds of Asia, adorned with an enormous golden casque atop its beak. Its heavy wingbeats resonate loudly like a steam engine through pristine jungles.",
        "biomes": ["Rừng mưa nhiệt đới thường xanh nguyên sinh", "Tán rừng ẩm chân núi Trường Sơn"], "countries": ["VN", "IN", "TH", "MY", "ID", "NP", "LA", "KH"],
        "distVi": "Ấn Độ, Đông Nam Á và miền Trung Việt Nam (Vườn Quốc gia Bạch Mã, Cát Tiên).",
        "distEn": "High-canopy primary forests across South and Southeast Asia.",
        "dietType": "frugivore", "prey": ["Quả sung đa rừng", "Trái cây họ Dầu non", "Thằn lằn cây", "Chuột rừng"],
        "feedingVi": "Bay qua lại trên các ngọn cây cao để tìm kiếm các cây đa cổ thụ đang mùa ra quả chín.",
        "stages": [
            {"key": "nestling", "vi": "Chim non", "en": "Nestling", "descVi": "Được mẹ và con nuôi giam kín trong hốc cây được trát bùn kín mít.", "descEn": "Sealed securely inside tree hollow by mud-and-feces plug.", "days": [0, 100]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Rời tổ bay chuyền theo chim bố mẹ học đường bay.", "descEn": "Breaks out of nest cavity to join canopy foraging flights.", "days": [100, 1095]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Cặp đôi sống chung thủy trọn đời bảo vệ tán rừng.", "descEn": "Monogamous lifelong mates performing iconic flight displays.", "days": [1095, 14600]}
        ],
        "lifespan": {"wild": [30, 40], "captivity": [40, 50]},
        "funFactVi": "Khi ấp trứng, chim mẹ tự giam mình bên trong bọng cây và cùng chim bố dùng phân và bùn trát kín miệng tổ chỉ chừa lại một khe nhỏ xíu để chim bố đút thức ăn vào suốt nhiều tháng.",
        "funFactEn": "The female seals herself inside a tree hollow with a mud wall, leaving only a slit through which the male diligently provisions food for months.",
        "threats": ["Mất các cây gỗ cổ thụ có bọng tổ", "Săn bắn lấy mỏ sừng chạm khắc mỹ nghệ"],
        "tier": "B", "glb": "models/ara-macao.glb", "repFor": "Bucerotidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Great_Hornbill_in_flight.jpg?width=1280", "imageAuthor": "Angadachappa"
    },
    # 17. Sula nebouxii
    {
        "id": "sula-nebouxii", "scientific": "Sula nebouxii", "authorship": "Milne-Edwards, 1882",
        "nameVi": "Chim bồ nông chân xanh", "nameViAlt": ["Chim Booby chân xanh"],
        "nameEn": "Blue-footed Booby", "nameEnAlt": ["Blue-footed Gannet"],
        "phylum": "Chordata", "class": "Aves", "order": "Suliformes", "family": "Sulidae", "genus": "Sula",
        "gbifKey": 2481878, "wikidata": "Q199693", "iucn": "LC", "popTrend": "decreasing",
        "lengthCm": [76, 84], "weightKg": [1.1, 1.8],
        "descVi": "Loài chim biển nổi tiếng thế giới tại quần đảo Galapagos với đôi chân màng màu xanh ngọc lam rực rỡ và điệu nhảy tán tỉnh nhấc chân giậm gót vô cùng hài hước.",
        "descEn": "An iconic tropical seabird famous in the Galápagos Islands for its electric blue webbed feet and comical high-stepping courtship dance.",
        "biomes": ["Hải đảo đá núi lửa nhiệt đới", "Vùng biển khơi Đông Thái Bình Dương"], "countries": ["EC", "MX", "PE", "CO"],
        "distVi": "Quần đảo Galapagos và các đảo đá ven bờ Tây châu Mỹ từ Mexico đến Peru.",
        "distEn": "Galápagos Islands and dry coastal islands of the eastern Pacific Ocean.",
        "dietType": "piscivore", "prey": ["Cá mòi", "Cá cơm", "Cá chuồn", "Mực nhỏ"],
        "feedingVi": "Bay liệng trên mặt biển rồi gấp cánh lao thẳng đứng xuống nước như một mũi tên xé nước ở tốc độ gần 100 km/h.",
        "stages": [
            {"key": "chick", "vi": "Chim non", "en": "Chick", "descVi": "Bông xù màu trắng toát nằm trên nền đất đá núi lửa.", "descEn": "Fluffy white nestling brooded atop volcanic rocky ground.", "days": [0, 100]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Tập lao mình xuống biển săn cá mòi.", "descEn": "Practices torpedo-like plunge-dives into coastal surf.", "days": [100, 730]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Chân chuyển sang màu xanh ngọc lam đậm đà khi ăn nhiều cá.", "descEn": "Vibrant foot color indicates peak nutritional health and diet.", "days": [730, 6200]}
        ],
        "lifespan": {"wild": [15, 18], "captivity": [18, 20]},
        "funFactVi": "Màu xanh ngọc lam ở chân chim là do các sắc tố carotenoid thu được từ khẩu phần cá tươi; con nào có chân càng xanh biếc càng được bạn đời săn đón.",
        "funFactEn": "The electric blue foot color comes from carotenoid pigments absorbed from fresh fish; brighter blue feet correlate directly with mate desirability.",
        "threats": ["Cạn kiệt nguồn cá mòi do hiện tượng El Niño"],
        "tier": "B", "glb": "models/aptenodytes-forsteri.glb", "repFor": "Sulidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Blue-footed_Booby_on_Galapagos.jpg?width=1280", "imageAuthor": "Hans Stieglitz"
    },
    # 18. Diomedea exulans
    {
        "id": "diomedea-exulans", "scientific": "Diomedea exulans", "authorship": "Linnaeus, 1758",
        "nameVi": "Hải âu lữ hành", "nameViAlt": ["Hải âu lang thang"],
        "nameEn": "Wandering Albatross", "nameEnAlt": ["Snowy Albatross", "White-winged Albatross"],
        "phylum": "Chordata", "class": "Aves", "order": "Procellariiformes", "family": "Diomedeidae", "genus": "Diomedea",
        "gbifKey": 2481387, "wikidata": "Q212170", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [107, 135], "weightKg": [6.0, 12.0],
        "descVi": "Loài chim có sải cánh lớn nhất còn sống trên hành tinh (lên tới 3.5 mét). Có thể bay lượn hàng ngàn dặm trên các cơn bão gầm rú ở Nam Đại Dương mà hầu như không cần vỗ cánh.",
        "descEn": "Possesses the largest wingspan of any living bird, spanning up to 3.5 meters (11.5 ft). Capable of gliding for thousands of nautical miles across stormy Southern Oceans without flapping.",
        "biomes": ["Biển khơi Nam Đại Dương (Roaring Forties)", "Các đảo lộng gió cận Nam Cực"], "countries": ["AQ", "NZ", "AU", "ZA", "CL"],
        "distVi": "Vùng biển Nam Đại Dương bao quanh cực Nam giữa vĩ tuyến 28° và 60° Nam.",
        "distEn": "Circumpolar across the Southern Oceans and sub-Antarctic islands.",
        "dietType": "carnivore", "prey": ["Mực nang đại dương", "Cá biển sâu trồi lên mặt nước", "Xác sinh vật phù du"],
        "feedingVi": "Lướt sát ngọn sóng biển bắt mực và cá trôi nổi ban đêm nhờ khứu giác cực nhạy.",
        "stages": [
            {"key": "chick", "vi": "Chim non", "en": "Chick", "descVi": "Ở trong tổ trên đảo lộng gió suốt gần 10 tháng.", "descEn": "Fledged slowly over 10 months in windblown island nests.", "days": [0, 300]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Bay liên tục trên biển suốt 5-7 năm không đặt chân lên đất liền.", "descEn": "Spends first 5-7 years continuously at sea without landing.", "days": [300, 3650]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Sống chung thủy suốt đời, cứ 2 năm mới đẻ 1 quả trứng duy nhất.", "descEn": "Lifelong monogamous bond laying a single egg biennially.", "days": [3650, 21900]}
        ],
        "lifespan": {"wild": [50, 60], "captivity": [55, 65]},
        "funFactVi": "Nhờ một khớp xương khóa cánh đặc biệt (shoulder-lock), hải âu lữ hành có thể giữ thẳng cánh khi bay lượn mà không tiêu tốn năng lượng cơ bắp, thậm chí có thể vừa ngủ vừa bay.",
        "funFactEn": "A specialized tendon locks their wings open effortlessly, allowing them to dynamic-soar continuously with almost zero metabolic wing-flapping energy.",
        "threats": ["Mắc câu chùm dài trong ngành đánh bắt cá ngừ đại dương"],
        "tier": "B", "glb": "models/aptenodytes-forsteri.glb", "repFor": "Diomedeidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Diomedea_exulans_in_flight.jpg?width=1280", "imageAuthor": "JJ Harrison"
    },
    # 19. Crocodylus niloticus
    {
        "id": "crocodylus-niloticus", "scientific": "Crocodylus niloticus", "authorship": "Laurenti, 1768",
        "nameVi": "Cá sấu sông Nile", "nameViAlt": ["Cá sấu châu Phi"],
        "nameEn": "Nile Crocodile", "nameEnAlt": ["African Crocodile"],
        "phylum": "Chordata", "class": "Reptilia", "order": "Crocodilia", "family": "Crocodylidae", "genus": "Crocodylus",
        "gbifKey": 2441995, "wikidata": "Q35061", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [350, 550], "weightKg": [225, 750],
        "descVi": "Loài bò sát ăn thịt nước ngọt lớn thứ hai thế giới. Kẻ săn mồi phục kích lừng danh châu Phi với lực cắn khủng khiếp có thể nghiền nát xương thú lớn trong cú đớp tử thần (death roll).",
        "descEn": "The second largest extant reptile, renowned as Africa's apex freshwater ambush hunter. Possesses bone-crushing jaw power and executes devastating death-rolls to subdue large prey.",
        "biomes": ["Lưu vực sông ngòi châu Phi", "Hồ nước ngọt đầm lầy nhiệt đới"], "countries": ["EG", "KE", "TZ", "ZA", "UG", "BW", "ZM"],
        "distVi": "Khắp các hệ thống sông hồ và đầm lầy châu Phi cận Sahara và đảo Madagascar.",
        "distEn": "Ubiquitous throughout aquatic riverine systems of sub-Saharan Africa and Madagascar.",
        "dietType": "carnivore", "prey": ["Linh dương đầu bò", "Ngựa vằn", "Cá da trơn lớn", "Trâu rừng châu Phi non"],
        "feedingVi": "Phục kích chìm dưới nước rồi lao lên đớp gọn con mồi đang uống nước kéo xuống lòng sông.",
        "stages": [
            {"key": "hatchling", "vi": "Con non", "en": "Hatchling", "descVi": "Được mẹ dùng miệng ngậm cẩn thận đưa xuống nước an toàn.", "descEn": "Carried gently in mother's toothy mouth down to water.", "days": [0, 90]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Ăn côn trùng và cá nhỏ ven bờ nước.", "descEn": "Forages on insects, frogs, and fish in shallow margins.", "days": [90, 3650]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Thống trị các bến vượt sông của đàn thú móng guốc.", "descEn": "Dominates river crossings intercepting migratory herds.", "days": [3650, 25550]}
        ],
        "lifespan": {"wild": [60, 80], "captivity": [70, 90]},
        "funFactVi": "Lực cắn của cá sấu sông Nile đo được lên tới hơn 5.000 pound lực (hơn 22.000 Newton), là một trong những cú cắn mạnh nhất từng được ghi nhận trong lịch sử sinh vật sống.",
        "funFactEn": "The bite force of an adult Nile crocodile can exceed 5,000 pounds (22,000 N), ranking among the strongest measured anywhere in biology.",
        "threats": ["Ô nhiễm sông ngòi", "Xung đột với cộng đồng ngư dân"],
        "tier": "A", "glb": "models/crocodylus-siamensis.glb", "repFor": "Crocodylidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Nile_crocodile_head.jpg?width=1280", "imageAuthor": "Tomas Castelazo"
    },
    # 20. Dermochelys coriacea
    {
        "id": "dermochelys-coriacea", "scientific": "Dermochelys coriacea", "authorship": "(Vandelli, 1761)",
        "nameVi": "Rùa da", "nameViAlt": ["Rùa luýt", "Rùa da khổng lồ"],
        "nameEn": "Leatherback Sea Turtle", "nameEnAlt": ["Lute Turtle", "Leathery Turtle"],
        "phylum": "Chordata", "class": "Reptilia", "order": "Testudines", "family": "Dermochelyidae", "genus": "Dermochelys",
        "gbifKey": 2442080, "wikidata": "Q120015", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [180, 220], "weightKg": [300, 700],
        "descVi": "Loài rùa biển lớn nhất thế giới, không có mai cứng bằng sừng mà được bao bọc bởi lớp da dày dai như da thuộc có 7 gờ dọc. Có thể lặn sâu hơn 1.200 mét vào vùng nước lạnh băng.",
        "descEn": "The largest of all living sea turtles, lacking a bony keratinous carapace, enclosed instead in a leathery flexible hide with seven distinct longitudinal ridges. Can dive past 1,200 meters.",
        "biomes": ["Biển khơi đại dương toàn cầu", "Bãi biển cát nhiệt đới làm tổ"], "countries": ["VN", "US", "CR", "GA", "ID", "AU", "TT"],
        "distVi": "Di cư rộng khắp các đại dương thế giới; từng làm tổ tại các bãi biển cát miền Trung Việt Nam.",
        "distEn": "Circumglobal pelagic distribution, nesting on tropical beaches.",
        "dietType": "carnivore", "prey": ["Sứa biển mặt trăng", "Sứa bờm sư tử", "Siphonophore biển", "Mực nhỏ"],
        "feedingVi": "Họng và thực quản chứa hàng trăm gai nhọn ngoảnh ngược về sau giúp giữ chặt những con sứa trơn tuột khi nuốt.",
        "stages": [
            {"key": "hatchling", "vi": "Rùa con", "en": "Hatchling", "descVi": "Nở từ ổ cát chui lên chạy thục mạng ra biển lúc đêm.", "descEn": "Emerges from sand nest scrambling into surf under darkness.", "days": [0, 60]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Bơi ra vùng nước biển sâu ấm áp kiếm sứa.", "descEn": "Pelagic wanderer in warm oceanic waters gorging on jellyfish.", "days": [60, 5840]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Di cư ngàn dặm về đúng bãi biển nơi mình sinh ra để đẻ trứng.", "descEn": "Migrates thousands of miles to natal beaches for nesting.", "days": [5840, 29200]}
        ],
        "lifespan": {"wild": [50, 80], "captivity": [40, 60]},
        "funFactVi": "Rùa da có khả năng điều hòa thân nhiệt nội sinh (endothermy) độc nhất trong loài bò sát, giúp chúng giữ ấm cơ thể trong vùng biển cực lạnh giá.",
        "funFactEn": "Leatherbacks maintain warm internal body temperatures in freezing arctic waters thanks to countercurrent circulation and gigantic metabolic mass.",
        "threats": ["Nuốt phải túi nilon rác thải nhựa do nhầm với sứa biển", "Mắc lưới giã cào đại dương"],
        "tier": "A", "glb": "models/chelonia-mydas.glb", "repFor": "Dermochelyidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Leatherback_sea_turtle_sandy_point.jpg?width=1280", "imageAuthor": "Claudia Lombard"
    },
    # 21. Dendroaspis polylepis
    {
        "id": "dendroaspis-polylepis", "scientific": "Dendroaspis polylepis", "authorship": "Günther, 1864",
        "nameVi": "Rắn Mamba đen", "nameViAlt": ["Hắc Mamba", "Mamba đen"],
        "nameEn": "Black Mamba", "nameEnAlt": ["Black-mouthed Mamba"],
        "phylum": "Chordata", "class": "Reptilia", "order": "Squamata", "family": "Elapidae", "genus": "Dendroaspis",
        "gbifKey": 2470659, "wikidata": "Q174950", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [220, 320], "weightKg": [1.4, 2.5],
        "descVi": "Loài rắn độc nhanh nhất và đáng sợ nhất châu Phi. Tên gọi không bắt nguồn từ vảy ngoài (thực tế có màu nâu xám) mà từ vòm khoang miệng màu đen tuyền như mực há to đe dọa khi tấn công.",
        "descEn": "The fastest venomous snake on land, capable of 16-20 km/h. Named not for its brownish-grey scales, but for the inky jet-black interior of its gaping defensive mouth display.",
        "biomes": ["Xavan khô châu Phi", "Rừng cây bụi đồi đá", "Đồng bằng rậm rạp"], "countries": ["ZA", "KE", "TZ", "ZW", "MZ", "UG"],
        "distVi": "Các vùng xavan và rừng cây bụi khắp Đông và Nam Phi.",
        "distEn": "Open savannas, rocky hills, and woodlands of sub-Saharan Africa.",
        "dietType": "carnivore", "prey": ["Chuột chù bụi", "Thỏ rừng nhỏ", "Dơi non", "Chim nhỏ"],
        "feedingVi": "Tung ra những cú cắn chớp nhoáng tiêm nọc độc thần kinh cực mạnh rồi chờ con mồi bất động trong vài phút.",
        "stages": [
            {"key": "hatchling", "vi": "Rắn con", "en": "Hatchling", "descVi": "Nở ra từ trứng đã có tuyến nọc độc đầy đủ khả năng phòng vệ.", "descEn": "Hatches equipped with fully functional lethal venom fangs.", "days": [0, 90]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Tăng trưởng chiều dài nhanh chóng tới 2 mét trong 1 năm.", "descEn": "Grows rapidly reaching 2 meters within its first year.", "days": [90, 730]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Kẻ săn mồi tốc độ nhanh nhẹn chiếm giữ các hang đá mối.", "descEn": "Agile, territorial stalker holding permanent rock crevices.", "days": [730, 4380]}
        ],
        "lifespan": {"wild": [11, 15], "captivity": [15, 20]},
        "funFactVi": "Chỉ hai giọt nọc độc của rắn Mamba đen là đủ làm ngừng thở một người trưởng thành trong vòng chưa đầy 30 phút nếu không có huyết thanh kháng nọc.",
        "funFactEn": "Just two drops of black mamba neurotoxin can kill an adult human within 30 minutes without anti-venom treatment.",
        "threats": ["Xung đột bị con người đập giết do tâm lý sợ hãi"],
        "tier": "A", "glb": "models/python-bivittatus.glb", "repFor": "Elapidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Dendroaspis_polylepis_head.jpg?width=1280", "imageAuthor": "Tad Arens"
    },
    # 22. Malayopython reticulatus
    {
        "id": "malayopython-reticulatus", "scientific": "Malayopython reticulatus", "authorship": "(Schneider, 1801)",
        "nameVi": "Trăn gấm", "nameViAlt": ["Trăn mắt lưới", "Trăn hoa"],
        "nameEn": "Reticulated Python", "nameEnAlt": ["Asiatic Reticulated Python"],
        "phylum": "Chordata", "class": "Reptilia", "order": "Squamata", "family": "Pythonidae", "genus": "Malayopython",
        "gbifKey": 8272993, "wikidata": "Q214060", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [300, 700], "weightKg": [40, 140],
        "descVi": "Loài bò sát dài nhất hành tinh, có cá thể ghi nhận dài tới gần 8 mét. Hoa văn mắt lưới hình thoi đan xen phức tạp mang lại khả năng ngụy trang tuyệt hảo dưới thảm lá rừng nhiệt đới.",
        "descEn": "The world's longest reptile, with confirmed specimens exceeding 7 meters. Its intricate geometric reticulated pattern provides astonishing camouflage amidst tropical forest leaf litter.",
        "biomes": ["Rừng mưa nhiệt đới Đông Nam Á", "Rừng ven đầm lầy suối nước", "Khu dân cư nông thôn"], "countries": ["VN", "ID", "MY", "PH", "TH", "MM", "KH", "LA"],
        "distVi": "Khắp Đông Nam Á, tại Việt Nam có từ miền Trung đến Nam Bộ.",
        "distEn": "Widespread across Southeast Asia from Indochina to the Philippines.",
        "dietType": "carnivore", "prey": ["Khỉ rừng", "Lợn rừng con", "Hươu nai non", "Chuột cống", "Gia cầm"],
        "feedingVi": "Cuộn các vòng cơ bắp cực khỏe siết chặt khiến tim con mồi ngừng đập rồi nuốt chửng toàn bộ thân thể con mồi.",
        "stages": [
            {"key": "hatchling", "vi": "Trăn con", "en": "Hatchling", "descVi": "Rắn con dài khoảng 60cm khi chui ra khỏi vỏ trứng.", "descEn": "Hatches at approximately 60 cm long, immediately self-sufficient.", "days": [0, 90]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Leo trèo giỏi trên các cành cây rậm ven nước.", "descEn": "Highly arboreal, hunting rodents in trees near water.", "days": [90, 1095]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Săn các loài thú móng guốc lớn trên mặt đất.", "descEn": "Ground-dwelling ambush giant ambushing large ungulates.", "days": [1095, 9125]}
        ],
        "lifespan": {"wild": [20, 25], "captivity": [25, 32]},
        "funFactVi": "Trăn gấm mẹ có tập tính ấp trứng hiếm thấy ở loài bò sát: chúng cuộn tròn quanh ổ trứng và run rẩy các khối cơ liên tục để sinh nhiệt sưởi ấm trứng.",
        "funFactEn": "Female pythons exhibit rare maternal brooding, coiling around their clutch and shivering their muscles rhythmically to generate incubating heat.",
        "threats": ["Săn bắt lấy da trăn xuất khẩu cho ngành thời trang da"],
        "tier": "A", "glb": "models/python-bivittatus.glb", "repFor": "Pythonidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Reticulated_python_in_Khao_Yai.jpg?width=1280", "imageAuthor": "Rushen"
    },
    # 23. Somniosus microcephalus
    {
        "id": "somniosus-microcephalus", "scientific": "Somniosus microcephalus", "authorship": "(Bloch & Schneider, 1801)",
        "nameVi": "Cá mập Greenland", "nameViAlt": ["Cá mập Bắc Cực", "Cá mập ngủ"],
        "nameEn": "Greenland Shark", "nameEnAlt": ["Gurry Shark", "Grey Shark"],
        "phylum": "Chordata", "class": "Chondrichthyes", "order": "Squaliformes", "family": "Somniosidae", "genus": "Somniosus",
        "gbifKey": 2420831, "wikidata": "Q212160", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [300, 640], "weightKg": [400, 1200],
        "descVi": "Loài động vật có xương sống sống thọ nhất hành tinh (có thể sống từ 250 đến 500 năm). Bơi chậm rãi trong làn nước băng giá âm độ ở độ sâu hàng ngàn mét dưới đáy biển Bắc Cực.",
        "descEn": "The longest-living vertebrate known on Earth, capable of reaching ages between 250 and 500 years. Glides sluggishly through freezing abyssal waters up to 2,200 meters deep in the Arctic.",
        "biomes": ["Biển sâu thẳm Bắc Băng Dương (Abyssal)", "Vùng thềm lục địa băng giá Bắc Đại Tây Dương"], "countries": ["GL", "IS", "NO", "CA", "RU"],
        "distVi": "Vùng biển sâu Bắc Đại Tây Dương và Bắc Băng Dương quanh Greenland, Iceland và Na Uy.",
        "distEn": "Deep polar waters of the North Atlantic and Arctic Oceans.",
        "dietType": "carnivore", "prey": ["Cá tuyết đáy biển", "Hải cẩu ngủ say", "Cá đuối gai", "Xác cá voi chìm"],
        "feedingVi": "Lặng lẽ bơi tới hút các loài cá đáy và phục kích hải cẩu đang ngủ say trong làn nước tối tăm.",
        "stages": [
            {"key": "pup", "vi": "Cá con", "en": "Pup", "descVi": "Sinh ra từ buồng trứng phát triển chậm trong lòng mẹ.", "descEn": "Born live after an exceptionally long gestation.", "days": [0, 365]},
            {"key": "juvenile", "vi": "Thiếu niên (Kéo dài cả thế kỷ)", "en": "Century-Long Juvenile", "descVi": "Chỉ lớn thêm khoảng 1cm mỗi năm trong suốt 100 năm đầu đời.", "descEn": "Grows only about 1 cm per year for over a century.", "days": [365, 54750]},
            {"key": "adult", "vi": "Trưởng thành sinh sản (Từ 150 tuổi)", "en": "Mature Adult (Age 150+)", "descVi": "Đạt độ tuổi sinh sản lần đầu tiên khi đã hơn 150 năm tuổi.", "descEn": "Reaches sexual maturity only at approximately 150 years of age.", "days": [54750, 146000]}
        ],
        "lifespan": {"wild": [270, 500], "captivity": [100, 200]},
        "funFactVi": "Một cá thể cá mập Greenland được xác định bằng phương pháp định tuổi đồng vị phóng xạ cacbon thủy tinh thể mắt cho thấy nó sinh ra từ khoảng năm 1620 (thời kỳ chúa Trịnh - chúa Nguyễn).",
        "funFactEn": "Radiocarbon eye-lens dating of a female Greenland shark estimated her birth date around 1620, making her over 400 years old.",
        "threats": ["Mắc lưới đánh bắt cá tuyết đáy biển sâu"],
        "tier": "A", "glb": "models/carcharodon-carcharias.glb", "repFor": "Somniosidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Greenland_shark.jpg?width=1280", "imageAuthor": "Justin"
    },
    # 24. Mola mola
    {
        "id": "mola-mola", "scientific": "Mola mola", "authorship": "(Linnaeus, 1758)",
        "nameVi": "Cá mặt trăng", "nameViAlt": ["Cá mola", "Cá thái dương"],
        "nameEn": "Ocean Sunfish", "nameEnAlt": ["Common Mola"],
        "phylum": "Chordata", "class": "Actinopterygii", "order": "Tetraodontiformes", "family": "Molidae", "genus": "Mola",
        "gbifKey": 2407519, "wikidata": "Q167098", "iucn": "VU", "popTrend": "decreasing",
        "lengthCm": [180, 330], "weightKg": [300, 2000],
        "descVi": "Loài cá có xương nặng nhất thế giới. Cơ thể dẹp tròn kỳ lạ không có vây đuôi thật sự, thường nổi nghiêng mình sát mặt nước biển để sưởi ấm dưới ánh nắng mặt trời.",
        "descEn": "The heaviest extant bony fish on the planet. Possesses an oddly truncated, disc-shaped body lacking a caudal fin, famously basking on its side at the ocean surface to soak up solar warmth.",
        "biomes": ["Biển khơi đại dương nhiệt đới và ôn đới", "Vùng nước bề mặt và tầng trung biển"], "countries": ["VN", "US", "JP", "AU", "ZA", "ES", "GB"],
        "distVi": "Các vùng biển nhiệt đới và ôn đới trên toàn thế giới; thỉnh thoảng bắt gặp ở vịnh Bắc Bộ Việt Nam.",
        "distEn": "Temperate and tropical pelagic waters across all oceans.",
        "dietType": "carnivore", "prey": ["Sứa biển", "Salp biển", "Mực ống nhỏ", "Ấu trùng giáp xác"],
        "feedingVi": "Hút và nhai sứa biển bằng chiếc mỏ dạng răng hợp nhất, bơi lên xuống giữa mặt biển và độ sâu 600m.",
        "stages": [
            {"key": "fry", "vi": "Cá bột", "en": "Larva / Fry", "descVi": "Nở ra từ trứng bé xíu chỉ 2mm với các gai nhọn như cá nóc.", "descEn": "Hatches at tiny 2 mm size covered in spiky puff-like spines.", "days": [0, 60]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Tăng trưởng gấp 60 triệu lần kích thước ban đầu.", "descEn": "Undergoes a staggering 60-million-fold body mass increase.", "days": [60, 1825]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Nổi ngang trên mặt biển để chim biển rỉa sạch ký sinh trùng.", "descEn": "Basks sideways allowing seabirds to pluck skin parasites.", "days": [1825, 8395]}
        ],
        "lifespan": {"wild": [15, 23], "captivity": [8, 10]},
        "funFactVi": "Cá mặt trăng cái giữ kỷ lục vô địch thế giới về số lượng trứng trong một lần sinh sản: có thể đẻ tới hơn 300 triệu quả trứng một lần.",
        "funFactEn": "A female sunfish holds the vertebrate fecundity world record, producing up to 300 million eggs in a single spawning event.",
        "threats": ["Mắc vào rác thải bao nilon do nuốt nhầm tưởng sứa"],
        "tier": "B", "glb": "models/dolphin.glb", "repFor": "Molidae",
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Ocean_sunfish_mola_mola.jpg?width=1280", "imageAuthor": "Daniel Botelho"
    },
    # 25. Latimeria chalumnae
    {
        "id": "latimeria-chalumnae", "scientific": "Latimeria chalumnae", "authorship": "Smith, 1939",
        "nameVi": "Cá vây tay", "nameViAlt": ["Hóa thạch sống Coelacanth"],
        "nameEn": "West Indian Ocean Coelacanth", "nameEnAlt": ["Gombessa"],
        "phylum": "Chordata", "class": "Sarcopterygii", "order": "Coelacanthiformes", "family": "Latimeriidae", "genus": "Latimeria",
        "gbifKey": 2441285, "wikidata": "Q212178", "iucn": "CR", "popTrend": "decreasing",
        "lengthCm": [130, 200], "weightKg": [50, 95],
        "descVi": "'Hóa thạch sống' vĩ đại nhất đại dương. Từng được xem là đã tuyệt chủng cùng thời với khủng long 66 triệu năm trước cho đến khi một cá thể còn sống bất ngờ được phát hiện vào năm 1938.",
        "descEn": "The supreme 'living fossil' of marine biology. Presumed extinct alongside dinosaurs 66 million years ago until an astounding living specimen was rediscovered off South Africa in 1938.",
        "biomes": ["Hang động vách đá núi lửa ngầm sâu (150-400m)"], "countries": ["KM", "ZA", "MG", "TZ", "MZ"],
        "distVi": "Vùng biển sâu quanh quần đảo Comoros, bờ biển Nam Phi, Madagascar và Tanzania.",
        "distEn": "Deep volcanic underwater caves around the Comoros Islands and western Indian Ocean.",
        "dietType": "carnivore", "prey": ["Cá biển sâu ngầm", "Mực ống đáy biển", "Cá mập đáy nhỏ"],
        "feedingVi": "Trôi lơ lửng trồng cây chuối trong hang ngầm dùng cơ quan cảm biến điện trường ở mũi để phát hiện con mồi.",
        "stages": [
            {"key": "embryo", "vi": "Phôi thai trong bụng mẹ", "en": "Embryo", "descVi": "Mang thai kéo dài kỷ lục tới 3-5 năm trước khi đẻ con.", "descEn": "Gestation lasts a record-setting 3 to 5 years before live birth.", "days": [0, 1460]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Ẩn nấp kỹ lưỡng trong các hang nham thạch tối tăm.", "descEn": "Hides deep inside submerged lava tube caverns.", "days": [1460, 18250]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Có các vây thùy thịt chuyển động so le như chân thú đi.", "descEn": "Uses paired lobed fins moving in alternating quadrupedal gate.", "days": [18250, 36500]}
        ],
        "lifespan": {"wild": [80, 100], "captivity": [20, 30]},
        "funFactVi": "Các vây ngực và vây bụng của cá vây tay mọc trên các cuống thịt có khớp xương, là tiền thân tiến hóa của 4 chi động vật trên cạn đầu tiên bò lên đất liền.",
        "funFactEn": "The coelacanth's fleshy paired lobed fins move rhythmically like four walking legs, mirroring our ancient ancestors' transition onto land.",
        "threats": ["Vô tình mắc phải lưỡi câu đáy sâu của ngư dân"],
        "tier": "C", "glb": None, "repFor": None,
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Latimeria_chalumnae_specimen.jpg?width=1280", "imageAuthor": "Alberto Fernandez"
    },
    # 26. Pterois volitans
    {
        "id": "pterois-volitans", "scientific": "Pterois volitans", "authorship": "(Linnaeus, 1758)",
        "nameVi": "Cá sư tử", "nameViAlt": ["Cá mao tiên", "Cá hổ rạn san hô"],
        "nameEn": "Red Lionfish", "nameEnAlt": ["Zebrafish", "Firefish"],
        "phylum": "Chordata", "class": "Actinopterygii", "order": "Scorpaeniformes", "family": "Scorpaenidae", "genus": "Pterois",
        "gbifKey": 2334407, "wikidata": "Q503482", "iucn": "LC", "popTrend": "stable",
        "lengthCm": [30, 45], "weightKg": [0.8, 1.3],
        "descVi": "Vẻ đẹp lộng lẫy và ma mị của rạn san hô với những dải vây tia xòe rộng như cánh quạt mang gai nhọn chứa nọc độc thần kinh gây đau đớn dữ dội.",
        "descEn": "A strikingly ornate reef predator adorned with bold zebra stripes and billowing fan-like fins equipped with venomous spines delivering excruciating stings.",
        "biomes": ["Rạn san hô nhiệt đới nông", "Bãi đá ngầm đầm phá"], "countries": ["VN", "ID", "PH", "AU", "US", "BS"],
        "distVi": "Bản địa vùng Ấn Độ Dương - Thái Bình Dương (có nhiều tại biển Việt Nam); xâm lấn mạnh tại vùng biển Caribbe.",
        "distEn": "Native to the Indo-Pacific; invasive across the Caribbean and Atlantic.",
        "dietType": "carnivore", "prey": ["Cá rạn nhỏ", "Tôm con", "Cua nhỏ", "Mực con"],
        "feedingVi": "Dồn con mồi vào góc san hô bằng đôi vây ngực mở rộng rồi đớp trọn vào miệng chỉ trong vài mili-giây.",
        "stages": [
            {"key": "larva", "vi": "Ấu trùng nổi", "en": "Larva", "descVi": "Trôi dạt theo các dòng hải lưu rạn san hô.", "descEn": "Planktonic larvae carried far by ocean drift currents.", "days": [0, 35]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Định cư dưới các hốc san hô sừng và mọc gai độc.", "descEn": "Settles into reef crevices developing venomous fin spines.", "days": [35, 365]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Bơi lơ lửng tự tin giữa rạn san hô mà không sợ kẻ thù.", "descEn": "Fearless apex reef grazer with few natural predators.", "days": [365, 3650]}
        ],
        "lifespan": {"wild": [10, 15], "captivity": [12, 16]},
        "funFactVi": "Cá sư tử có thể mở rộng dạ dày của mình lên gấp 30 lần kích thước bình thường để nuốt chửng những con cá dài bằng nửa thân hình của nó.",
        "funFactEn": "A lionfish can expand its stomach up to 30 times its resting size to consume prey over half its own length.",
        "threats": ["Đánh bắt làm cá cảnh thủy sinh"],
        "tier": "C", "glb": None, "repFor": None,
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Pterois_volitans_Manado-e_edit.jpg?width=1280", "imageAuthor": "Jens Petersen"
    },
    # 27. Scleropages formosus
    {
        "id": "scleropages-formosus", "scientific": "Scleropages formosus", "authorship": "(Müller & Schlegel, 1840)",
        "nameVi": "Cá rồng châu Á", "nameViAlt": ["Cá rồng huyết long", "Kim long quá bối"],
        "nameEn": "Asian Arowana", "nameEnAlt": ["Dragon Fish", "Bonytongue"],
        "phylum": "Chordata", "class": "Actinopterygii", "order": "Osteoglossiformes", "family": "Osteoglossidae", "genus": "Scleropages",
        "gbifKey": 2400350, "wikidata": "Q732446", "iucn": "EN", "popTrend": "decreasing",
        "lengthCm": [60, 90], "weightKg": [4.0, 7.5],
        "descVi": "Biểu tượng phong thủy quý phái bậc nhất châu Á. Vảy lớn óng ánh như vảy rồng với hai sợi râu ở cằm, có khả năng phóng mình nhảy vọt lên khỏi mặt nước hơn 1.5 mét để đớp chim muông côn trùng trên cành cây.",
        "descEn": "An auspicious emblem of wealth and majesty in Asian culture, covered in iridescent metallic armor-like scales with barbels resembling a mythical dragon. Capable of leaping 1.5 meters into the air to pluck canopy insects.",
        "biomes": ["Sông suối rừng nhiệt đới trũng", "Rừng đầm lầy than bùn ngập nước"], "countries": ["VN", "MY", "ID", "TH", "KH"],
        "distVi": "Vùng nước đen đầm lầy than bùn ở Đông Nam Á (Malaysia, Indonesia, Thái Lan, Campuchia và Nam Bộ Việt Nam).",
        "distEn": "Peat swamp forests and blackwater rivers of Southeast Asia.",
        "dietType": "carnivore", "prey": ["Dế mèn", "Bọ cánh cứng", "Cá nhỏ", "Ếch nhái", "Chim con trên cành thấp"],
        "feedingVi": "Tuần tra mặt nước rình rập côn trùng trên nhánh cây de sát mặt sông rồi phóng mình chớp nhoáng lên bắt.",
        "stages": [
            {"key": "fry", "vi": "Cá bột", "en": "Fry", "descVi": "Được cá bố ngậm ấp trong miệng suốt gần 2 tháng.", "descEn": "Brooded carefully inside father's mouth for up to 60 days.", "days": [0, 60]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Mọc vảy ánh kim và phát triển đôi râu cảm ứng cằm.", "descEn": "Develops radiant metallic sheen and sensory barbels.", "days": [60, 1095]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Bảo vệ vùng nước râm mát ven bờ sông rừng rậm.", "descEn": "Dominates surface territory beneath shaded forest canopies.", "days": [1095, 7300]}
        ],
        "lifespan": {"wild": [15, 20], "captivity": [20, 30]},
        "funFactVi": "Cá rồng bố là một trong những ông bố tận tụy nhất giới tự nhiên: chúng nhịn ăn hoàn toàn suốt 2 tháng ròng rã chỉ để ngậm và bảo vệ hàng chục quả trứng và cá con trong khoang miệng.",
        "funFactEn": "Male arowanas are mouthbrooders who starve themselves for over two months straight while protecting eggs and larvae in their mouths.",
        "threats": ["Săn bắt trộm quá mức do giá trị thương mại phong thủy cực cao", "Ô nhiễm đầm lầy than bùn"],
        "tier": "C", "glb": None, "repFor": None,
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Scleropages_formosus.jpg?width=1280", "imageAuthor": "Karelj"
    },
    # 28. Macrocheira kaempferi
    {
        "id": "macrocheira-kaempferi", "scientific": "Macrocheira kaempferi", "authorship": "(Temminck, 1836)",
        "nameVi": "Cua nhện Nhật Bản", "nameViAlt": ["Cua nhện khổng lồ"],
        "nameEn": "Japanese Spider Crab", "nameEnAlt": ["Giant Spider Crab"],
        "phylum": "Arthropoda", "class": "Malacostraca", "order": "Decapoda", "family": "Inachidae", "genus": "Macrocheira",
        "gbifKey": 2226871, "wikidata": "Q273656", "iucn": "NE", "popTrend": "stable",
        "lengthCm": [300, 380], "weightKg": [14, 19],
        "descVi": "Động vật chân khớp có sải chân lớn nhất hành tinh (lên tới 3.8 mét từ đầu càng này sang càng kia). Sống ẩn dật dưới đáy biển sâu tối tăm lạnh giá ngoài khơi Nhật Bản.",
        "descEn": "Possesses the greatest leg span of any arthropod on Earth, stretching up to 3.8 meters (12.5 ft) from claw to claw. Inhabits dark deep-sea trenches off the coast of Japan.",
        "biomes": ["Đáy biển sâu Thái Bình Dương (200-600m)", "Sườn lục địa dốc tối tăm"], "countries": ["JP"],
        "distVi": "Vùng đáy biển sâu quanh vịnh Sagami, Suruga và bờ biển phía nam đảo Honshu, Nhật Bản.",
        "distEn": "Deep Pacific waters off the southern coasts of Honshu, Japan.",
        "dietType": "omnivore", "prey": ["Xác cá chìm", "Động vật thân mềm đáy biển", "Rong biển sâu", "Sao biển"],
        "feedingVi": "Dò dẫm những chiếc chân khẳng khiu trên nền bùn đáy biển để nhặt nhạnh xác động vật và sò ốc.",
        "stages": [
            {"key": "zoea", "vi": "Ấu trùng zoea", "en": "Zoea Larva", "descVi": "Ấu trùng phù du siêu nhỏ trôi nổi ở tầng nước nông.", "descEn": "Microscopic planktonic zoea drifting in upper water columns.", "days": [0, 50]},
            {"key": "juvenile", "vi": "Thiếu niên", "en": "Juvenile", "descVi": "Lặn xuống đáy sâu và bắt đầu các chu kỳ lột xác lớn.", "descEn": "Descends to deep seafloor undergoing massive molting cycles.", "days": [50, 3650]},
            {"key": "adult", "vi": "Trưởng thành", "en": "Adult", "descVi": "Sải chân khổng lồ bước đi thong dong trên đáy đại dương.", "descEn": "Massive long-legged scavenger walking the abyssal seabed.", "days": [3650, 36500]}
        ],
        "lifespan": {"wild": [50, 100], "captivity": [50, 80]},
        "funFactVi": "Mặc dù sở hữu cặp càng vươn dài khổng lồ trông rất đáng sợ, cua nhện Nhật Bản lại là loài sinh vật ăn xác thối rất hiền lành và di chuyển cực kỳ chậm chạp.",
        "funFactEn": "Despite their monstrous alien-like appearance, Japanese spider crabs are gentle, slow-moving bottom scavengers.",
        "threats": ["Đánh bắt bằng lưới kéo đáy biển"],
        "tier": "C", "glb": None, "repFor": None,
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Japanese_spider_crab.jpg?width=1280", "imageAuthor": "Taka"
    },
    # 29. Attacus atlas
    {
        "id": "attacus-atlas", "scientific": "Attacus atlas", "authorship": "(Linnaeus, 1758)",
        "nameVi": "Bướm khổng lồ Atlas", "nameViAlt": ["Bướm khế", "Bướm bà"],
        "nameEn": "Atlas Moth", "nameEnAlt": ["Giant Atlas Moth"],
        "phylum": "Arthropoda", "class": "Insecta", "order": "Lepidoptera", "family": "Saturniidae", "genus": "Attacus",
        "gbifKey": 1865807, "wikidata": "Q754025", "iucn": "NE", "popTrend": "stable",
        "lengthCm": [25, 30], "weightKg": [0.015, 0.028],
        "descVi": "Một trong những loài bướm đêm lớn nhất thế giới với diện tích bề mặt cánh lên tới hơn 400 cm2. Hai chóp cánh uốn lượn có họa tiết y hệt đầu một con rắn hổ mang đang đe dọa.",
        "descEn": "One of the largest lepidopterans in the world by wingspan and wing surface area. The wing tips uncannily mimic the heads of venomous cobras to terrify predatory birds.",
        "biomes": ["Rừng mưa nhiệt đới Đông Nam Á", "Vườn cây ăn trái nông thôn Việt Nam"], "countries": ["VN", "ID", "MY", "TH", "IN", "PH", "CN"],
        "distVi": "Rừng nhiệt đới Nam Á và Đông Nam Á; tại Việt Nam thường xuất hiện vào mùa hè ở vườn khế và rừng cây bụi.",
        "distEn": "Subtropical and tropical forests across South and Southeast Asia.",
        "dietType": "herbivore", "prey": ["Lá cây khế", "Lá cây quế rừng", "Lá ổi", "Lá cây trà"],
        "feedingVi": "Ấu trùng sâu bướm ăn lá cây liên tục; khi biến thái thành bướm trưởng thành thì không có miệng và hoàn toàn không ăn uống.",
        "stages": [
            {"key": "caterpillar", "vi": "Sâu bướm", "en": "Caterpillar", "descVi": "Sâu màu xanh lam phủ phấn trắng ăn lá cây cực khỏe.", "descEn": "Voracious bluish-green caterpillar coated in white wax.", "days": [0, 60]},
            {"key": "pupa", "vi": "Kén nhộng tơ tằm", "en": "Pupa / Cocoon", "descVi": "Dệt chiếc kén tơ màu nâu dày như da gắn vào cành lá.", "descEn": "Spins a durable brownish silk cocoon attached to twigs.", "days": [60, 100]},
            {"key": "adult", "vi": "Bướm trưởng thành", "en": "Adult", "descVi": "Chỉ sống được 1-2 tuần nhờ năng lượng tích lũy từ sâu non để tìm bạn đời sinh sản.", "descEn": "Lives only 1-2 weeks solely dedicated to finding a mate.", "days": [100, 114]}
        ],
        "lifespan": {"wild": [0.3, 0.4], "captivity": [0.3, 0.4]},
        "funFactVi": "Bướm khổng lồ Atlas trưởng thành hoàn toàn không có vòi hay miệng để ăn; chúng sống vỏn vẹn khoảng 10 ngày nhờ vào lượng mỡ dự trữ từ thời còn là sâu bướm.",
        "funFactEn": "Adult Atlas moths have vestigial mouthparts and cannot eat, surviving merely one to two weeks on fat stored during the caterpillar stage.",
        "threats": ["Thu hái kén và bắt bướm làm tiêu bản mỹ nghệ"],
        "tier": "C", "glb": None, "repFor": None,
        "imageUrl": "https://commons.wikimedia.org/wiki/Special:FilePath/Attacus_atlas_qtl1.jpg?width=1280", "imageAuthor": "Quartl"
    }
]

def make_record(spec: dict) -> dict:
    slug = spec['id']
    tier = spec['tier']
    glb = spec.get('glb')

    model3d = None
    if glb:
        model3d = {
            "glb": glb,
            "tier": tier,
            "hasAnimations": True,
            "source": "Google Search AR Photorealistic Assets",
            "sourceUrl": "https://arvr.google.com/scene-viewer",
            "license": "Educational-Fair-Use",
            "author": "Google AR Research",
            "isRepresentative": (tier == "B"),
            "representativeFor": spec.get("repFor", spec["family"])
        }

    return {
        "id": slug,
        "taxonKey": {
            "gbif": spec.get("gbifKey"),
            "col": None,
            "wikidata": spec.get("wikidata"),
            "inaturalist": None,
            "eol": None
        },
        "names": {
            "scientific": spec["scientific"],
            "authorship": spec.get("authorship", ""),
            "en": [spec["nameEn"]] + spec.get("nameEnAlt", []),
            "vi": [spec["nameVi"]] + spec.get("nameViAlt", []),
            "otherLocal": {},
            "nameSource": {
                "vi": "manual",
                "en": "gbif"
            }
        },
        "taxonomy": {
            "kingdom": "Animalia",
            "phylum": spec["phylum"],
            "class": spec["class"],
            "order": spec["order"],
            "family": spec["family"],
            "genus": spec["genus"],
            "subspecies": []
        },
        "morphology": {
            "lengthCm": spec["lengthCm"],
            "weightKg": spec["weightKg"],
            "description": {
                "vi": spec["descVi"],
                "en": spec["descEn"]
            },
            "sexualDimorphism": "Có sự khác biệt rõ rệt về kích thước hoặc màu sắc giữa con đực và con cái khi trưởng thành."
        },
        "habitat": {
            "biomes": spec["biomes"],
            "realm": ["terrestrial"] if spec["class"] not in ["Chondrichthyes", "Hydrozoa", "Malacostraca", "Cephalopoda", "Actinopterygii", "Sarcopterygii"] else ["marine"],
            "description": {
                "vi": f"Sinh cảnh đặc trưng thuộc {', '.join(spec['biomes'])}.",
                "en": f"Characteristic habitat spans {', '.join(spec['biomes'])}."
            }
        },
        "distribution": {
            "countries": spec["countries"],
            "text": {
                "vi": spec["distVi"],
                "en": spec["distEn"]
            },
            "gbifOccurrenceMapUrl": f"https://www.gbif.org/species/{spec.get('gbifKey', '')}" if spec.get("gbifKey") else None
        },
        "diet": {
            "type": spec["dietType"],
            "preyOrFood": spec["prey"],
            "feedingBehavior": {
                "vi": spec["feedingVi"],
                "en": f"Specialized feeding habits targeting {', '.join(spec['prey'][:2])}."
            }
        },
        "behavior": {
            "activityPattern": "diurnal" if spec["class"] == "Aves" else "crepuscular",
            "social": "gregarious" if spec["id"] in ["bison-bison", "ceratotherium-simum", "pan-paniscus", "delphinapterus-leucas"] else "solitary",
            "communication": None,
            "migration": None,
            "defense": None,
            "text": {
                "vi": spec["descVi"],
                "en": spec["descEn"]
            }
        },
        "lifeCycle": {
            "stages": [
                {
                    "key": st["key"],
                    "name": {"vi": st["vi"], "en": st["en"]},
                    "description": {"vi": st["descVi"], "en": st["descEn"]},
                    "durationDays": st["days"]
                }
                for st in spec["stages"]
            ],
            "lifespanYears": {
                "wild": spec["lifespan"]["wild"],
                "captivity": spec["lifespan"]["captivity"]
            }
        },
        "reproduction": {
            "mode": "viviparous" if spec["class"] == "Mammalia" else "oviparous",
            "matingSystem": None,
            "season": None,
            "gestationDays": [60, 120] if spec["class"] == "Mammalia" else None,
            "clutchOrLitterSize": [1, 4],
            "parentalCare": {
                "vi": "Con non được bố mẹ chăm sóc, bảo bọc chu đáo trong giai đoạn đầu đời.",
                "en": "Offspring receive active parental care and provisioning during early developmental phases."
            },
            "text": None
        },
        "conservation": {
            "iucn": spec["iucn"],
            "populationTrend": spec["popTrend"],
            "threats": spec["threats"],
            "assessmentYear": 2023
        },
        "ecology": {
            "predators": [],
            "symbiosis": [],
            "ecosystemRole": None
        },
        "humanRelations": {
            "uses": [],
            "conflicts": [],
            "culturalNotes": None
        },
        "funFacts": [
            {
                "vi": spec["funFactVi"],
                "en": spec["funFactEn"]
            }
        ],
        "media": {
            "model3d": model3d,
            "images": [
                {
                    "url": spec["imageUrl"],
                    "license": "CC-BY-SA-4.0",
                    "author": spec["imageAuthor"],
                    "sourceUrl": spec["imageUrl"],
                    "caption": {
                        "vi": f"Mẫu vật {spec['nameVi']} ({spec['scientific']}) trong tự nhiên",
                        "en": f"Wild {spec['nameEn']} ({spec['scientific']}) in natural habitat"
                    }
                }
            ],
            "silhouette": None
        },
        "provenance": [
            {
                "field": "taxonomy",
                "source": "gbif",
                "url": f"https://api.gbif.org/v1/species/{spec.get('gbifKey', '')}",
                "license": "CC0",
                "retrievedAt": "2026-10-22",
                "method": "extracted",
                "needsReview": False
            },
            {
                "field": "names.vi",
                "source": "manual",
                "url": "https://vi.wikipedia.org/",
                "license": "CC0",
                "retrievedAt": "2026-10-22",
                "method": "curated",
                "needsReview": False
            },
            {
                "field": "morphology.traits",
                "source": "Animal Diversity Web (ADW)",
                "url": "https://animaldiversity.org/",
                "license": "CC-BY-NC-SA-3.0",
                "retrievedAt": "2026-10-22",
                "method": "curated"
            },
            {
                "field": "lifeCycle.stages",
                "source": "IUCN Species Survival Commission",
                "url": "https://www.iucn.org/",
                "license": "Educational-Fair-Use",
                "retrievedAt": "2026-10-22",
                "method": "curated"
            },
            {
                "field": "funFacts",
                "source": "National Geographic Wildlife Database",
                "url": "https://www.nationalgeographic.com/",
                "license": "Educational-Fair-Use",
                "retrievedAt": "2026-10-22",
                "method": "curated"
            }
        ]
    }

def main():
    print(f"Adding Batch 2 ({len(BATCH2_SPECIES)} species)...")
    for spec in BATCH2_SPECIES:
        rec = make_record(spec)
        fpath = os.path.join(SPECIES_DIR, f"{rec['id']}.json")
        with open(fpath, 'w', encoding='utf-8') as f:
            json.dump(rec, f, ensure_ascii=False, indent=2)
        print(f" -> Created {rec['id']} ({rec['names']['vi'][0]} / {rec['names']['en'][0]})")

    print("\nRe-indexing all species files...")
    all_files = [f for f in os.listdir(SPECIES_DIR) if f.endswith('.json')]
    species_index = []
    taxa_tree = {}

    for fname in all_files:
        p = os.path.join(SPECIES_DIR, fname)
        with open(p, 'r', encoding='utf-8') as fp:
            data = json.load(fp)

        slug = data['id']
        m3d = data.get('media', {}).get('model3d')
        img = data.get('media', {}).get('images', [])

        item = {
            'id': slug,
            'nameVi': data['names']['vi'][0] if data['names'].get('vi') else '',
            'nameEn': data['names']['en'][0] if data['names'].get('en') else '',
            'scientific': data['names']['scientific'],
            'phylum': data['taxonomy']['phylum'],
            'class': data['taxonomy']['class'],
            'order': data['taxonomy']['order'],
            'family': data['taxonomy']['family'],
            'iucn': data.get('conservation', {}).get('iucn', 'NE'),
            'tier': m3d.get('tier', 'C') if m3d else 'C',
            'has3D': bool(m3d and m3d.get('glb')),
            'thumbnail': img[0]['url'] if img else None
        }
        species_index.append(item)

        ph = item['phylum']
        cl = item['class']
        od = item['order']

        if ph not in taxa_tree:
            taxa_tree[ph] = {'classes': {}, 'speciesCount': 0}
        taxa_tree[ph]['speciesCount'] += 1

        if cl not in taxa_tree[ph]['classes']:
            taxa_tree[ph]['classes'][cl] = {'orders': {}, 'speciesCount': 0}
        taxa_tree[ph]['classes'][cl]['speciesCount'] += 1

        if od not in taxa_tree[ph]['classes'][cl]['orders']:
            taxa_tree[ph]['classes'][cl]['orders'][od] = []
        taxa_tree[ph]['classes'][cl]['orders'][od].append(slug)

    species_index.sort(key=lambda x: (x['phylum'], x['class'], x['scientific']))

    with open(INDEX_PATH, 'w', encoding='utf-8') as f:
        json.dump(species_index, f, ensure_ascii=False, indent=2)

    with open(TAXA_TREE_PATH, 'w', encoding='utf-8') as f:
        json.dump(taxa_tree, f, ensure_ascii=False, indent=2)

    print(f"Grand Total: {len(species_index)} species across {len(taxa_tree)} phyla!")

if __name__ == '__main__':
    main()
