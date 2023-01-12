import ContactUs from "./ContactUs";

export default function Menu() {
  return (
    <div className="flex items-center justify-between text-white">
      <span className="font-serif text-2xl font-extrabold">Qraft</span>
      <div className="flex items-center space-x-10">
        <a href="#services" className="max-md:hidden">
          Services
        </a>
        <a href="#values" className="max-md:hidden">
          Valeurs
        </a>
        <a href="#stack" className="max-md:hidden">
          Stack
        </a>
        <a href="#team" className="max-md:hidden">
          Équipe
        </a>
        <ContactUs className="px-3 py-2 text-sm max-md:rounded-xl md:px-4 md:py-3 md:text-base" />
      </div>
    </div>
  );
}
