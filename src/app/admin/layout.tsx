"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && !isLoginPage) router.push("/admin/login");
      setAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && !isLoginPage) router.push("/admin/login");
    else setAuthenticated(!!session);
    setChecking(false);
  }

  if (isLoginPage) return <>{children}</>;
  if (checking) return <div className="min-h-screen bg-cinza-claro flex items-center justify-center"><p className="text-cinza-medio">Carregando...</p></div>;
  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-cinza-claro">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4 overflow-x-auto">
            <Link href="/admin" className="font-display text-lg font-bold text-cinza-escuro shrink-0">Painel</Link>
            <nav className="flex items-center gap-3">
              {[
                { href: "/admin", label: "Dashboard" },
                { href: "/admin/imoveis/novo", label: "Novo Imóvel" },
                { href: "/admin/leads", label: "Leads" },
                { href: "/admin/configuracoes", label: "Config" },
                { href: "/", label: "Ver Site →", target: "_blank" },
              ].map((link) => (
                <Link key={link.label} href={link.href} target={link.target as string | undefined}
                  className={`text-sm shrink-0 transition-colors ${pathname === link.href ? "text-laranja font-medium" : "text-cinza-medio hover:text-laranja"}`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/admin/login"); }}
            className="text-sm text-cinza-medio hover:text-red-600 transition-colors shrink-0">Sair</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">{children}</main>
    </div>
  );
}
