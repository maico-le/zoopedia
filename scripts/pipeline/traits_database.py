"""
Zoopedia Traits Knowledge Base
Comprehensive biological trait records and scientific heuristics covering all 8 animal phyla.
Sources: AnAge, PanTHERIA, Animal Diversity Web (ADW), FishBase, SeaLifeBase, IUCN.
"""

# Flagship species customized trait data
FLAGSHIP_SPECIES_TRAITS = {
    "panthera-leo": {
        "lengthCm": [180, 250],
        "weightKg": [130, 225],
        "sexualDimorphism": "Con đực có bờm lớn sẫm màu quanh cổ và cơ thể nặng hơn con cái từ 30-50%.",
        "diet": {
            "type": "carnivore",
            "preyOrFood": ["Ngựa vằn", "Linh dương đầu bò", "Trâu rừng châu Phi", "Heo rừng"],
            "feedingBehavior": {
                "vi": "Săn mồi theo bầy có chiến thuật phối hợp bao vây, chủ yếu do các con cái trong bầy đảm nhiệm vào ban đêm.",
                "en": "Cooperative pride hunting with tactical ambush ambits, predominantly carried out by females at night."
            }
        },
        "behavior": {
            "activityPattern": "crepuscular",
            "social": "gregarious",
            "communication": {
                "vi": "Tiếng gầm vang xa tới 8 km để định danh bầy và lãnh thổ, cọ má và liếm đầu để củng cố liên kết xã hội.",
                "en": "Roars audible up to 8 km to advertise territory, cheek rubbing and head licking to reinforce social bonds."
            },
            "defense": {
                "vi": "Bầy đực tuần tra và bảo vệ nghiêm ngặt lãnh thổ chống lại các bầy sư tử xâm lấn.",
                "en": "Coalitions of males vigorously patrol and defend pride territory against intruding nomads."
            }
        },
        "lifeCycle": {
            "stages": [
                {
                    "key": "cub",
                    "name": {"vi": "Sư tử con sơ sinh", "en": "Newborn Cub"},
                    "description": {"vi": "Mắt nhắm và có đốm hoa mai mờ để ngụy trang trong bụi rậm.", "en": "Blind at birth with rosette camouflage markings in dense thickets."},
                    "durationDays": [0, 90]
                },
                {
                    "key": "subadult",
                    "name": {"vi": "Sư tử mới lớn", "en": "Subadult"},
                    "description": {"vi": "Bắt đầu tham gia săn mồi cùng bầy; con đực trẻ chuẩn bị bị trục xuất.", "en": "Joins hunts; young males prepare for expulsion from natal pride."},
                    "durationDays": [90, 730]
                },
                {
                    "key": "adult",
                    "name": {"vi": "Sư tử trưởng thành", "en": "Prime Adult"},
                    "description": {"vi": "Làm chủ bầy đàn và sinh sản duy trì nòi giống.", "en": "Dominant pride member actively defending territory and reproducing."},
                    "durationDays": [730, 5840]
                }
            ],
            "lifespanYears": {"wild": [10, 15], "captivity": [20, 26]}
        },
        "reproduction": {
            "mode": "viviparous",
            "matingSystem": "polygynous",
            "season": "Quanh năm",
            "gestationDays": [105, 115],
            "clutchOrLitterSize": [1, 4],
            "parentalCare": {
                "vi": "Sư tử mẹ nuôi chung con trong bầy (communal suckling), bảo vệ con non trước linh cẩu.",
                "en": "Communal cub nursing within the pride; mother defends cubs against hyenas and rogue males."
            }
        },
        "funFacts": [
            {"vi": "Sư tử là loài duy nhất trong họ Mèo sống theo bầy đàn gắn kết xã hội cao.", "en": "Lions are the only truly social felids, living in family groups called prides."},
            {"vi": "Tiếng gầm của một con sư tử đực trưởng thành có thể đạt âm lượng 114 decibel.", "en": "A male lion's roar can reach an astonishing volume of 114 decibels."}
        ]
    },
    "canis-lupus": {
        "lengthCm": [105, 160],
        "weightKg": [30, 80],
        "sexualDimorphism": "Chó sói đực thường nặng hơn cá thể cái khoảng 20% và có hộp sọ rộng hơn.",
        "diet": {
            "type": "carnivore",
            "preyOrFood": ["Hươu Bắc Mỹ", "Tuần lộc", "Nai sừng tấm", "Thỏ rừng"],
            "feedingBehavior": {
                "vi": "Săn đuổi con mồi theo chiến thuật bền bỉ, chạy bám sát hàng giờ để vắt kiệt thể lực con mồi lớn.",
                "en": "Endurance-based cursorial hunting, chasing large ungulates over long distances to exhaust them."
            }
        },
        "behavior": {
            "activityPattern": "nocturnal",
            "social": "gregarious",
            "communication": {
                "vi": "Tiếng hú đồng thanh để tập hợp bầy, định vị và đánh dấu ranh giới với các đàn lân cận.",
                "en": "Harmonized pack howling to assemble members, coordinate moves, and claim territory."
            },
            "defense": {
                "vi": "Bảo vệ nghiêm ngặt ranh giới lãnh thổ bằng mùi nước tiểu và giao tranh quyết liệt với bầy đối thủ.",
                "en": "Aggressively defends pack boundaries via scent-marking and lethal conflicts with rival packs."
            }
        },
        "lifeCycle": {
            "stages": [
                {
                    "key": "pup",
                    "name": {"vi": "Sói con", "en": "Pup"},
                    "description": {"vi": "Sinh ra trong hang ngầm, phụ thuộc sữa mẹ và sự bảo bọc của cả đàn.", "en": "Born deaf and blind in underground dens; fed and cared for by all pack adults."},
                    "durationDays": [0, 60]
                },
                {
                    "key": "yearling",
                    "name": {"vi": "Sói niên thiếu", "en": "Yearling"},
                    "description": {"vi": "Học tập cấp bậc bầy đàn và hỗ trợ trông nom lứa sói con kế tiếp.", "en": "Integrated into hunting operations and aids in pup-rearing duties."},
                    "durationDays": [60, 730]
                },
                {
                    "key": "adult",
                    "name": {"vi": "Sói trưởng thành", "en": "Adult"},
                    "description": {"vi": "Đạt kích thước hoàn chỉnh, có thể ở lại bầy hoặc tách đàn đơn độc tìm bạn đời.", "en": "Fully mature; either ascends pack hierarchy or disperses to establish a new pack."},
                    "durationDays": [730, 4745]
                }
            ],
            "lifespanYears": {"wild": [6, 8], "captivity": [12, 16]}
        },
        "reproduction": {
            "mode": "viviparous",
            "matingSystem": "monogamous",
            "season": "Tháng 1 đến tháng 4",
            "gestationDays": [60, 65],
            "clutchOrLitterSize": [4, 6],
            "parentalCare": {
                "vi": "Cả bầy sói cùng tham gia mớm thức ăn nôn ra cho sói con (alloparenting).",
                "en": "Pack-wide alloparental care: all adults regurgitate partially digested meat for pups."
            }
        },
        "funFacts": [
            {"vi": "Chó sói có thể duy trì tốc độ chạy 50–60 km/h trên quãng đường dài truy đuổi con mồi.", "en": "Wolves can sustain chase speeds of 50–60 km/h across rugged winter terrain."},
            {"vi": "Hệ thống cấp bậc Alpha trong bầy sói hoang dã thực chất là gia đình hạt nhân: bố, mẹ và các con non.", "en": "Wild wolf packs are essentially nuclear families led by the breeding breeding parents."}
        ]
    },
    "balaenoptera-musculus": {
        "lengthCm": [2400, 3000],
        "weightKg": [100000, 190000],
        "sexualDimorphism": "Cá voi xanh cái lớn hơn con đực từ 5-10% chiều dài cơ thể.",
        "diet": {
            "type": "filter_feeder",
            "preyOrFood": ["Nhuyễn thể Euphausiacea (Krill)", "Giáp xác nhỏ"],
            "feedingBehavior": {
                "vi": "Hút một lượng nước khổng lồ chứa hàng tấn nhuyễn thể rồi dùng các tấm sừng ép nước ra ngoài để nuốt mồi.",
                "en": "Lunge feeding: engulfs tens of thousands of liters of seawater then filters krill through baleen plates."
            }
        },
        "behavior": {
            "activityPattern": "diurnal",
            "social": "solitary",
            "communication": {
                "vi": "Phát ra sóng hạ âm cực thấp (10-40 Hz) truyền xa hàng nghìn kilômét dưới đáy đại dương.",
                "en": "Emits infrasonic pulses (10-40 Hz) capable of propagating across entire ocean basins."
            },
            "defense": {
                "vi": "Kích thước khổng lồ là tấm khiên tự nhiên; chỉ có cá voi sát thủ mới dám tấn công con non.",
                "en": "Colossal bulk is an almost impenetrable defense against virtually all predators except orca pods."
            }
        },
        "lifeCycle": {
            "stages": [
                {
                    "key": "calf",
                    "name": {"vi": "Cá voi con", "en": "Calf"},
                    "description": {"vi": "Nặng 2.5–3 tấn lúc mới sinh, bú khoảng 400 lít sữa mẹ giàu chất béo mỗi ngày.", "en": "Born at 2.5–3 metric tons; drinks ~400 liters of fat-rich milk daily."},
                    "durationDays": [0, 240]
                },
                {
                    "key": "adult",
                    "name": {"vi": "Cá voi trưởng thành", "en": "Mature Whale"},
                    "description": {"vi": "Đạt chiều dài cực đại gần 30 mét, di cư hàng nghìn dặm giữa vùng cực và xích đạo.", "en": "Reaches ~30 meters; migrates thousands of nautical miles between polar feeding grounds and tropical breeding waters."},
                    "durationDays": [240, 32850]
                }
            ],
            "lifespanYears": {"wild": [70, 90], "captivity": [0, 0]}
        },
        "reproduction": {
            "mode": "viviparous",
            "matingSystem": "polygynous",
            "season": "Mùa đông ở vùng nhiệt đới",
            "gestationDays": [300, 360],
            "clutchOrLitterSize": [1, 1],
            "parentalCare": {
                "vi": "Cá voi mẹ bảo bọc con non chặt chẽ suốt 7-8 tháng bú sữa trước khi cai sữa ở vùng nước lạnh.",
                "en": "Mother provides intensive nursing and escort for 7-8 months until weaning in productive polar seas."
            }
        },
        "funFacts": [
            {"vi": "Trái tim của cá voi xanh to bằng một chiếc xe hơi nhỏ và nặng tới 180 kg.", "en": "A blue whale's heart is roughly the size of a small car and weighs up to 180 kg."},
            {"vi": "Đây là loài động vật lớn nhất từng tồn tại trong lịch sử Trái Đất, lớn hơn cả những loài khủng long khổng lồ nhất.", "en": "The largest animal ever known to have lived on Earth, surpassing even the largest titanosaurs."}
        ]
    },
    "danaus-plexippus": {
        "lengthCm": [9, 10],
        "weightKg": [0.0005, 0.00075],
        "sexualDimorphism": "Con đực có một chấm đen chứa tuyến mùi hương pheromone ở cánh sau, gân cánh mảnh hơn con cái.",
        "diet": {
            "type": "herbivore",
            "preyOrFood": ["Cây bông tai (Asclepias)", "Mật hoa dại"],
            "feedingBehavior": {
                "vi": "Sâu bướm ăn độc quyền lá cây bông tai tích lũy độc tố cardenolide; bướm trưởng thành hút mật hoa bằng vòi xoắn.",
                "en": "Caterpillars feed exclusively on milkweed accumulating cardenolide toxins; adults drink nectar via proboscis."
            }
        },
        "behavior": {
            "activityPattern": "diurnal",
            "social": "solitary",
            "communication": {
                "vi": "Giao tiếp qua tín hiệu hóa học pheromone và thị giác bằng hoa văn cánh rực rỡ báo hiệu độc tố.",
                "en": "Communicates through pheromone releases and vivid aposematic wing warning patterns."
            },
            "defense": {
                "vi": "Màu cam rực rỡ cảnh báo độc tố glycoside tim gây nôn mửa cho bất kỳ loài chim nào ăn phải.",
                "en": "Aposematic coloration signals unpalatability; cardiac glycosides induce violent vomiting in avian predators."
            }
        },
        "lifeCycle": {
            "stages": [
                {
                    "key": "egg",
                    "name": {"vi": "Trứng", "en": "Egg"},
                    "description": {"vi": "Trứng màu trắng ngà gắn ở mặt dưới lá cây bông tai.", "en": "Small cream-colored egg laid singly beneath milkweed leaves."},
                    "durationDays": [0, 4]
                },
                {
                    "key": "larva",
                    "name": {"vi": "Sâu bướm (Ấu trùng)", "en": "Caterpillar"},
                    "description": {"vi": "Có sọc vàng trắng đen nổi bật, lột xác 5 lần (instars) lớn gấp 2000 lần.", "en": "Distinctive yellow, black, and white stripes; undergoes five instars growing 2,000-fold."},
                    "durationDays": [4, 18]
                },
                {
                    "key": "chrysalis",
                    "name": {"vi": "Nhộng", "en": "Pupa / Chrysalis"},
                    "description": {"vi": "Kén nhộng màu xanh ngọc bích có viền chấm vàng kim loại lấp lánh.", "en": "Jade-green chrysalis adorned with shimmering metallic golden dots."},
                    "durationDays": [18, 28]
                },
                {
                    "key": "imago",
                    "name": {"vi": "Bướm trưởng thành", "en": "Adult Butterfly"},
                    "description": {"vi": "Cánh cam vằn đen, có khả năng bay di cư xuyên lục địa hơn 4,000 km.", "en": "Sexually mature butterfly capable of a 4,000-km multi-generational epic migration."},
                    "durationDays": [28, 270]
                }
            ],
            "lifespanYears": {"wild": [0.1, 0.75], "captivity": [0.2, 0.8]}
        },
        "reproduction": {
            "mode": "oviparous",
            "matingSystem": "polygynandrous",
            "season": "Mùa xuân và mùa hè",
            "gestationDays": [3, 5],
            "clutchOrLitterSize": [300, 500],
            "parentalCare": {
                "vi": "Bướm mẹ tỉ mỉ chọn đúng cây bông tai không có ký sinh để đẻ từng quả trứng riêng biệt.",
                "en": "Mother carefully surveys and deposits single eggs on healthy milkweed plants before departing."
            }
        },
        "funFacts": [
            {"vi": "Thế hệ bướm 'Methuselah' vào mùa thu có tuổi thọ gấp 8 lần các thế hệ mùa xuân để thực hiện chuyến di cư vĩ đại.", "en": "The autumn 'Methuselah generation' lives up to 8 times longer than spring generations to complete their migration."},
            {"vi": "Bướm vua sử dụng la bàn từ trường Trái Đất và vị trí mặt trời để định vị đường bay nghìn dặm tới Mexico.", "en": "Monarchs utilize a celestial sun compass and magnetic inclination detection to navigate to ancestral wintering sites."}
        ]
    },
    "octopus-vulgaris": {
        "lengthCm": [60, 100],
        "weightKg": [3, 10],
        "sexualDimorphism": "Con đực có một xúc tu thứ ba bên phải biến đổi thành cơ quan giao phối (hectocotylus).",
        "diet": {
            "type": "carnivore",
            "preyOrFood": ["Cua", "Tôm", "Sò", "Cá nhỏ"],
            "feedingBehavior": {
                "vi": "Phun nọc độc làm tê liệt con mồi rồi dùng mỏ vẹt cứng và lưỡi gai bào vỡ vỏ cứng để ăn thịt mềm.",
                "en": "Injects paralyzing cephalotoxin, drilling through mollusk shells with radula and tearing flesh with parrot-like beak."
            }
        },
        "behavior": {
            "activityPattern": "nocturnal",
            "social": "solitary",
            "communication": {
                "vi": "Đổi màu da và biến đổi kết cấu gai sần trên da trong 0.2 giây nhờ tế bào sắc tố chromatophore.",
                "en": "Rapid flash changes of skin color and 3D papillae texture in under 200 milliseconds."
            },
            "defense": {
                "vi": "Ngụy trang hoàn hảo tàng hình vào rạn đá, phun mực mù mịt đánh lạc hướng và bơi phản lực trốn thoát.",
                "en": "Dynamic cryptic camouflage, blinding ink-cloud decoys, and high-speed siphon jet propulsion."
            }
        },
        "lifeCycle": {
            "stages": [
                {
                    "key": "egg",
                    "name": {"vi": "Dây trứng", "en": "Egg Cluster"},
                    "description": {"vi": "Hàng trăm ngàn trứng nhỏ li ti treo thành chùm trong hang đá do mẹ canh gác.", "en": "Hundreds of thousands of tiny rice-shaped eggs suspended from cavern ceilings."},
                    "durationDays": [0, 45]
                },
                {
                    "key": "paralarva",
                    "name": {"vi": "Ấu trùng trôi nổi", "en": "Planktonic Paralarva"},
                    "description": {"vi": "Trôi nổi tự do trong tầng mặt đại dương săn giáp xác phù du.", "en": "Drifts freely in the water column as plankton feeding on micro-crustaceans."},
                    "durationDays": [45, 105]
                },
                {
                    "key": "adult",
                    "name": {"vi": "Bạch tuộc trưởng thành", "en": "Benthic Adult"},
                    "description": {"vi": "Sống đáy, thông minh vượt bậc biết sử dụng công cụ và giải đố mê cung phức tạp.", "en": "Solitary benthic hunter renowned for tool usage, complex puzzle solving, and memory."},
                    "durationDays": [105, 540]
                }
            ],
            "lifespanYears": {"wild": [1, 2], "captivity": [1, 2.5]}
        },
        "reproduction": {
            "mode": "oviparous",
            "matingSystem": "semelparous",
            "season": "Mùa xuân",
            "gestationDays": [30, 60],
            "clutchOrLitterSize": [100000, 400000],
            "parentalCare": {
                "vi": "Bạch tuộc mẹ không ăn uống suốt hàng tháng trời để thổi nước sạch bảo vệ trứng cho đến khi kiệt sức chết.",
                "en": "Mother ceases feeding entirely, cleaning and aerating egg clusters relentlessly until death upon hatching."
            }
        },
        "funFacts": [
            {"vi": "Bạch tuộc có ba trái tim và dòng máu màu xanh lam nhờ chứa chất đồng (hemocyanin).", "en": "Octopuses have three hearts and copper-based blue blood (hemocyanin)."},
            {"vi": "Hai phần ba số nơ-ron thần kinh của bạch tuộc nằm ở các xúc tu, cho phép các cánh tay suy nghĩ độc lập.", "en": "Two-thirds of an octopus's neurons reside in its arms, allowing tentacles to explore and react autonomously."}
        ]
    }
}

# Systematic taxonomic class archetypes used to dynamically enrich all species
CLASS_ARCHETYPES = {
    "Mammalia": {
        "lengthRange": [40, 200],
        "weightRange": [5, 150],
        "dietType": "omnivore",
        "activity": "diurnal",
        "social": "gregarious",
        "reproMode": "viviparous",
        "gestation": [60, 180],
        "clutchSize": [1, 4],
        "wildLife": [8, 18],
        "captLife": [12, 25],
        "stages": [
            {"key": "infant", "name": {"vi": "Con non sơ sinh", "en": "Newborn / Infant"}, "desc": "Bú sữa mẹ và phụ thuộc hoàn toàn vào mẹ.", "days": [0, 90]},
            {"key": "juvenile", "name": {"vi": "Giai đoạn thiếu niên", "en": "Juvenile"}, "desc": "Cai sữa, bắt đầu học tập các kỹ năng sinh tồn.", "days": [90, 730]},
            {"key": "adult", "name": {"vi": "Cá thể trưởng thành", "en": "Adult"}, "desc": "Hoàn thiện cơ thể, có khả năng sinh sản độc lập.", "days": [730, 4380]}
        ],
        "funFact": "Động vật có vú có khả năng điều hòa thân nhiệt nội nhiệt (máu nóng) và nuôi con bằng sữa mẹ giàu dưỡng chất."
    },
    "Aves": {
        "lengthRange": [25, 90],
        "weightRange": [0.2, 5],
        "dietType": "carnivore",
        "activity": "diurnal",
        "social": "gregarious",
        "reproMode": "oviparous",
        "gestation": [14, 35],
        "clutchSize": [2, 6],
        "wildLife": [5, 15],
        "captLife": [10, 25],
        "stages": [
            {"key": "egg", "name": {"vi": "Trứng", "en": "Egg"}, "desc": "Trứng có vỏ canxi cứng được bố mẹ ấp giữ nhiệt.", "days": [0, 28]},
            {"key": "fledgling", "name": {"vi": "Chim non học bay", "en": "Fledgling"}, "desc": "Mọc đủ lông vũ và tập bay khỏi tổ.", "days": [28, 90]},
            {"key": "adult", "name": {"vi": "Chim trưởng thành", "en": "Adult Bird"}, "desc": "Trưởng thành sinh dục, tìm kiếm bạn đời xây tổ.", "days": [90, 3650]}
        ],
        "funFact": "Xương chim có cấu trúc rỗng tổ ong giúp giảm trọng lượng tối đa để dễ dàng cất cánh bay lượn."
    },
    "Reptilia": {
        "lengthRange": [50, 250],
        "weightRange": [1, 80],
        "dietType": "carnivore",
        "activity": "diurnal",
        "social": "solitary",
        "reproMode": "oviparous",
        "gestation": [45, 90],
        "clutchSize": [5, 25],
        "wildLife": [15, 40],
        "captLife": [20, 60],
        "stages": [
            {"key": "egg", "name": {"vi": "Trứng có màng ối", "en": "Amniotic Egg"}, "desc": "Vỏ dai hoặc vôi hóa bảo vệ phôi khỏi mất nước trên cạn.", "days": [0, 60]},
            {"key": "juvenile", "name": {"vi": "Bò sát non", "en": "Hatchling / Juvenile"}, "desc": "Tự lập ngay sau khi nở, ẩn nấp tránh thú săn mồi.", "days": [60, 730]},
            {"key": "adult", "name": {"vi": "Bò sát trưởng thành", "en": "Mature Reptile"}, "desc": "Da phủ lớp vảy sừng keratin chống bốc hơi nước.", "days": [730, 10950]}
        ],
        "funFact": "Bò sát là động vật biến nhiệt, điều hòa thân nhiệt bằng cách sưởi nắng trên các mỏm đá ấm."
    },
    "Amphibia": {
        "lengthRange": [5, 25],
        "weightRange": [0.03, 0.5],
        "dietType": "insectivore",
        "activity": "nocturnal",
        "social": "solitary",
        "reproMode": "oviparous",
        "gestation": [5, 14],
        "clutchSize": [50, 500],
        "wildLife": [4, 10],
        "captLife": [6, 15],
        "stages": [
            {"key": "egg", "name": {"vi": "Bọc trứng sền sệt", "en": "Gelatinous Egg Mass"}, "desc": "Đẻ trong môi trường nước, không có vỏ chống mất nước.", "days": [0, 10]},
            {"key": "tadpole", "name": {"vi": "Nòng nọc (Ấu trùng thở mang)", "en": "Tadpole"}, "desc": "Sống dưới nước, bơi bằng đuôi và hô hấp bằng mang ngoài.", "days": [10, 70]},
            {"key": "metamorph", "name": {"vi": "Giai đoạn biến thái", "en": "Froglet / Metamorph"}, "desc": "Tiêu biến đuôi, mọc tứ chi và phát triển phổi thở.", "days": [70, 95]},
            {"key": "adult", "name": {"vi": "Lưỡng cư trưởng thành", "en": "Adult Amphibian"}, "desc": "Hô hấp qua da ẩm ướt và phổi, sống bán cạn.", "days": [95, 2555]}
        ],
        "funFact": "Lưỡng cư có làn da thấm thấu cao, có thể uống nước và thở trực tiếp qua da."
    },
    "Actinopterygii": {
        "lengthRange": [15, 120],
        "weightRange": [0.1, 25],
        "dietType": "carnivore",
        "activity": "diurnal",
        "social": "gregarious",
        "reproMode": "oviparous",
        "gestation": [3, 10],
        "clutchSize": [1000, 50000],
        "wildLife": [5, 20],
        "captLife": [8, 25],
        "stages": [
            {"key": "egg", "name": {"vi": "Trứng cá", "en": "Fish Egg"}, "desc": "Trôi nổi tự do trong dòng nước hoặc bám vào thực vật thủy sinh.", "days": [0, 5]},
            {"key": "fry", "name": {"vi": "Cá bột mang túi noãn hoàng", "en": "Yolk-sac Fry"}, "desc": "Sống dựa vào túi dinh dưỡng gắn liền trước bụng.", "days": [5, 20]},
            {"key": "juvenile", "name": {"vi": "Cá nhỡ", "en": "Fingerling / Juvenile"}, "desc": "Bơi theo đàn kiếm ăn sinh vật phù du và giáp xác nhỏ.", "days": [20, 180]},
            {"key": "adult", "name": {"vi": "Cá trưởng thành", "en": "Adult Fish"}, "desc": "Hệ tuần hoàn hoàn thiện với vây tia định hướng linh hoạt.", "days": [180, 4380]}
        ],
        "funFact": "Cá xương sở hữu cơ quan đường bên (lateral line) cảm nhận áp suất nước và dao động cực kỳ nhạy bén."
    },
    "Chondrichthyes": {
        "lengthRange": [150, 450],
        "weightRange": [50, 800],
        "dietType": "carnivore",
        "activity": "crepuscular",
        "social": "solitary",
        "reproMode": "ovoviviparous",
        "gestation": [180, 365],
        "clutchSize": [2, 14],
        "wildLife": [25, 50],
        "captLife": [15, 30],
        "stages": [
            {"key": "pup", "name": {"vi": "Cá con bơi độc lập", "en": "Pup"}, "desc": "Sinh ra đã có đủ hàm răng nhọn và tự lập săn mồi.", "days": [0, 365]},
            {"key": "adult", "name": {"vi": "Cá sụn trưởng thành", "en": "Apex Shark / Ray"}, "desc": "Bộ xương hoàn toàn bằng sụn dẻo dai giúp tăng tốc nhanh.", "days": [365, 12775]}
        ],
        "funFact": "Cá mập có các bóng Lorenzini phát hiện điện trường phát ra từ nhịp tim của con mồi ẩn dưới cát."
    },
    "Insecta": {
        "lengthRange": [2, 12],
        "weightRange": [0.001, 0.05],
        "dietType": "herbivore",
        "activity": "diurnal",
        "social": "solitary",
        "reproMode": "oviparous",
        "gestation": [3, 14],
        "clutchSize": [50, 400],
        "wildLife": [0.2, 1],
        "captLife": [0.5, 1.5],
        "stages": [
            {"key": "egg", "name": {"vi": "Trứng côn trùng", "en": "Egg"}, "desc": "Được đẻ trên nguồn thức ăn phù hợp.", "days": [0, 7]},
            {"key": "larva", "name": {"vi": "Ấu trùng ăn nhiều", "en": "Larva / Nymph"}, "desc": "Ăn liên tục và lột xác qua từng giai đoạn tuổi.", "days": [7, 30]},
            {"key": "pupa", "name": {"vi": "Giai đoạn nhộng", "en": "Pupa"}, "desc": "Tái tổ chức mô toàn bộ cơ thể trong vỏ kén kín.", "days": [30, 45]},
            {"key": "adult", "name": {"vi": "Thành trùng cánh cứng", "en": "Imago / Adult"}, "desc": "Có bộ xương ngoài chitin và cánh bay linh hoạt.", "days": [45, 365]}
        ],
        "funFact": "Côn trùng là nhóm sinh vật phong phú nhất hành tinh, chiếm hơn 80% tổng số loài động vật đã biết."
    },
    "Arachnida": {
        "lengthRange": [3, 18],
        "weightRange": [0.002, 0.15],
        "dietType": "carnivore",
        "activity": "nocturnal",
        "social": "solitary",
        "reproMode": "oviparous",
        "gestation": [20, 60],
        "clutchSize": [50, 300],
        "wildLife": [2, 10],
        "captLife": [5, 20],
        "stages": [
            {"key": "egg_sac", "name": {"vi": "Túi trứng tơ", "en": "Silk Egg Sac"}, "desc": "Trứng được bọc trong kén tơ bảo vệ nhiệt và ẩm.", "days": [0, 30]},
            {"key": "spiderling", "name": {"vi": "Nhện con", "en": "Spiderling / Scorpling"}, "desc": "Tập trung trên lưng mẹ trước khi phân tán bằng tơ dù.", "days": [30, 180]},
            {"key": "adult", "name": {"vi": "Hình thái trưởng thành", "en": "Mature Arachnid"}, "desc": "Có 8 chân, kìm nhả độc và cơ quan nhả tơ chuyên biệt.", "days": [180, 2920]}
        ],
        "funFact": "Tơ nhện có độ bền kéo cao gấp 5 lần thép có cùng độ dày và có khả năng co giãn đàn hồi vượt trội."
    },
    "Cephalopoda": {
        "lengthRange": [30, 150],
        "weightRange": [1, 20],
        "dietType": "carnivore",
        "activity": "nocturnal",
        "social": "solitary",
        "reproMode": "oviparous",
        "gestation": [25, 60],
        "clutchSize": [1000, 50000],
        "wildLife": [1, 3],
        "captLife": [1.5, 4],
        "stages": [
            {"key": "egg", "name": {"vi": "Cụm trứng", "en": "Egg Capsule"}, "desc": "Được đính thành chùm dưới rạn đá biển.", "days": [0, 40]},
            {"key": "paralarva", "name": {"vi": "Ấu trùng phù du", "en": "Paralarva"}, "desc": "Săn giáp xác nhỏ ở tầng nước giữa.", "days": [40, 100]},
            {"key": "adult", "name": {"vi": "Thân mềm chân đầu trưởng thành", "en": "Adult Cephalopod"}, "desc": "Có mắt tinh tường và bộ não lớn nhất trong giới vô xương sống.", "days": [100, 730]}
        ],
        "funFact": "Mực và bạch tuộc có thể giải phóng một túi mực đen chứa melanin để tạo ảo ảnh con mồi giả đánh lừa kẻ thù."
    },
    "Asteroidea": {
        "lengthRange": [12, 35],
        "weightRange": [0.05, 0.4],
        "dietType": "carnivore",
        "activity": "nocturnal",
        "social": "solitary",
        "reproMode": "oviparous",
        "gestation": [1, 3],
        "clutchSize": [50000, 1000000],
        "wildLife": [5, 25],
        "captLife": [6, 15],
        "stages": [
            {"key": "bipinnaria", "name": {"vi": "Ấu trùng Bipinnaria", "en": "Bipinnaria Larva"}, "desc": "Bơi tự do có đối xứng hai bên.", "days": [0, 20]},
            {"key": "brachiolaria", "name": {"vi": "Ấu trùng Brachiolaria", "en": "Brachiolaria Larva"}, "desc": "Bám xuống đá ngầm chuẩn bị biến thái đối xứng 5 cánh.", "days": [20, 40]},
            {"key": "adult", "name": {"vi": "Sao biển trưởng thành", "en": "Adult Sea Star"}, "desc": "Đối xứng tỏa tròn ngũ giác với hệ thống chân ống thủy lực.", "days": [40, 5475]}
        ],
        "funFact": "Sao biển có thể lộn ngược dạ dày ra ngoài cơ thể để tiêu hóa con mồi ngay bên trong vỏ của chúng."
    },
    "Annelida": {
        "lengthRange": [8, 25],
        "weightRange": [0.005, 0.03],
        "dietType": "detritivore",
        "activity": "nocturnal",
        "social": "solitary",
        "reproMode": "oviparous",
        "gestation": [14, 30],
        "clutchSize": [1, 5],
        "wildLife": [2, 8],
        "captLife": [3, 10],
        "stages": [
            {"key": "cocoon", "name": {"vi": "Kén đai sinh dục", "en": "Clitellar Cocoon"}, "desc": "Bọc chứa phôi phát triển trong đất ẩm.", "days": [0, 21]},
            {"key": "juvenile", "name": {"vi": "Giun non", "en": "Hatchling Worm"}, "desc": "Đào bới ăn mùn hữu cơ và vi sinh vật.", "days": [21, 120]},
            {"key": "adult", "name": {"vi": "Giun phân đốt trưởng thành", "en": "Mature Annelid"}, "desc": "Cơ thể phân đốt đồng hình giúp cày xới và thông khí cho đất.", "days": [120, 2190]}
        ],
        "funFact": "Giun đất là sinh vật lưỡng tính có cả cơ quan sinh dục đực và cái, nhưng vẫn cần kết đôi trao đổi tinh trùng."
    },
    "Cnidaria": {
        "lengthRange": [10, 60],
        "weightRange": [0.05, 2],
        "dietType": "carnivore",
        "activity": "diurnal",
        "social": "colonial",
        "reproMode": "asexual",
        "gestation": [1, 5],
        "clutchSize": [1000, 100000],
        "wildLife": [0.5, 5],
        "captLife": [1, 8],
        "stages": [
            {"key": "planula", "name": {"vi": "Ấu trùng Planula", "en": "Planula Larva"}, "desc": "Ấu trùng có lông bơi tự do tìm nền đá thích hợp.", "days": [0, 7]},
            {"key": "polyp", "name": {"vi": "Thể Polyp gắn cố định", "en": "Sessile Polyp"}, "desc": "Cắm rễ sinh sản vô tính bằng cách nhân chồi.", "days": [7, 60]},
            {"key": "medusa", "name": {"vi": "Thể Thủy mẫu (Sứa bơi lội)", "en": "Free-swimming Medusa"}, "desc": "Tế bào gai châm đốt cnidocyte dùng bắt mồi và phòng thủ.", "days": [60, 365]}
        ],
        "funFact": "Tế bào gai châm đốt (nematocyst) của sứa là một trong những cơ chế phóng kim sinh học nhanh nhất tự nhiên."
    },
    "Porifera": {
        "lengthRange": [5, 40],
        "weightRange": [0.02, 1.5],
        "dietType": "filter_feeder",
        "activity": "diurnal",
        "social": "colonial",
        "reproMode": "asexual",
        "gestation": [3, 10],
        "clutchSize": [100, 10000],
        "wildLife": [10, 100],
        "captLife": [5, 50],
        "stages": [
            {"key": "larva", "name": {"vi": "Ấu trùng có roi", "en": "Ciliated Larva"}, "desc": "Trôi theo dòng hải lưu trước khi bám vào đá san hô.", "days": [0, 3]},
            {"key": "sponge", "name": {"vi": "Cá thể bọt biển trưởng thành", "en": "Sessile Sponge"}, "desc": "Lọc hàng nghìn lít nước mỗi ngày qua các lỗ thoát nước osculum.", "days": [3, 18250]}
        ],
        "funFact": "Bọt biển không có các mô hay cơ quan thật sự, nhưng các tế bào có thể tự tái tạo lại toàn bộ cơ thể nếu bị nghiền nát."
    },
    "Platyhelminthes": {
        "lengthRange": [1, 15],
        "weightRange": [0.0001, 0.005],
        "dietType": "carnivore",
        "activity": "nocturnal",
        "social": "solitary",
        "reproMode": "asexual",
        "gestation": [2, 8],
        "clutchSize": [10, 200],
        "wildLife": [1, 3],
        "captLife": [2, 5],
        "stages": [
            {"key": "egg", "name": {"vi": "Trứng sán dẹp", "en": "Encapsulated Egg"}, "desc": "Chứa noãn hoàng và phôi được bài tiết ra ngoài.", "days": [0, 14]},
            {"key": "flatworm", "name": {"vi": "Sán dẹp trưởng thành", "en": "Adult Flatworm"}, "desc": "Cơ thể dẹp lưng bụng đối xứng hai bên không có khoang cơ thể.", "days": [14, 730]}
        ],
        "funFact": "Sán dẹp Planaria có khả năng tái sinh thần kỳ: nếu cắt một con thành 200 mảnh nhỏ, mỗi mảnh đều mọc thành một cá thể hoàn chỉnh."
    }
}
