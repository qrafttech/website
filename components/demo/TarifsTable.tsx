import { formules } from "../../lib/demo/tarifs";

export default function TarifsTable() {
  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr>
          <th className="py-2">Formule</th>
          <th className="py-2">Cible</th>
          <th className="py-2">Engagement</th>
          <th className="py-2">Prix</th>
        </tr>
      </thead>
      <tbody>
        {formules.map((formule) => (
          <tr key={formule.id} className="border-t border-neutral-200">
            <td className="py-2 font-medium">{formule.nom}</td>
            <td className="py-2">{formule.cible}</td>
            <td className="py-2">{formule.engagement}</td>
            <td className="py-2">{formule.prix}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
