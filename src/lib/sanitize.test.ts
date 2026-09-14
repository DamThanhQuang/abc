import { describe, expect, it } from "vitest";

import { jsonLdScript, sanitizeArticleHtml } from "@/lib/sanitize";

describe("sanitizeArticleHtml", () => {
  it("removes script tags entirely, content included", () => {
    const result = sanitizeArticleHtml('<p>Xin chao</p><script>alert("xss")</script>');

    expect(result).toContain("Xin chao");
    expect(result).not.toContain("script");
    expect(result).not.toContain("alert");
  });

  it("removes event handler attributes", () => {
    const result = sanitizeArticleHtml('<p onclick="steal()">Noi dung</p>');

    expect(result).toContain("Noi dung");
    expect(result).not.toContain("onclick");
    expect(result).not.toContain("steal");
  });

  it("removes an img whose onerror would fire", () => {
    const result = sanitizeArticleHtml('<img src="x" onerror="alert(1)">');

    expect(result).not.toContain("onerror");
    expect(result).not.toContain("alert");
  });

  it("drops javascript: links but keeps the text", () => {
    const result = sanitizeArticleHtml('<a href="javascript:alert(1)">Bam vao day</a>');

    expect(result).toContain("Bam vao day");
    expect(result).not.toContain("javascript:");
  });

  it("drops embedding tags", () => {
    const result = sanitizeArticleHtml(
      '<iframe src="https://evil.test"></iframe><object data="x"></object><embed src="x">',
    );

    expect(result).not.toContain("iframe");
    expect(result).not.toContain("object");
    expect(result).not.toContain("embed");
  });

  it("drops style tags and inline style attributes", () => {
    const result = sanitizeArticleHtml('<style>body{display:none}</style><p style="color:red">Chu</p>');

    expect(result).toContain("Chu");
    expect(result).not.toContain("<style");
    expect(result).not.toContain("display:none");
    expect(result).not.toContain("color:red");
  });

  it("keeps the formatting the editor actually produces", () => {
    const editorOutput =
      "<h2>Tieu de</h2>" +
      "<p><strong>Dam</strong> va <em>nghieng</em></p>" +
      "<ul><li>Mot</li><li>Hai</li></ul>" +
      "<ol><li>Ba</li></ol>" +
      "<blockquote><p>Trich dan</p></blockquote>" +
      "<pre><code>ma nguon</code></pre>";

    const result = sanitizeArticleHtml(editorOutput);

    for (const tag of ["h2", "strong", "em", "ul", "li", "ol", "blockquote", "pre", "code"]) {
      expect(result).toContain(`<${tag}`);
    }
    expect(result).toContain("Trich dan");
  });

  it("keeps https links and hardens their target", () => {
    const result = sanitizeArticleHtml('<a href="https://example.test/a">Lien ket</a>');

    expect(result).toContain('href="https://example.test/a"');
    expect(result).toContain("Lien ket");
  });

  it("keeps images stored on our own origin", () => {
    const result = sanitizeArticleHtml('<img src="/uploads/anh.jpg" alt="Anh minh hoa">');

    expect(result).toContain('src="/uploads/anh.jpg"');
    expect(result).toContain('alt="Anh minh hoa"');
  });

  it("rejects an inline data: image, which can carry script", () => {
    const result = sanitizeArticleHtml(
      '<img src="data:image/svg+xml;base64,PHN2Zz48c2NyaXB0PmFsZXJ0KDEpPC9zY3JpcHQ+PC9zdmc+">',
    );

    expect(result).not.toContain("data:image/svg");
  });

  it("returns an empty string for empty or missing input", () => {
    expect(sanitizeArticleHtml("")).toBe("");
    expect(sanitizeArticleHtml(undefined)).toBe("");
    expect(sanitizeArticleHtml(null)).toBe("");
  });
});

describe("jsonLdScript", () => {
  it("escapes a closing script tag hidden in the data", () => {
    const result = jsonLdScript({ name: '</script><script>alert("xss")</script>' });

    expect(result).not.toContain("</script>");
    expect(result).toContain("\\u003c");
  });

  it("still parses back to the original value", () => {
    const data = { name: "San pham </script> dac biet", nested: { note: "<b>x</b>" } };

    expect(JSON.parse(jsonLdScript(data))).toEqual(data);
  });

  it("escapes every angle bracket, not just the first", () => {
    const result = jsonLdScript({ a: "<one>", b: "<two>" });

    expect(result).not.toContain("<");
  });
});
