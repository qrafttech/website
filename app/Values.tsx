import Image from "next/image";

import singingFrogWithCloud from "../public/images/singing-frog-with-cloud.svg";

export default function Values() {
  return (
    <div className="flex items-end">
      <Image
        src={singingFrogWithCloud}
        alt="Frog with a crown singing a binary song"
        className="flex-1 p-4"
      />
      <div className="flex-1">
        <h2 className="bg-gradient-to-r from-[#2650e1] to-[#1079f4] bg-clip-text py-4 font-serif text-5xl font-bold text-transparent">
          Traversons ensemble l&#39;épreuve du temps.
        </h2>
        <p className="py-6">
          Nous avons pour vocation de vous garantir une application qui
          fonctionne non seulement à un instant T, mais qui peut être améliorée
          et étendue avec justesse au fur et à mesure que votre produit évolue.
          Nous sommes fier du code que nous livrons, aujourd&#39;hui comme dans
          3 ans.
        </p>
      </div>
    </div>
  );
}
