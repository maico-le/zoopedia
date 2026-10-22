import os
import sys
import json

if sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

species_dir = 'data/species'
files = [f for f in os.listdir(species_dir) if f.endswith('.json')]
total_species = len(files)

tier_counts = {'A': 0, 'B': 0, 'C': 0}
has_3d_count = 0
phyla_breakdown = {}

for f in files:
    with open(os.path.join(species_dir, f), 'r', encoding='utf-8') as fp:
        data = json.load(fp)
    m = data.get('media', {}).get('model3d')
    tier = m.get('tier', 'C') if m else 'C'
    tier_counts[tier] = tier_counts.get(tier, 0) + 1
    if m and m.get('glb'):
        has_3d_count += 1
    
    ph = data.get('taxonomy', {}).get('phylum', 'Unknown')
    if ph not in phyla_breakdown:
        phyla_breakdown[ph] = {'total': 0, 'has3d': 0, 'tierA': 0, 'tierB': 0, 'tierC': 0}
    phyla_breakdown[ph]['total'] += 1
    if m and m.get('glb'):
        phyla_breakdown[ph]['has3d'] += 1
        phyla_breakdown[ph]['tier' + tier] += 1
    else:
        phyla_breakdown[ph]['tierC'] += 1

models_dir = 'public/models'
model_files = [f for f in os.listdir(models_dir) if f.endswith('.glb')]

print(f"Tổng số loài trong cơ sở dữ liệu: {total_species}")
print(f"Số lượng file mô hình 3D (.glb) độc lập: {len(model_files)}")
print(f"Số loài đã có hiển thị 3D (Tier A + Tier B): {has_3d_count} ({has_3d_count/total_species*100:.1f}%)")
print(f"  • Tier A (Mô hình chính xác theo loài): {tier_counts['A']}")
print(f"  • Tier B (Mô hình đại diện nhóm chuẩn): {tier_counts['B']}")
print(f"  • Tier C (Chưa có 3D, hiển thị tiêu bản 2D): {tier_counts['C']}")
print(f"Chênh lệch số loài chưa có 3D: {total_species - has_3d_count} loài")

print("\nChi tiết theo 8 ngành động vật:")
for ph, stats in sorted(phyla_breakdown.items(), key=lambda x: -x[1]['total']):
    pct = (stats['has3d'] / stats['total']) * 100
    print(f"  - {ph:16s}: {stats['total']:2d} loài | Có 3D: {stats['has3d']:2d} ({pct:4.1f}%) | Tier A: {stats['tierA']:2d}, Tier B: {stats['tierB']:2d}, Tier C: {stats['tierC']:2d}")
