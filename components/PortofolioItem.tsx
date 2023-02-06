import { ReactNode } from "react";

interface PortfolioItemProps {
  image: ReactNode;
  title: string;
  description: ReactNode;
  stack: string;
  integrations: string;
}

export default function PortfolioItem({
  image,
  title,
  description,
  stack,
  integrations,
}: PortfolioItemProps) {
  return (
    <div>
      <div className="pb-4">{image}</div>
      <h3 className="pb-2 font-serif text-2xl font-bold">{title}</h3>
      <p className="pb-2">{description}</p>
      <ul>
        <li>
          <em>
            <strong>Stack&nbsp;: </strong>
            {stack}
          </em>
        </li>
        <li>
          <em>
            <strong>Intégrations&nbsp;: </strong>
            {integrations}
          </em>
        </li>
      </ul>
    </div>
  );
}
