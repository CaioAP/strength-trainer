"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubPageHeaderProps {
  category: string;
  title: string;
  rightContent?: React.ReactNode;
  backHref?: string;
}

export default function SubPageHeader({ category, title, rightContent, backHref }: SubPageHeaderProps): React.JSX.Element {
  const router = useRouter();

  const backControl = backHref ? (
    <Link
      href={backHref}
      className="p-1 hover:bg-brand-secondary rounded transition-colors"
      aria-label="Go back"
    >
      <ChevronLeft className="w-5 h-5 text-text-subtle" />
    </Link>
  ) : (
    <button
      onClick={() => router.back()}
      className="p-1 hover:bg-brand-secondary rounded transition-colors"
      aria-label="Go back"
    >
      <ChevronLeft className="w-5 h-5 text-text-subtle" />
    </button>
  );

  return (
    <header className="p-4 flex items-center justify-between border-b border-gray-800 bg-brand-surface sticky top-0 z-50">
      <div className="flex items-center gap-2">
        {backControl}
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-primary">{category}</span>
          <span className="text-sm font-black uppercase tracking-tight text-white italic">{title}</span>
        </div>
      </div>
      {rightContent && <div>{rightContent}</div>}
    </header>
  );
}
