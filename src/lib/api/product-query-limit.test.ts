import { beforeEach, describe, expect, it, vi } from "vitest";

// Trang chủ chỉ hiển thị vài sản phẩm nổi bật. Trước đây nó gọi getProducts()
// không giới hạn rồi cắt bằng slice, nên mỗi lần render kéo toàn bộ bảng
// product kèm quan hệ về chỉ để vứt đi gần hết.

const { dbMock, calls } = vi.hoisted(() => {
  const calls: Array<Record<string, unknown>> = [];
  return {
    calls,
    dbMock: {
      product: {
        findMany: vi.fn(async (args?: Record<string, unknown>) => {
          calls.push(args ?? {});
          return [];
        }),
        count: vi.fn(async () => 0),
      },
    },
  };
});

vi.mock("@/lib/db", () => ({ db: dbMock }));

import { getProducts } from "@/lib/api/products";

beforeEach(() => {
  calls.length = 0;
});

describe("getProducts limit", () => {
  it("đẩy limit xuống thành take để database trả về đúng số bản ghi cần", async () => {
    await getProducts({}, { limit: 3 });

    expect(calls).toHaveLength(1);
    expect(calls[0].take).toBe(3);
  });

  it("không đặt take khi không truyền limit", async () => {
    await getProducts();

    expect(calls).toHaveLength(1);
    expect(calls[0]).not.toHaveProperty("take");
  });

  it("giữ nguyên bộ lọc khi có limit", async () => {
    await getProducts({ categorySlug: "may-bom" }, { limit: 5 });

    expect(calls[0].take).toBe(5);
    expect(calls[0].where).toMatchObject({
      published: true,
      category: { slug: "may-bom" },
    });
  });
});
