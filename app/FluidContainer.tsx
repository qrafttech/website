import { ReactNode } from "react";
import clsx from "clsx";

type FluidContainerProps = Partial<Pick<HTMLDivElement, "className">> & {
  children: ReactNode;
};

export default function FluidContainer({
  className,
  children,
}: FluidContainerProps) {
  return (
    <div className={clsx("flex justify-center", className)}>
      <div className="max-w-screen-2xl px-4 pt-6 lg:px-24 xl:px-32">
        {children}
      </div>
    </div>
  );
}
