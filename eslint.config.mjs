import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      // Tài sản tĩnh (vd public/tinymce/ sinh ra bởi scripts/copy-tinymce.js postinstall) không
      // phải mã nguồn của app - eslint flat config mặc định không tự loại trừ public/ như
      // "next lint" cũ từng làm.
      "public/**",
      // Script nội bộ của Claude Code (skill scripts), không phải mã nguồn app.
      ".claude/**",
    ],
  },
  {
    // Script Node thuần (CommonJS) chạy ngoài Next.js, không phải mã nguồn app - require() ở
    // đây là đúng, không phải lỗi.
    files: ["scripts/**/*.js", "tailwind.config.js", "prisma/seed.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

export default eslintConfig;
