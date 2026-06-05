"use client"

import Image from "next/image"
import { useState } from "react"

type Props = {
  src: string
  alt: string
}

const ImageLightbox = ({ src, alt }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          flex: "0 0 360px",
          aspectRatio: "4/3",
          background: "#1a1a1a",
          borderRadius: "8px",
          overflow: "hidden",
          position: "relative",
          cursor: "zoom-in",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "contain" }}
          unoptimized
        />
      </div>
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            cursor: "zoom-out",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "90vw",
              height: "90vh",
            }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              style={{ objectFit: "contain" }}
              unoptimized
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ImageLightbox
