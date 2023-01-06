import Image, { ImageProps } from "next/image";

export default function Logo({ title, ...props }: ImageProps) {
  return (
    <div className="flex flex-col items-center pb-8 pr-6">
      <Image className="h-12 w-12" {...props} alt={"" || props.alt} />
      <p className="pt-3 text-center text-sm font-normal">{title}</p>
    </div>
  );
}
