import { SiteHeader } from "@/components/site/site-header";
import { ProfileHeader } from "@/components/site/profile-header";
import { Hero } from "@/components/site/hero";
import { ProofMetrics } from "@/components/site/proof-metrics";
import { ShippedAt } from "@/components/site/shipped-at";
import { FeaturedApps } from "@/components/site/featured-apps";
import { WhyHire } from "@/components/site/why-hire";
import { PersonalNote } from "@/components/site/personal-note";
import { ClosingCta } from "@/components/site/closing-cta";
import { SiteFooter } from "@/components/site/site-footer";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <ProfileHeader />
      <main>
        <Hero />
        <ProofMetrics />
        <ShippedAt />
        <FeaturedApps />
        <WhyHire />
        <PersonalNote />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
