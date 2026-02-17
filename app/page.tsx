"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCurrentBatch, getFavorites, getHistory } from "@/lib/storage";
import DailyFun from "@/components/DailyFun";

export default function HomePage() {
  const [hasBatch, setHasBatch] = useState(false);
  const [batchCount, setBatchCount] = useState(0);
  const [batchValidated, setBatchValidated] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [cookedCount, setCookedCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const batch = getCurrentBatch();
    if (batch && batch.recipes.length > 0) {
      setHasBatch(true);
      setBatchCount(batch.recipes.length);
      setBatchValidated(batch.validated);
    }
    setFavCount(getFavorites().length);
    setCookedCount(getHistory().length);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-4xl text-primary-500">
          BONJOUR PAPA !
        </h1>
        <p className="text-lg font-medium opacity-80">
          Qu&apos;est-ce qu&apos;on mange cette semaine ?
        </p>
      </div>

      {/* Action Principale — Style Encart Promo */}
      <Link
        href="/generate"
        className="block relative overflow-hidden bg-accent-yellow text-primary-700 rounded-3xl p-6 shadow-card transform transition hover:-translate-y-1 active:translate-y-0"
      >
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl mb-1">GÉNÉRER MON MENU</h2>
            <p className="font-medium opacity-90">C&apos;est parti pour le batch !</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
        </div>
        <div className="absolute -right-6 -bottom-6 size-32 bg-white/10 rounded-full" />
      </Link>

      {/* Batch en cours */}
      {hasBatch && (
        <Link
          href="/batch"
          className="block bg-white rounded-3xl p-5 shadow-card hover:shadow-card-hover transition"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-5 text-primary-500">
                  <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-primary-500">Mon batch en cours</span>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {batchCount} recette{batchCount > 1 ? "s" : ""}
                  {batchValidated && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-season-100 px-1.5 py-0.5 text-[10px] font-medium text-season-700">
                      Validé
                    </span>
                  )}
                </p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-neutral-400">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </Link>
      )}

      {/* Accès Rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/courses" className="group bg-white p-5 rounded-3xl shadow-card hover:shadow-card-hover transition">
          <div className="size-10 bg-primary-100 text-primary-500 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-500 group-hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">Courses</h3>
        </Link>

        <Link href="/favoris" className="group bg-white p-5 rounded-3xl shadow-card hover:shadow-card-hover transition">
          <div className="size-10 bg-primary-100 text-primary-500 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-500 group-hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">Favoris</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            {favCount > 0 ? `${favCount} recette${favCount > 1 ? "s" : ""}` : "Aucun favori"}
          </p>
        </Link>

        <Link href="/historique" className="group bg-white p-5 rounded-3xl shadow-card hover:shadow-card-hover transition">
          <div className="size-10 bg-primary-100 text-primary-500 rounded-xl flex items-center justify-center mb-3 group-hover:bg-primary-500 group-hover:text-white transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold">Historique</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            {cookedCount > 0 ? `${cookedCount} recette${cookedCount > 1 ? "s" : ""} cuisinée${cookedCount > 1 ? "s" : ""}` : "Aucune recette"}
          </p>
        </Link>
      </div>

      {/* Daily Fun */}
      <DailyFun />
    </div>
  );
}
