import { SetupForm } from "@/components/SetupForm";

export default function GeneratePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl text-primary-500 tracking-tight">
          Nouveau batch
        </h1>
        <p className="mt-1 text-neutral-500 font-sans">
          Configurez vos préférences et générez vos repas de la semaine.
        </p>
      </div>
      <SetupForm />
    </div>
  );
}
