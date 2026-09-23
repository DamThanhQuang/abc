import { describe, expect, it } from "vitest";
import { parseTechnicalSpecs } from "@/lib/product-specs";

// Trường này đi qua một hidden input nên nội dung là dữ liệu gửi lên từ client.
// Bản cũ dùng JSON.parse trần: một chuỗi hỏng là văng cả server action.
describe("parseTechnicalSpecs", () => {
  it("đọc được mảng hợp lệ và đánh lại order theo vị trí", () => {
    const input = JSON.stringify([
      { label: "Số vòi", value: "4", order: 9 },
      { label: "Lưu lượng", value: "60 lít/phút", order: 3 },
    ]);

    expect(parseTechnicalSpecs(input)).toEqual([
      { label: "Số vòi", value: "4", order: 0 },
      { label: "Lưu lượng", value: "60 lít/phút", order: 1 },
    ]);
  });

  it("trả mảng rỗng thay vì ném khi JSON hỏng", () => {
    expect(() => parseTechnicalSpecs("{khong-phai-json")).not.toThrow();
    expect(parseTechnicalSpecs("{khong-phai-json")).toEqual([]);
  });

  it("trả mảng rỗng khi giá trị không phải mảng", () => {
    expect(parseTechnicalSpecs(JSON.stringify({ label: "x", value: "y" }))).toEqual([]);
    expect(parseTechnicalSpecs(JSON.stringify("chuỗi"))).toEqual([]);
    expect(parseTechnicalSpecs("")).toEqual([]);
    expect(parseTechnicalSpecs(null)).toEqual([]);
  });

  it("loại các dòng thiếu trường hoặc rỗng", () => {
    const input = JSON.stringify([
      { label: "Hợp lệ", value: "OK" },
      { label: "", value: "thiếu nhãn" },
      { label: "thiếu giá trị", value: "   " },
      { label: "Số vòi", value: 4 },
      null,
      "chuỗi lạc",
    ]);

    expect(parseTechnicalSpecs(input)).toEqual([
      { label: "Hợp lệ", value: "OK", order: 0 },
    ]);
  });

  it("cắt khoảng trắng thừa hai đầu", () => {
    const input = JSON.stringify([{ label: "  Số vòi  ", value: "  4  " }]);

    expect(parseTechnicalSpecs(input)).toEqual([
      { label: "Số vòi", value: "4", order: 0 },
    ]);
  });
});
