import { IS_DEV, PORT } from "./config/server.ts";
import { CHARSET, HTML_LANG } from "./config/client.ts";

// deno-fmt-ignore
export const Layout = `<!DOCTYPE html>
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
  {{headScript}}
  
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

// export const LZUTF8 = `
//   <script src="//unpkg.com/lzutf8@0.6.3/build/production/lzutf8.min.js"></script>
//   <script>
//     function encodeBase64(str) { return LZUTF8.encodeBase64(str) }
//     function decodeBase64(str) { return LZUTF8.decodeBase64(str) }
//     function compressText(str) { return encodeBase64(LZUTF8.compress(str, { outputEncoding: "ByteArray" })) }
//     function decompressText(str) { return LZUTF8.decompress(LZUTF8.decodeBase64(str)) }
//   </script>`;

const DefaultData = {
  title: "",
  body: "",
  headScript: "",
  bodyScript: "",
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
export const PlaygroundView = `
  <script src="${STATIC_URL_PREFIX}index.${ext}" type="module"></script>
  
  <script src="//unpkg.jd.com/react@18.2.0/umd/react.development.js"></script>
  <script src="//unpkg.jd.com/react-dom@18.2.0/umd/react-dom.development.js"></script>
`;
export const IframeView = `
`;

export function render(
  html: string,
  data: Record<string, any>,
  layout: string = Layout,
) {
  return Object.entries(Object.assign(DefaultData, data)).reduce(
    (acc, [k, v]) => {
      return acc.replaceAll(`{{${k}}}`, v);
    },
    layout.replace("<% yield %>", html),
  );
}

export function HtmlResponse(html: string, data: Record<string, any>) {
  return new Response(render(html, data), {
    headers: { "content-type": "text/html; charset=UTF-8" },
  });
}
