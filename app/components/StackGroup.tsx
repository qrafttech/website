import { ReactNode } from "react";

interface StackGroupProps {
  title: string;
  children: ReactNode;
}

export default function StackGroup({ title, children }: StackGroupProps) {
  return (
    <div className="flex flex-col">
      <h4 className="pb-4 font-serif text-sm font-bold uppercase text-pink-600">
        {title}
      </h4>
      <div className="flex flex-wrap items-start [&>*]:pr-6 [&>*]:pb-6">
        {children}
      </div>
    </div>
  );
}
