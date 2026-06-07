import { getSettings } from "@/lib/db";
import { User, ShieldCheck, Cpu, Leaf } from "lucide-react";

export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 pb-6">
      {/* Title */}
      <div>
        <h2 className="font-display font-black text-2xl text-foreground flex items-center gap-2">
          <User size={22} className="text-primary" />
          About Envision 3D
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Our story, material choice, and 3D printing craftsmanship.
        </p>
      </div>

      {/* Main Narrative card */}
      <section className="p-6 rounded-2xl glass border border-white/5 space-y-4">
        <h3 className="font-display font-extrabold text-base text-foreground">
          Our Philosophy
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {settings.about_text || "We build premium, custom-designed 3D printed planters, vases, lights, and modern home decor pieces."}
        </p>
      </section>

      {/* Process Columns */}
      <section className="space-y-4">
        <h3 className="font-display font-extrabold text-base text-foreground pl-1">
          How We Manufacture
        </h3>

        <div className="space-y-3">
          {/* Card 1 */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3.5 items-start">
            <Cpu className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">Precision FDM Printing</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Our designs are crafted layer-by-layer using custom-sliced toolpaths, creating unique fine textures that reflect ambient light.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3.5 items-start">
            <Leaf className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">Eco-Conscious Materials</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We print primarily using PLA (Polylactic Acid)—a biodegradable thermoplastic derived from renewable resources like corn starch. We offer wood-filled and stone-textured specialty filaments.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 bg-white/5 border border-white/5 rounded-2xl flex gap-3.5 items-start">
            <ShieldCheck className="text-primary flex-shrink-0 mt-0.5" size={20} />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">Individually Finished</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Each product is post-processed by hand to inspect print layers, test drainage fittings, and ensure structural stability.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
