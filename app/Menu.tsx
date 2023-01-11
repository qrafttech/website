import ContactUs from "./ContactUs";

export default function Menu() {
  return (
    <div className="flex items-center justify-between text-white">
      <span className="font-serif text-2xl font-extrabold">Qraft</span>
      <div className="flex items-center space-x-10">
        <span className="max-md:hidden">Services</span>
        <span className="max-md:hidden">Expertises</span>
        <span className="max-md:hidden">Équipe</span>
        <span className="max-md:hidden">Projets</span>
        <ContactUs className="px-3 py-2 text-sm max-md:rounded-xl md:px-4 md:py-3 md:text-base" />
      </div>
    </div>
  );
}
