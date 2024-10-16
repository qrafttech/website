import Animation from "../../components/Animation.client";

import ContactUs from "./ContactUs";

export default function Cover() {
  return (
    <div className="space-between flex flex-col md:h-5/6">
      <div className="flex flex-col-reverse pt-20 md:flex-row md:pt-52">
        <div className="flex flex-[6_6_0%] flex-col justify-center">
          <h1 className="font-serif text-3xl font-bold text-white md:text-5xl lg:text-6xl">
            Construisons ensemble
            <br />
            <span className="bg-gradient-to-r from-[#d582fc] to-[#95b2fd] bg-clip-text text-transparent opacity-90">
              des applications de qualité
            </span>
          </h1>

          <div className="lg:text-lg">
            <p className="py-6 text-white/70">
              Qraft est une équipe{" "}
              <strong className="text-white">
                d&#39;expert.e.s techniques
              </strong>{" "}
              qui vous accompagnent dans la construction de votre application
              web, mobile, API ou infrastructure.
            </p>
            <p className="pb-12 text-white/70">
              Nos développeur.euse.s de plus de{" "}
              <strong className="text-white">10 années d&#39;expérience</strong>{" "}
              mettent l&#39;accent sur la{" "}
              <strong className="text-white">qualité</strong> et la{" "}
              <strong className="text-white">performance</strong> de votre
              service, <strong className="text-white">dans la durée.</strong>
            </p>
          </div>
          <div className="max-md:hidden">
            <ContactUs className="px-6 py-4 text-lg" />
          </div>
        </div>
        <div className="flex flex-[4_4_0%] justify-center">
          <div className="w-5/6 sm:max-md:h-72 max-sm:h-64 md:pb-32">
            <Animation src="animations/laughing-smile.riv" />
          </div>
        </div>
      </div>
    </div>
  );
}
