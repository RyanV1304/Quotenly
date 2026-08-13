import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#060a14",
          backgroundImage: "radial-gradient(circle at 20% 0%, #1a2f6e 0%, #0a1128 45%, #060a14 100%)",
          padding: 80,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#2a5cdb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            Q
          </div>
          <div style={{ color: "#fff", fontSize: 36, fontWeight: 700 }}>Quotenly</div>
        </div>
        <div
          style={{
            display: "flex",
            color: "#fff",
            fontSize: 60,
            fontWeight: 700,
            textAlign: "center",
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          Quote it. Send it. Get paid.
        </div>
        <div
          style={{
            display: "flex",
            color: "#a8aebc",
            fontSize: 28,
            marginTop: 24,
            textAlign: "center",
            maxWidth: 760,
          }}
        >
          Quoting and invoicing for small trade crews — one flat price, no per-seat billing.
        </div>
      </div>
    ),
    { ...size }
  );
}
