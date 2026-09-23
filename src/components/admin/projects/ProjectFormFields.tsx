import { ImageUpload } from "@/components/admin/shared/ImageUpload";
import type { Project } from "@/types/project";

const inputClass = "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const textareaClass = "w-full resize-none rounded-btn border border-border-ui bg-white px-3 py-2 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";
const labelClass = "font-sans text-[12px] font-semibold text-content-heading";

export const PROJECT_IMAGE_PLACEHOLDER = "/images/home/astc-fuel-station.png";

export function ProjectFormFields({ project }: { project?: Project }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 flex flex-col gap-5">
        <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
          <h2 className="mb-5 font-heading font-semibold text-[15px] text-content-heading border-b border-border-ui pb-4">
            Thông tin dự án
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Tên dự án *</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={project?.name}
                className={inputClass}
                placeholder="VD: Hệ thống đo bồn tự động trạm xăng dầu Long Biên"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Mô tả ngắn</label>
              <textarea
                rows={3}
                name="summary"
                defaultValue={project?.summary}
                className={textareaClass}
                placeholder="Dòng mô tả hiển thị trên thẻ dự án ở trang chủ"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Mô tả chi tiết</label>
              <textarea
                rows={6}
                name="description"
                defaultValue={project?.description}
                className={textareaClass}
                placeholder="Nội dung đầy đủ về dự án"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Hạng mục triển khai</label>
              <textarea
                rows={4}
                name="scope"
                defaultValue={project?.scope?.join("\n")}
                className={textareaClass}
                placeholder="Mỗi hạng mục một dòng&#10;VD: Lắp đặt thước đo bồn tự động&#10;Kết nối dữ liệu cột bơm"
              />
              <p className="font-sans text-[12px] text-content-muted">Mỗi dòng là một hạng mục.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-5">
        <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
          <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Thông tin triển khai</h2>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Địa điểm</label>
              <input type="text" name="location" defaultValue={project?.location} className={inputClass} placeholder="VD: Hà Nội" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Chủ đầu tư</label>
              <input type="text" name="client" defaultValue={project?.client} className={inputClass} placeholder="VD: Công ty CP Xăng dầu ABC" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Năm triển khai</label>
              <input type="number" name="year" min="1900" max="2200" defaultValue={project?.year} className={inputClass} placeholder="2026" />
            </div>
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                name="published"
                defaultChecked={project?.published ?? true}
                className="h-4 w-4 accent-brand cursor-pointer"
              />
              <span className="font-sans text-[13px] text-content-body">Xuất bản (hiển thị trên trang chủ)</span>
            </label>
          </div>
        </div>

        <div className="rounded-card bg-white border border-border-ui shadow-card p-6">
          <h2 className="mb-4 font-heading font-semibold text-[15px] text-content-heading">Ảnh dự án</h2>
          <ImageUpload
            name="image"
            defaultValue={project?.image ?? PROJECT_IMAGE_PLACEHOLDER}
            label="Ảnh đại diện"
          />
          <div className="mt-4 flex flex-col gap-1.5">
            <label className={labelClass}>Mô tả ảnh</label>
            <input
              type="text"
              name="imageAlt"
              defaultValue={project?.imageAlt}
              className={inputClass}
              placeholder="Mô tả ngắn nội dung ảnh"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
