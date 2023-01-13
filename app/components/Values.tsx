import Image from "next/image";

import singingFrogWithCloudDesktop from "../../public/images/singing-frog-with-cloud-desktop.svg";
import singingFrogWithCloudMobile from "../../public/images/singing-frog-with-cloud-mobile.svg";
import underline from "../../public/images/underline.svg";
import Value from "./Value";

export default function Values() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end">
        <div>
          <Image
            src={singingFrogWithCloudDesktop}
            alt="Frog with a crown singing a binary song"
            className="flex-1 p-4 max-md:hidden"
          />
          <Image
            src={singingFrogWithCloudMobile}
            alt="Frog with a crown singing a binary song"
            className="flex-1 p-4 md:hidden"
          />
        </div>
        <div className="flex-1">
          <h2 className="bg-gradient-to-r from-[#2650e1] to-[#1079f4] bg-clip-text py-4 font-serif text-5xl font-bold text-transparent">
            Traversons ensemble l&#39;épreuve du temps.
          </h2>
          <p className="py-6">
            Nous avons pour vocation de vous garantir une application qui
            fonctionne non seulement à un instant T, mais qui peut être
            améliorée et étendue avec la même agilité au fur et à mesure que
            votre produit évolue. Nous sommes fiers du code que nous livrons,
            aujourd&#39;hui comme dans 3 ans.
          </p>
        </div>
      </div>
      <div className="relative my-8">
        <Image
          src={underline}
          alt="Handrawing of a strike through to mimic an underline"
          className="absolute -bottom-4"
        />
        <h3 className="p-8 font-serif text-4xl font-bold text-[#0074dd]">
          Nos plus-values
        </h3>
      </div>
      <div className="grid grid-cols-1 py-16 sm:grid-cols-2 md:grid-cols-4">
        <Value
          title="Expertise"
          content="Avec plus de 10 ans d&#39;expérience, nous connaissons les
            pièges d&#39;un projet digital, les effets de mode,
            les raccourcis fiables et ceux à éviter. Nous aimons partager notre expérience avec vous, c'est ce qui nous fait vibrer."
        />
        <Value
          title="Honnêteté"
          content="Zéro bullshit. Nous prônons la transparence, entre Qrafters et avec nos clients,
          pour avancer tous dans le même sens. Nous cultivons une politique de l&#39;écrit pour
          que chacun puisse suivre l&#39;avancement du projet au grand jour."
        />
        <Value
          title="Robustesse"
          content="Nous mettons en place des méthodes de prévention (code reviews,
            tests unitaires, déploiement continu, migrations réversibles,
            monitoring...) et de remédiation rapide en cas de pépin."
        />
        <Value
          title="Performance"
          content="Nous apportons la solution la plus simple à un problème donné, en
          utilisant les technologies les plus fiables et rapides, sans
          artifices inutiles. Les détails sont importants&nbsp;: vitesse et qualité sont étroitement liés."
        />
      </div>
    </div>
  );
}
