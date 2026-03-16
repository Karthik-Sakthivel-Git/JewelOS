import Link from "next/link";
import {
  Scale,
  Handshake,
  ShieldCheck,
  Users,
  CheckCircle2,
  ArrowRight,
  Gem,
  BarChart3,
  Smartphone,
  Clock,
  IndianRupee,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* ─── Navbar ─────────────────────────────────────────────── */}
      <header className="fixed top-0 z-50 w-full border-b border-gold-400/20 bg-maroon-950/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Gem className="h-7 w-7 text-gold-400" />
            <span className="text-xl font-bold tracking-tight text-white">
              Jewel<span className="text-gold-400">OS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {["Features", "Pricing", "About"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-cream-50/80 transition-colors hover:text-gold-400"
              >
                {item}
              </a>
            ))}
            <Link href="/login" className="btn-gold rounded-full px-6 py-2 text-sm">
              Sign In
            </Link>
          </nav>

          <Link
            href="/login"
            className="btn-gold rounded-full px-5 py-2 text-sm md:hidden"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* ─── Hero Section ───────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-maroon-950 pt-16">
        <div className="mandala-pattern corner-ornament-tl corner-ornament-br relative">
          {/* Faint paisley texture overlay */}
          <div className="paisley-bg absolute inset-0 opacity-30" />

          <div className="relative mx-auto max-w-7xl px-4 pt-4 pb-10 sm:px-6 sm:pt-4 sm:pb-14 lg:px-8 lg:pt-4 lg:pb-20">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left content */}
              <div className="max-w-xl">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-medium text-gold-400">
                  <Star className="h-3.5 w-3.5 fill-gold-400" />
                  Built for Indian MSME Jewellers
                </div>

                <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-cream-50 sm:text-5xl lg:text-6xl">
                  Transform Your{" "}
                  <span className="text-gold-400">Heritage.</span>
                  <br />
                  Scale Your{" "}
                  <span className="text-gold-400">Future.</span>
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-cream-50/70">
                  The end-to-end Jewellery SaaS ERP, empowering MSMEs from
                  procurement to point-of-sale. Manage inventory, billing, GST
                  compliance, and customer relationships — all in one platform.
                </p>

                <ul className="mt-8 space-y-3">
                  {[
                    "Inventory & Catalogue Management",
                    "B2B Procurement & Supplier Ledger",
                    "Secure Locker Management",
                    "GST-Compliant POS Billing",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-gold-400" />
                      <span className="text-sm font-medium text-cream-50/90">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/login"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-8 py-3.5 text-sm font-semibold text-maroon-950 shadow-lg shadow-gold-400/20 transition-all hover:bg-gold-300 hover:shadow-gold-400/30"
                  >
                    Request a Personalized Demo
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-cream-50/20 px-8 py-3.5 text-sm font-semibold text-cream-50 transition-colors hover:border-gold-400/50 hover:text-gold-400"
                  >
                    Explore Features
                  </a>
                </div>
              </div>

              {/* Right — Dashboard mockup */}
              <div className="relative hidden lg:block">
                <div className="relative mx-auto w-full max-w-lg">
                  {/* Glow behind the card */}
                  <div className="absolute -inset-4 rounded-3xl bg-gold-400/10 blur-3xl" />

                  {/* Dashboard preview card */}
                  <div className="relative rounded-2xl border border-gold-400/20 bg-maroon-900/80 p-6 shadow-2xl backdrop-blur">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400/60" />
                      <div className="h-3 w-3 rounded-full bg-yellow-400/60" />
                      <div className="h-3 w-3 rounded-full bg-green-400/60" />
                      <span className="ml-2 text-xs text-cream-50/40">
                        JewelOS Dashboard
                      </span>
                    </div>

                    {/* Mini stat cards */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Today's Sales", value: "₹4,82,500", trend: "+12%" },
                        { label: "Gold Rate 22K", value: "₹6,450/g", trend: "+0.8%" },
                        { label: "Active Stock", value: "1,247 pcs", trend: "3 branches" },
                        { label: "Customers", value: "2,890", trend: "+45 this week" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-lg border border-gold-400/10 bg-maroon-950/60 p-3"
                        >
                          <p className="text-[10px] text-cream-50/50">
                            {stat.label}
                          </p>
                          <p className="mt-1 text-base font-bold text-cream-50">
                            {stat.value}
                          </p>
                          <p className="mt-0.5 text-[10px] text-gold-400">
                            {stat.trend}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Mini chart placeholder */}
                    <div className="mt-4 rounded-lg border border-gold-400/10 bg-maroon-950/60 p-3">
                      <p className="mb-2 text-[10px] text-cream-50/50">
                        Weekly Revenue
                      </p>
                      <div className="flex items-end gap-1.5 h-16">
                        {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t bg-gradient-to-t from-gold-400/60 to-gold-400"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gold divider */}
          <div className="gold-divider" />
        </div>
      </section>

      {/* ─── Feature Icons Strip ────────────────────────────────── */}
      <section className="relative border-b border-gold-400/10 bg-cream-50 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { icon: Scale, label: "Inventory", sub: "Weight & MRP tracking" },
              { icon: Handshake, label: "B2B Procurement", sub: "Supplier ledger & GRN" },
              { icon: ShieldCheck, label: "Secure Locker", sub: "Vault management" },
              { icon: Users, label: "CRM", sub: "Customer 360° view" },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-400/20 bg-white shadow-sm">
                  <item.icon className="h-7 w-7 text-maroon-800" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-maroon-900">
                  {item.label}
                </h3>
                <p className="mt-1 text-xs text-gray-500">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features Detail Section ────────────────────────────── */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gold-400">
              Everything You Need
            </span>
            <h2 className="mt-3 text-3xl font-bold text-maroon-900 sm:text-4xl">
              Built for the way jewellers work
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              From weighing gold to filing GST returns — JewelOS handles the
              entire workflow so you can focus on your craft.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Scale,
                title: "Smart Inventory",
                desc: "Dual pricing engine — WEIGHT_BASED for metal, FIXED_MRP for gifts. RFID & barcode support. Real-time stock across branches.",
              },
              {
                icon: IndianRupee,
                title: "GST-Ready Billing",
                desc: "Per-line HSN codes, auto CGST/SGST split, mixed-cart invoicing. CA-verified GSTR-1 JSON export ready for filing.",
              },
              {
                icon: Handshake,
                title: "Procurement & GRN",
                desc: "Purchase orders with outright, consignment & advance booking. Goods received notes with weight verification.",
              },
              {
                icon: BarChart3,
                title: "Live Rate Board",
                desc: "Update gold/silver/platinum rates daily. All weight-based prices auto-calculate from the live rate per gram.",
              },
              {
                icon: Users,
                title: "Customer 360°",
                desc: "Phone-first CRM with KYC, loyalty tiers, purchase history, and anniversary reminders. Fuzzy name search built in.",
              },
              {
                icon: Gem,
                title: "Savings Schemes",
                desc: "11+1 fixed, daily chit collection, and flexible plans. Maturity alerts and seamless POS redemption as bill credit.",
              },
              {
                icon: ShieldCheck,
                title: "Vault & Locker",
                desc: "Track safe lockers, pledged items, and gold loan inventory. Complete custody chain with photo documentation.",
              },
              {
                icon: Smartphone,
                title: "Mobile-First POS",
                desc: "Tablet-optimized point-of-sale with offline mode. Works without internet — syncs when you reconnect.",
              },
              {
                icon: Clock,
                title: "Double-Entry Books",
                desc: "Auto-journal every transaction. Day book with open/close workflow. Pre-seeded jewellery chart of accounts.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-100 bg-gray-50/50 p-6 transition-all hover:border-gold-400/30 hover:bg-white hover:shadow-lg hover:shadow-gold-400/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-maroon-800 text-white transition-colors group-hover:bg-gold-400 group-hover:text-maroon-900">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-maroon-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Social Proof / Stats ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-maroon-950 py-20">
        <div className="mandala-pattern absolute inset-0" />
        <div className="paisley-bg absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-cream-50 sm:text-4xl">
              Designed for Indian <span className="text-gold-400">Jewellery</span> Business
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream-50/60">
              Every feature is purpose-built for the unique workflows, GST rules,
              and trust-based relationships of Indian jewellers.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { value: "₹3% + 18%", label: "Mixed GST rates handled" },
              { value: "22K / 24K", label: "Multi-purity support" },
              { value: "100%", label: "Offline POS capability" },
              { value: "GSTR-1", label: "JSON export for filing" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-gold-400 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs text-cream-50/50 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ────────────────────────────────────────── */}
      <section className="relative bg-cream-50 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Gem className="mx-auto h-10 w-10 text-gold-400" />
          <h2 className="mt-6 text-3xl font-bold text-maroon-900 sm:text-4xl">
            Ready to modernize your jewellery store?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-gray-500">
            Join forward-thinking MSME jewellers who are transforming their
            operations with JewelOS. Start with a free personalized demo.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-full bg-maroon-800 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-maroon-700 hover:shadow-xl"
            >
              Request a Personalized Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-maroon-800 hover:text-gold-500"
            >
              or explore features →
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-gold-400/10 bg-maroon-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <Gem className="h-5 w-5 text-gold-400" />
              <span className="text-lg font-bold text-white">
                Jewel<span className="text-gold-400">OS</span>
              </span>
            </div>

            <nav className="flex gap-8">
              {["Features", "Pricing", "About", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-cream-50/50 transition-colors hover:text-gold-400"
                >
                  {item}
                </a>
              ))}
            </nav>

            <p className="text-xs text-cream-50/30">
              © {new Date().getFullYear()} JewelOS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
