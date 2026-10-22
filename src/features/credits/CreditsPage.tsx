import React from 'react';
import { Award, ShieldCheck } from 'lucide-react';

export const CreditsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <Award className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white">Ghi công & Giấy phép (Credits & Licenses)</h1>
          <p className="text-sm text-stone-400">Minh bạch bản quyền và xuất xứ dữ liệu trong Zoopedia</p>
        </div>
      </div>

      <div className="space-y-8 text-stone-300 text-sm leading-relaxed">
        {/* Principles */}
        <div className="p-6 rounded-2xl bg-stone-800/40 border border-stone-800">
          <h2 className="text-base font-bold text-white flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Nguyên tắc bảo vệ bản quyền
          </h2>
          <p>
            Zoopedia tuyệt đối tôn trọng quyền tác giả và chỉ sử dụng các nguồn dữ liệu, hình ảnh, và mô hình 3D có giấy phép mở rõ ràng (CC0, CC-BY, CC-BY-SA, Open Heritage). Mọi thông tin đều gắn với bản ghi nguồn (provenance) và liên kết gốc.
          </p>
        </div>

        {/* External Databases */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Các nguồn dữ liệu mở sử dụng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-stone-800/30 border border-stone-800">
              <div className="font-bold text-white mb-1">GBIF Backbone Taxonomy</div>
              <p className="text-xs text-stone-400 mb-2">Hệ thống phân loại sinh học, tên khoa học chuẩn và khóa định danh loài.</p>
              <div className="text-xs text-emerald-400 font-semibold">Giấy phép: CC0 / CC-BY 4.0</div>
            </div>

            <div className="p-5 rounded-xl bg-stone-800/30 border border-stone-800">
              <div className="font-bold text-white mb-1">Wikidata & Wikimedia Commons</div>
              <p className="text-xs text-stone-400 mb-2">Liên kết chéo mã định danh, tên thông thường đa ngôn ngữ và hình ảnh minh họa.</p>
              <div className="text-xs text-emerald-400 font-semibold">Giấy phép: CC0 & CC-BY-SA 4.0</div>
            </div>

            <div className="p-5 rounded-xl bg-stone-800/30 border border-stone-800">
              <div className="font-bold text-white mb-1">IUCN Red List</div>
              <p className="text-xs text-stone-400 mb-2">Tình trạng bảo tồn loài, xu hướng số lượng quần thể và các nguy cơ tuyệt chủng.</p>
              <div className="text-xs text-emerald-400 font-semibold">Giấy phép: Tham chiếu phi thương mại / Trait data</div>
            </div>

            <div className="p-5 rounded-xl bg-stone-800/30 border border-stone-800">
              <div className="font-bold text-white mb-1">Smithsonian 3D & Sketchfab CC0/CC-BY</div>
              <p className="text-xs text-stone-400 mb-2">Mẫu vật giải phẫu và khung xương quét 3D kỹ thuật số.</p>
              <div className="text-xs text-emerald-400 font-semibold">Giấy phép: Smithsonian Open Access (CC0) & CC-BY 4.0</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-stone-800 pt-6 text-xs text-stone-500">
          Nếu bạn phát hiện bất kỳ nội dung nào có sai sót về ghi công hoặc giấy phép, vui lòng liên hệ ban quản trị dự án hoặc tạo issue trên kho mã nguồn Zoopedia.
        </div>
      </div>
    </div>
  );
};
