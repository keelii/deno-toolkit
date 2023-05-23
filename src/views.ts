import { CHARSET, HTML_LANG, IS_DEV, PORT } from "./config.ts";

// deno-fmt-ignore
const Layout = `<!DOCTYPE html>
<html lang="${HTML_LANG}">
<head>
  <meta charset="${CHARSET}">
  <title>{{title}}</title>
  <link rel="shortcut icon" type="image/ico" href="favicon.ico" />
  <script>
    window.__IS_DEV__ = ${IS_DEV}
    window.__SERVICE_URL__ = ${IS_DEV ? `"http://localhost:${PORT}/"` : `""`}
  </script>
  ${IS_DEV ? '' : '<link rel="stylesheet" href="static/index.css" />'}
  
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-96N6BQ6VCP"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-96N6BQ6VCP');
  </script>
</head>
<body>
  <div id="root"></div>
  
  <% yield %>

</body> 
</html>`;

const DefaultData = {
  title: "",
  body: "",
};
const STATIC_URL_PREFIX = IS_DEV ? "http://localhost:3000/src/" : "static/";
const ext = IS_DEV ? "tsx" : "js";

export const IndexView = `
  <script src="${STATIC_URL_PREFIX}index.${ext}" type="module"></script>
`;
export const FormatView = `
  <script src="${STATIC_URL_PREFIX}format.${ext}" type="module"></script>
`;
export const DiffView = `
  <script src="${STATIC_URL_PREFIX}diff.${ext}" type="module"></script>
`;
export const HashView = `
  <script src="${STATIC_URL_PREFIX}hash.${ext}" type="module"></script>
`;

export function render(html: string, data: Record<string, any>) {
  return Object.entries(Object.assign(DefaultData, data)).reduce(
    (acc, [k, v]) => {
      return acc.replaceAll(`{{${k}}}`, v);
    },
    Layout.replace("<% yield %>", html),
  );
}

export function HtmlResponse(html: string, data: Record<string, any>) {
  return new Response(render(html, data), {
    headers: { "content-type": "text/html; charset=UTF-8" },
  });
}
