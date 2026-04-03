"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // #region agent log
    fetch("http://127.0.0.1:7808/ingest/f9ad054b-d060-4d5c-aec3-5bd3e215db79", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "627bec",
      },
      body: JSON.stringify({
        sessionId: "627bec",
        runId: "repro",
        hypothesisId: "E1",
        location: "src/app/global-error.tsx:GlobalError",
        message: "GlobalError triggered",
        data: {
          name: error?.name,
          message: error?.message,
          digest: (error as any)?.digest ?? null,
          stackHead:
            typeof error?.stack === "string"
              ? error.stack.split("\n").slice(0, 8).join("\n")
              : null,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion agent log
  }, [error]);

  return (
    <html lang="zh-CN">
      <body>
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-2xl font-bold">应用出错了</h1>
          <p className="mt-3 text-sm opacity-80">
            你可以重试一次。如果持续出现，请把控制台/终端报错发我。
          </p>
          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={reset}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              重试
            </button>
            <Link
              href="/"
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
            >
              返回首页
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

