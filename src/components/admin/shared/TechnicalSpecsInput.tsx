"use client";

import { useId, useState } from "react";

export type TechnicalSpecDraft = {
  label: string;
  value: string;
};

type TechnicalSpecsInputProps = {
  name: string;
  defaultValues?: readonly { label: string; value: string }[];
};

const inputClass =
  "h-10 w-full rounded-btn border border-border-ui bg-white px-3 font-sans text-[13px] text-content-body focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors";

const iconButtonClass =
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-[6px] border border-border-ui text-content-muted transition-colors hover:bg-surface-card hover:text-content-heading disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white";

function MoveUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 11V3M3.5 6.5 7 3l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MoveDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 3v8M3.5 7.5 7 11l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="m3.5 3.5 7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// Dòng trống bị loại trước khi serialize: productSchema bắt buộc label và value
// đều không rỗng, nên gửi dòng dở dang lên sẽ làm hỏng cả lần lưu.
function serialize(rows: readonly TechnicalSpecDraft[]) {
  return JSON.stringify(
    rows
      .map((row) => ({ label: row.label.trim(), value: row.value.trim() }))
      .filter((row) => row.label !== "" && row.value !== "")
      .map((row, index) => ({ ...row, order: index })),
  );
}

export function TechnicalSpecsInput({ name, defaultValues = [] }: TechnicalSpecsInputProps) {
  const fieldId = useId();
  const [rows, setRows] = useState<TechnicalSpecDraft[]>(() =>
    defaultValues.map((spec) => ({ label: spec.label, value: spec.value })),
  );

  const updateRow = (index: number, patch: Partial<TechnicalSpecDraft>) => {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  };

  const addRow = () => setRows((current) => [...current, { label: "", value: "" }]);

  const removeRow = (index: number) =>
    setRows((current) => current.filter((_, i) => i !== index));

  const moveRow = (index: number, direction: -1 | 1) => {
    setRows((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const filledCount = rows.filter(
    (row) => row.label.trim() !== "" && row.value.trim() !== "",
  ).length;

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name={name} value={serialize(rows)} />

      {rows.length === 0 ? (
        <p className="font-sans text-[13px] text-content-muted">
          Chưa có thông số nào. Sản phẩm không có thông số sẽ ẩn hẳn mục
          &ldquo;Thông số kỹ thuật&rdquo; trên trang chi tiết.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((row, index) => (
            // Dùng index làm key vì các dòng không có id ổn định và người dùng
            // có thể đổi chỗ chúng.
            <li key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 font-sans text-[12px] tabular-nums text-content-muted">
                {index + 1}
              </span>
              <input
                type="text"
                value={row.label}
                onChange={(event) => updateRow(index, { label: event.target.value })}
                aria-label={`Tên thông số dòng ${index + 1}`}
                placeholder="Tên thông số (VD: Lưu lượng)"
                maxLength={200}
                className={`${inputClass} flex-1`}
              />
              <input
                type="text"
                value={row.value}
                onChange={(event) => updateRow(index, { value: event.target.value })}
                aria-label={`Giá trị dòng ${index + 1}`}
                placeholder="Giá trị (VD: 60 lít/phút)"
                maxLength={1000}
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => moveRow(index, -1)}
                disabled={index === 0}
                aria-label={`Đưa dòng ${index + 1} lên trên`}
                className={iconButtonClass}
              >
                <MoveUpIcon />
              </button>
              <button
                type="button"
                onClick={() => moveRow(index, 1)}
                disabled={index === rows.length - 1}
                aria-label={`Đưa dòng ${index + 1} xuống dưới`}
                className={iconButtonClass}
              >
                <MoveDownIcon />
              </button>
              <button
                type="button"
                onClick={() => removeRow(index)}
                aria-label={`Xóa dòng ${index + 1}`}
                className={`${iconButtonClass} border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700`}
              >
                <RemoveIcon />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-2 rounded-btn border border-border-ui px-3 py-2 font-sans text-[13px] text-content-body transition-colors hover:bg-surface-card"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Thêm thông số
        </button>

        <p id={fieldId} aria-live="polite" className="font-sans text-[12px] text-content-muted">
          {filledCount} thông số sẽ được lưu
          {rows.length > filledCount ? ` (${rows.length - filledCount} dòng trống bị bỏ qua)` : ""}
        </p>
      </div>
    </div>
  );
}
