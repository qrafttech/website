import Image from "next/image";

import smilingFace from "../public/images/smiling-face.svg";
import heroBackground from "../public/images/hero-background.png";

export default function Home() {
  return (
    <main>
      <div>
        <div className="absolute inset-x-0 top-0 -z-10">
          <Image
            src={heroBackground}
            alt="Blue and pink linear gradient Hero background"
            placeholder="blur"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold underline">
            La seule agence web dont vous avez besoin
          </h1>
          <p>
            Qraft est une agence de développement web qui vous accompagne dans
            la construction de votre application, API ou infrastructure
            technique.
          </p>
          <p>
            Notre équipe composée d&quot;experts de plus de 10 années
            d&quot;expérience met l&quot;accent sur la qualité et la performance
            de votre service, dans la durée.
          </p>
          <button>Nous contacter</button>
        </div>
        <div>
          <Image src={smilingFace} alt="Smiling doodle face" />
        </div>
      </div>
    </main>
  );
}
