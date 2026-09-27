import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// The Ankoo mark: a lowercase "a" with a dot above it, on a brand tile.
export default function Icon() {
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
          background: "#177c4e",
          color: "white",
          borderRadius: 7,
        }}
      >
        <div style={{ width: 4, height: 4, borderRadius: 9999, background: "white" }} />
        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1, marginTop: 1 }}>a</div>
      </div>
    ),
    { ...size }
  );
}
