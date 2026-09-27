import { ImageResponse } from "next/og";

export const alt = "Ankooaitelier — Modern fashion, delivered across Nigeria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "90px",
          background: "linear-gradient(135deg,#0f412e 0%,#177c4e 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: 76,
              height: 76,
              borderRadius: 18,
              background: "rgba(255,255,255,0.14)",
              color: "white",
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 9999, background: "white" }} />
            <div style={{ fontSize: 44, fontWeight: 600, lineHeight: 1, marginTop: 2 }}>a</div>
          </div>
          <div style={{ fontSize: 30, letterSpacing: 10, textTransform: "uppercase", opacity: 0.8 }}>
            Ankooaitelier
          </div>
        </div>
        <div style={{ fontSize: 74, fontWeight: 700, marginTop: 28, lineHeight: 1.1, maxWidth: 900 }}>
          Modern fashion, delivered across Nigeria
        </div>
        <div style={{ fontSize: 30, marginTop: 34, opacity: 0.85 }}>
          Dresses · Native wear · Sneakers · Order on WhatsApp
        </div>
      </div>
    ),
    { ...size }
  );
}
