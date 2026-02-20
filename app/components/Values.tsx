import Image from "next/image";

import singingFrogWithCloudDesktop from "../../public/images/singing-frog-with-cloud-desktop.svg";
import singingFrogWithCloudMobile from "../../public/images/singing-frog-with-cloud-mobile.svg";
import singingFrog from "../../public/images/singing-frog.svg";
import rainMovingCloud from "../../public/images/rain-moving-cloud.svg";
import underline from "../../public/images/underline.svg";
import SectionTitle from "../../components/SectionTitle";
import Value from "./Value";

export default function Values() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end">
        <div className="p-4">
          <Image
            src={rainMovingCloud}
            alt="A rainy cloud"
            className="animate-slide-in"
          />
          <Image
            src={singingFrog}
            alt="Frog with a crown singing a binary song"
          />
        </div>
        <div className="flex-1">
          <SectionTitle className="from-[#2650e1] to-[#1079f4] py-4">
            Traversons ensemble l&#39;épreuve du temps.
          </SectionTitle>
          <p className="py-6">
            Nous avons pour vocation de vous garantir une application qui
            fonctionne non seulement à un instant T, mais qui peut être
            améliorée et étendue avec la même agilité au fur et à mesure que
            votre produit évolue. Nous sommes fiers du code que nous livrons,
            aujourd&#39;hui comme dans 3 ans.
          </p>
        </div>
      </div>
      <div className="relative mt-16 mb-4">
        <Image
          src={underline}
          alt="Handrawing of a strike through to mimic an underline"
          className="absolute -bottom-4"
        />
        <h3 className="pb-6 font-serif text-4xl font-bold text-[#0074dd]">
          Nos plus-values
        </h3>
      </div>
      <div className="mt-8 mb-16 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
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
