"use client";

import { useEffect, useState } from "react";
import { getCurrentBatch } from "@/lib/storage";
import { ShoppingList } from "@/components/ShoppingList";
import type { Batch } from "@/lib/types";

export default function CoursesPage() {
  const [batch, setBatch] = useState<Batch | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBatch(getCurrentBatch());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!batch || !batch.validated) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl text-primary-500 tracking-tight">Liste de courses</h1>
        <div className="bg-primary-100 rounded-3xl p-8 text-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-10 mx-auto text-neutral-400">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <p className="text-neutral-500 font-sans">Aucune liste disponible.</p>
          <p className="text-sm text-neutral-400 font-sans">
            Validez un batch pour générer votre liste de courses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl text-primary-500 tracking-tight">Liste de courses</h1>
        <p className="mt-1 text-sm text-neutral-500 font-sans">
          {batch.recipes.length} recettes — {batch.preferences.numberOfPersons} personnes
        </p>
      </div>

      <ShoppingList recipes={batch.recipes} />
    </div>
  );
}
