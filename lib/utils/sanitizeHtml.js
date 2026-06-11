/**
 * Lightweight HTML sanitizer for trusted, admin-authored rich text
 * (e.g. the developer "About" content produced by the in-house editor).
 *
 * This is defense-in-depth, not a full XSS engine: the content comes from
 * authenticated admins, but we still strip the common execution vectors so a
 * bad paste can't inject script. Pure string ops — safe to run on the server
 * (no DOM dependency).
 */
function sanitizeHtml(html) {
  if (!html || typeof html !== "string") return "";

  let out = html;

  // Drop dangerous elements together with their contents.
  out = out.replace(
    /<(script|style|iframe|object|embed|noscript|template)\b[^>]*>[\s\S]*?<\/\1>/gi,
    ""
  );
  // Drop stray/standalone structural or dangerous tags.
  out = out.replace(
    /<\/?(script|style|iframe|object|embed|link|meta|base|form|input|button|noscript|template)\b[^>]*>/gi,
    ""
  );
  // Strip inline event handlers: onclick="...", onmouseover='...', onload=foo
  out = out.replace(/\son\w+\s*=\s*"[^"]*"/gi, "");
  out = out.replace(/\son\w+\s*=\s*'[^']*'/gi, "");
  out = out.replace(/\son\w+\s*=\s*[^\s>]+/gi, "");
  // Neutralise javascript:/data: URLs in href/src.
  out = out.replace(/(href|src)\s*=\s*"(?:\s*(?:javascript|data):)[^"]*"/gi, '$1="#"');
  out = out.replace(/(href|src)\s*=\s*'(?:\s*(?:javascript|data):)[^']*'/gi, "$1='#'");

  return out;
}

module.exports = { sanitizeHtml };
