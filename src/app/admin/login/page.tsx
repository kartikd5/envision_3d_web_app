"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions";
import { Loader2, KeyRound } from "lucide-react";
import Logo from "@/components/Logo";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(null, formData);
      if (res.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(res.error || "Invalid credentials.");
        setLoading(false);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-foreground flex items-center justify-center p-4">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.03),transparent_60%)] pointer-events-none" />

      <div className="w-full max-w-sm glass rounded-3xl p-8 border border-white/5 shadow-2xl relative z-10 space-y-6">
        {/* Logo Header */}
        <div className="text-center space-y-2">
          <Logo className="w-14 h-14 mx-auto mb-2" />
          <h1 className="font-display font-black text-xl text-foreground">
            Envision 3D Admin
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to manage catalog, settings, and media.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@envision3d.com"
              className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest font-mono">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#161D30]/60 border border-white/10 rounded-xl text-sm text-foreground focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/95 text-black font-display font-bold py-3.5 rounded-xl text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-primary/10 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <KeyRound size={14} />
                Access Dashboard
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
