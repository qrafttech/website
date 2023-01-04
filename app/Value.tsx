interface ValueProps {
  title: string;
  content: string;
}

export default function Value({ title, content }: ValueProps) {
  return (
    <div className="flex flex-col px-8 pb-8">
      <h4 className="pb-3 font-serif text-2xl font-bold">{title}</h4>
      <p>{content}</p>
    </div>
  );
}
