import Image from "next/image";

import smilingFace from "../public/images/smiling-face.svg";
import heroBackground from "../public/images/hero-background.png";

export default function Home() {
  return (
    <main>
      <div className="container mx-auto">
        <div className="absolute inset-x-0 top-0 -z-10">
          <Image
            src={heroBackground}
            alt="Blue and pink linear gradient Hero background"
            placeholder="blur"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div className="flex flex-row">
          <div>
            <h1 className="text-3xl font-bold underline">
              La seule agence web dont vous avez besoin
            </h1>
            <p>
              Qraft est une <strong>agence de développement web</strong> qui
              vous accompagne dans la construction de votre application, API ou
              infrastructure technique.
            </p>
            <p>
              Notre équipe composée d&quot;experts de plus de{" "}
              <strong>10 années d&quot;expérience</strong> met l&quot;accent sur
              la <strong>qualité</strong> et la <strong>performance</strong> de
              votre service, dans la durée.
            </p>
            <button
              type="button"
              className="inline-flex items-center px-6 py-4 text-sm font-medium text-white bg-transparent border border-white rounded-2xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Nous contacter
            </button>
          </div>
          <div className="flex justify-center flex-1">
            <Image src={smilingFace} alt="Smiling doodle face" />
          </div>
        </div>
      </div>
    </main>
  );
}
