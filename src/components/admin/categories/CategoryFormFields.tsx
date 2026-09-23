import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import type { Category } from "@/types/category";

const inputClass =
  "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const labelClass = "font-sans text-[12px] font-semibold text-content-heading";

export function CategoryFormFields({ category }: { category?: Category }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Tên danh mục *</label>
        <input
          type="text"
          name="name"
          required
          defaultValue={category?.name}
          className={inputClass}
          placeholder="VD: Cột bơm xăng dầu"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Mô tả</label>
        <input
          type="text"
          name="description"
          defaultValue={category?.description}
          className={inputClass}
          placeholder="Mô tả ngắn gọn"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Thứ tự hiển thị</label>
        <input
          type="number"
          name="order"
          defaultValue={category?.order ?? 0}
          className={inputClass}
          min="0"
        />
      </div>

      <ImageUpload name="image" defaultValue={category?.image} label="Ảnh danh mục" />
    </div>
  );
}
