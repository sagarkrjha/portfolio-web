import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 18,
        background: "#0d1b17",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#34d399",
        borderRadius: "0px",
        fontWeight: 900,
        fontFamily: "monospace",
        border: "1.5px solid rgba(52, 211, 153, 0.45)",
      }}
    >
      S
    </div>,
    {
      ...size,
    },
  );
}
