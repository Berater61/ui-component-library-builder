"use client";

import { useMemo, useState } from "react";

export function HtmlComponentPreview({
  title,
  html,
  css,
  javascript,
  large = false
}: {
  title: string;
  html: string;
  css?: string;
  javascript?: string;
  large?: boolean;
}) {
  const [revision, setRevision] = useState(0);
  const srcDoc = useMemo(() => createPreviewDocument({ html, css, javascript }), [css, html, javascript, revision]);
  const height = large ? "min-h-[360px]" : "min-h-[156px]";

  return (
    <div className="relative">
      <iframe
        className={`block w-full rounded-md border bg-white ${height}`}
        key={revision}
        sandbox={javascript ? "allow-scripts" : ""}
        srcDoc={srcDoc}
        style={{ borderColor: "var(--border)" }}
        title={`Vorschau: ${title}`}
      />
      <button
        className="focus-ring absolute right-2 top-2 rounded border px-2 py-1 text-xs font-semibold"
        onClick={() => setRevision((current) => current + 1)}
        style={{ borderColor: "var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
        type="button"
      >
        Reset
      </button>
    </div>
  );
}

function createPreviewDocument({
  html,
  css,
  javascript
}: {
  html: string;
  css?: string;
  javascript?: string;
}) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; font-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none';" />
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body { margin: 0; width: 100%; min-height: 100%; }
      body {
        min-height: 100vh;
        display: grid;
        place-items: center;
        overflow: auto;
        padding: 16px;
        background: #f6f7f2;
        color: #20231f;
        font-family: Arial, Helvetica, sans-serif;
      }
      button, input, select, textarea { font: inherit; }
      ${css ?? ""}
    </style>
  </head>
  <body>
    ${html}
    ${javascript ? `<script>${javascript}<\/script>` : ""}
  </body>
</html>`;
}
