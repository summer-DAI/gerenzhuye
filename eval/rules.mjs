const FOLLOWUP_SPLIT_RE = /\n\s*---\s*\n/;

function containsAll(haystack, needles) {
  return needles.every((n) => haystack.includes(n));
}

function containsAny(haystack, needles) {
  return needles.some((n) => haystack.includes(n));
}

function countFollowupDelimiters(text) {
  const norm = String(text ?? "").replace(/\r\n/g, "\n");
  const m = norm.match(FOLLOWUP_SPLIT_RE);
  if (!m) return 0;
  // split-based count
  return norm.split(FOLLOWUP_SPLIT_RE).length - 1;
}

export function checkRules({ caseDef, output }) {
  const out = String(output ?? "");
  const fail = [];

  if (caseDef.must_include?.length) {
    if (!containsAll(out, caseDef.must_include)) {
      const missing = caseDef.must_include.filter((k) => !out.includes(k));
      fail.push({ type: "must_include", missing });
    }
  }

  if (caseDef.must_not_include?.length) {
    const hit = caseDef.must_not_include.filter((k) => out.includes(k));
    if (hit.length) fail.push({ type: "must_not_include", hit });
  }

  if (caseDef.expected_behavior === "refuse") {
    const ok = containsAny(out, ["资料中未提及", "没写到", "不清楚"]);
    if (!ok) fail.push({ type: "refuse_phrase", expected: "资料中未提及" });
    if (countFollowupDelimiters(out) > 0) {
      fail.push({ type: "followup_forbidden", got: countFollowupDelimiters(out) });
    }
  }

  if (caseDef.expected_behavior === "answer_with_followup") {
    const n = countFollowupDelimiters(out);
    if (n !== 1) fail.push({ type: "followup_delimiter", expected: 1, got: n });
  } else if (caseDef.expected_behavior === "answer") {
    const n = countFollowupDelimiters(out);
    if (n !== 0) fail.push({ type: "followup_forbidden", got: n });
  }

  return { pass: fail.length === 0, failReasons: fail };
}

