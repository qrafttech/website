import { ReactNode } from "react";
import clsx from "clsx";

type FluidContainerProps = Partial<Pick<HTMLDivElement, "className" | "id">> & {
  children: ReactNode;
};

export default function FluidContainer({
  id,
  className,
  children,
}: FluidContainerProps) {
  return (
    <div id={id} className={clsx("flex justify-center", className)}>
      <div className="max-w-screen-2xl px-4 pt-6 lg:px-24 xl:px-32">
        {children}
      </div>
    </div>
  );
}
