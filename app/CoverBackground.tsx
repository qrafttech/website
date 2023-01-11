import { ReactNode } from "react";

interface CoverBackgroundProps {
  children: ReactNode;
}

export default function CoverBackground({ children }: CoverBackgroundProps) {
  return (
    <div
      className="relative flex justify-center pb-16"
      style={{
        background:
          "linear-gradient(105deg, rgba(220, 52, 235, 0.6) 0%, rgba(220, 52, 235, 0) 31%, rgba(220, 52, 235, 0) 68%, rgba(220, 52, 235, 0.5) 100%), linear-gradient(210deg, #4AA7B8 14.5%, #348CAF 30%, #324DB1 52%, #3116AC 64%, #2B0AB1 83%)",
        WebkitMaskImage: "url(/images/hero-mask-desktop.svg)",
        WebkitMaskPosition: "bottom",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskSize: "cover",
      }}
    >
      <div
        className="absolute inset-y-0 right-0 -left-32 -z-10"
        style={{
          background:
            "linear-gradient(90deg, #f9fafb1a 1%, transparent 1%) 1px 0, transparent",
          backgroundSize: "200px 1px",
        }}
      />
      <div
        className="absolute right-0 bottom-0 -top-32 -left-[126px] -z-10"
        style={{
          opacity: 0.1,
          background:
            "radial-gradient(circle, transparent 2%, #1f2937 2%, #1f2937 98%, transparent 98%, transparent) 200px 200px, linear-gradient(#f9fafb 1.6px, transparent 1.6px) 0 -0.8px, linear-gradient(90deg, #f9fafb 1.6px, #1f2937 1.6px) -0.8px 0",
          backgroundSize: "200px 200px",
        }}
      />
      {children}
    </div>
  );
}
