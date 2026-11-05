"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, MapPin, MessageCircle, Phone } from "lucide-react";

import {
  MAIN_CONTACT_DISPLAY,
  MAIN_CONTACT_TEL,
  MAIN_CONTACT_WHATSAPP,
} from "@/lib/constants/contact";
import LeadCaptureModal from "@/src/LeadCapture/LeadCaptureModal";
import BookSiteVisitModal from "@/src/Properties/BookSiteVisitModal";

const money = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "Price on request";
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  return `₹${(amount / 100000).toFixed(2)} Lakh`;
};

const clean = (value, fallback) =>
  typeof value === "string" && value.trim() ? value.trim() : fallback;

export default function KohinoorAdLandingPage({ property }) {
  const [leadSource, setLeadSource] = useState(null);
  const [amenitiesExpanded, setAmenitiesExpanded] = useState(false);
  const [siteVisitOpen, setSiteVisitOpen] = useState(false);
  const projectName = clean(property?.projectName, "Kohinoor Avantara");
  const location = clean(property?.subLocality || property?.locality, "Wakad");
  const gallery = [property?.mainPropertyImage, ...(property?.imageGallery || [])]
    .filter((image) => typeof image === "string" && image.trim());
  const amenities = Array.isArray(property?.amenities) ? property.amenities : [];
  const plans = Array.isArray(property?.floorPlans) ? property.floorPlans : [];
  const projectRera =
    clean(property?.description, "").match(/\bPR\d{8,}\b/i)?.[0] ||
    (String(property?.reraRegistrationNumber || "").startsWith("PR")
      ? property.reraRegistrationNumber
      : null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setLeadSource("Automatic six-second popup"),
      6000,
    );

    return () => window.clearTimeout(timer);
  }, []);

  const residences = useMemo(() => {
    return ["2BHK", "3BHK"].map((key) => {
      const matching = plans.filter((plan) =>
        String(plan?.name || "").replace(/\s/g, "").toUpperCase().includes(key),
      );
      const areas = matching.map((plan) => Number(plan?.carpetArea)).filter(Boolean);
      const prices = matching.map((plan) => Number(plan?.price)).filter(Boolean);
      return {
        name: key.replace("BHK", " BHK"),
        image: matching[0]?.image,
        area: areas.length
          ? `${Math.min(...areas)}–${Math.max(...areas)} sq. ft.`
          : "Spacious residences",
        price: prices.length ? `From ${money(Math.min(...prices))}` : "Price on request",
      };
    });
  }, [plans]);

  const openLead = (source) => setLeadSource(source);
  const leadProps = {
    propertyId: property?.id || null,
    propertyTitle: property?.propertyTitle || projectName,
    propertyName: projectName,
    propertyLocation: `${location}, Pune`,
  };

  return (
    <div className="min-h-screen bg-[#f2efe7] text-[#18352f] [font-family:var(--font-sans)] [&_h1]:[font-family:var(--font-sans)] [&_h2]:[font-family:var(--font-sans)] [&_h3]:[font-family:var(--font-sans)]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#17352f]/95 text-white backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
          <a href="#top" className="text-sm font-bold uppercase tracking-[0.2em]" aria-label="Kohinoor Avantara home">
            Avantara · Wakad
          </a>
          <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex" aria-label="Landing page navigation">
            <a href="#project" className="hover:text-[#d8c79c]">The project</a>
            <a href="#residences" className="hover:text-[#d8c79c]">Residences</a>
            <a href="#amenities" className="hover:text-[#d8c79c]">Amenities</a>
            <a href="#location" className="hover:text-[#d8c79c]">Location</a>
          </nav>
          <button onClick={() => openLead("Header enquiry")} className="inline-flex items-center gap-2 rounded-full bg-[#d8c79c] px-5 py-2.5 text-sm font-bold text-[#17352f] transition hover:bg-white">
            Enquire now <ArrowUpRight size={16} />
          </button>
        </div>
      </header>

      <main id="top">
        <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-[#17352f] pt-18">
          {gallery[0] && <Image src={gallery[0]} alt={`${projectName} residential project in ${location}`} fill priority sizes="100vw" className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d2420]/95 via-[#0d2420]/65 to-black/15" />
          <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-32 text-white sm:pb-20 lg:px-8 lg:pb-24">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-[#e4d7b6]">Kohinoor Group · {location}, Pune</p>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Space for today.<br /><span className="text-[#e4d7b6]">A home for tomorrow.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">Premium 2 &amp; 3 BHK residences across 8.66 acres, thoughtfully planned for a connected life in Wakad.</p>
            <div className="mt-7 flex flex-wrap gap-2 text-sm font-semibold">
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2">2 &amp; 3 BHK</span>
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2">From ₹85.90 Lakh*</span>
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2">Possession 2032</span>
            </div>
            {projectRera && <p className="mt-4 text-xs font-semibold tracking-wide text-white/70">MahaRERA No. {projectRera} · RERA possession: March 2032</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => openLead("Hero price and floor plan")} className="inline-flex items-center gap-2 rounded-full bg-[#e4d7b6] px-6 py-3.5 font-bold text-[#17352f] hover:bg-white">Get price &amp; floor plans <ArrowUpRight size={18} /></button>
              <button type="button" onClick={() => setSiteVisitOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 font-bold text-white hover:bg-white/10">Book a site visit <ArrowUpRight size={18} /></button>
            </div>
          </div>
        </section>

        <section className="border-b border-[#17352f]/10 bg-[#e4d7b6]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#17352f]/15 px-5 py-7 text-center sm:grid-cols-4 lg:px-8">
            {[['8.66', 'Acres'], ['8', 'Towers'], ['2 & 3 BHK', 'Residences'], ['17+', 'Lifestyle amenities']].map(([value, label]) => <div key={label} className="px-3 py-2"><strong className="block text-2xl sm:text-3xl">{value}</strong><span className="mt-1 block text-xs font-bold uppercase tracking-widest text-[#17352f]/65">{label}</span></div>)}
          </div>
        </section>

        <section id="project" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 lg:px-8 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8b6d3d]">A considered address in Wakad</p>
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">More room to grow.<br /><span className="text-[#8b6d3d]">More reasons to belong.</span></h2>
            <div className="space-y-5 text-base leading-7 text-[#17352f]/75"><p>Kohinoor Avantara brings spacious residences, landscaped open spaces and everyday conveniences together near Shani Mandir Road, Dattwadi.</p><p>Designed across eight towers, the project offers large 2 and 3 BHK configurations for families looking at long-term living in West Pune.</p><button onClick={() => openLead("Project overview")} className="inline-flex items-center gap-2 border-b border-[#17352f] pb-1 font-bold text-[#17352f]">Request project details <ArrowUpRight size={17} /></button></div>
          </div>
        </section>

        <section id="residences" className="scroll-mt-24 bg-[#17352f] py-20 text-white lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#d8c79c]">The residences</p><h2 className="mt-5 text-4xl font-bold sm:text-5xl">Two configurations.<br /><span className="text-[#d8c79c]">One elevated outlook.</span></h2></div><p className="max-w-xl leading-7 text-white/70">Explore the available layouts and request the latest authorised price sheet, availability and payment plan.</p></div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {residences.map((residence, index) => <article key={residence.name} className="overflow-hidden rounded-2xl bg-[#f2efe7] text-[#17352f]"><div className="relative aspect-[4/3] bg-white">{residence.image ? <Image src={residence.image} alt={`${residence.name} floor plan at ${projectName}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-5" /> : <div className="grid h-full place-items-center">Official plan available on request</div>}</div><div className="flex items-end justify-between p-6"><div><span className="text-xs font-bold uppercase tracking-widest text-[#8b6d3d]">0{index + 1} / Residences</span><h3 className="mt-2 text-3xl font-bold">{residence.name}</h3><p className="mt-1 text-sm text-[#17352f]/65">{residence.area} · {residence.price}</p></div><button onClick={() => openLead(`${residence.name} floor plan`)} aria-label={`Request ${residence.name} details`} className="grid h-12 w-12 place-items-center rounded-full bg-[#17352f] text-white"><ArrowUpRight /></button></div></article>)}
            </div>
            <p className="mt-5 text-xs leading-5 text-white/55">Prices, areas and inventory are indicative and subject to current authorised sales information.</p>
          </div>
        </section>

        <section id="amenities" className="scroll-mt-24 py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8b6d3d]">Lifestyle at Avantara</p><h2 className="mt-5 text-4xl font-bold sm:text-5xl">Time well spent,<br /><span className="text-[#8b6d3d]">every day.</span></h2></div><p className="max-w-xl leading-7 text-[#17352f]/70">Fitness, leisure and community spaces designed around everyday wellbeing and meaningful downtime.</p></div>
            {gallery.length > 2 && <div className="mt-12 grid gap-5 md:grid-cols-2"><div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src={gallery[1]} alt={`${projectName} lifestyle amenity`} fill sizes="50vw" className="object-cover" /></div><div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src={gallery[2]} alt={`${projectName} sports amenity`} fill sizes="50vw" className="object-cover" /></div></div>}
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#17352f]/15 sm:grid-cols-3 lg:grid-cols-6">{amenities.slice(0, amenitiesExpanded ? amenities.length : 6).map((amenity, index) => <div key={amenity} className="bg-[#f8f6f0] p-5"><span className="text-xs font-bold text-[#8b6d3d]">{String(index + 1).padStart(2, '0')}</span><p className="mt-6 font-bold">{amenity}</p></div>)}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              {amenities.length > 6 && <button type="button" onClick={() => setAmenitiesExpanded((expanded) => !expanded)} className="inline-flex items-center gap-2 rounded-full border border-[#17352f]/25 px-6 py-3.5 font-bold text-[#17352f]">{amenitiesExpanded ? "Show less" : "Read more"} <ChevronDown size={18} className={amenitiesExpanded ? "rotate-180" : ""} /></button>}
              <button onClick={() => openLead("Amenities list")} className="inline-flex items-center gap-2 rounded-full bg-[#17352f] px-6 py-3.5 font-bold text-white">Request complete amenities <ArrowUpRight size={18} /></button>
            </div>
          </div>
        </section>

        <section id="location" className="scroll-mt-24 bg-[#ded5bf] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#765a31]">Your neighbourhood</p><h2 className="mt-5 text-4xl font-bold sm:text-5xl">Wakad, connected<br /><span className="text-[#765a31]">to everyday life.</span></h2></div>
              <p className="leading-7 text-[#17352f]/70">Near Shani Mandir Road in Dattwadi, with practical access to the Mumbai–Bengaluru Highway, Bhumkar Chowk and Hinjawadi’s employment corridor.</p>
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">{[['1.5 km', 'Mumbai–Bengaluru Highway'], ['2 km', 'Bhumkar Chowk'], ['4 km', 'D-Mart']].map(([distance, place], i) => <article key={place} className="rounded-2xl border border-[#17352f]/15 bg-[#f2efe7] p-6"><span className="text-xs font-bold text-[#765a31]">0{i + 1}</span><strong className="mt-8 block text-3xl">{distance}</strong><p className="mt-2 text-sm text-[#17352f]/65">{place}</p></article>)}</div>
            <div className="mt-8 flex items-center gap-2 text-sm text-[#17352f]/70"><MapPin size={18} /> Near Shani Mandir Road, Dattwadi, Wakad, Pune</div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-[#17352f]/15 bg-[#f2efe7] p-2 shadow-sm">
              <iframe
                title="Kohinoor Avantara location map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent("Near Shani Mandir Road, Dattwadi, Wakad, Pune")}&z=14&output=embed`}
                className="h-80 w-full rounded-xl border-0 sm:h-96"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:py-28">
          <div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8b6d3d]">A closer look</p><h2 className="mt-5 text-4xl font-bold sm:text-5xl">Begin the<br /><span className="text-[#8b6d3d]">conversation.</span></h2><p className="mt-5 max-w-md leading-7 text-[#17352f]/70">Ask for current pricing, official floor plans, payment schedules and available inventory at Kohinoor Avantara.</p><button onClick={() => openLead("Final enquiry")} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17352f] px-6 py-3.5 font-bold text-white">Request details <ArrowUpRight size={18} /></button></div>{gallery[3] && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src={gallery[3]} alt={`${projectName} project gallery`} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" /></div>}
        </section>

        <section className="bg-white py-20"><div className="mx-auto max-w-4xl px-5"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8b6d3d]">Good to know</p><h2 className="mt-5 text-4xl font-bold">Questions, answered.</h2><div className="mt-10 divide-y divide-[#17352f]/15">{[
          ["What configurations are available?", "Kohinoor Avantara offers 2 and 3 BHK residences. Current inventory should be confirmed with the sales team."],
          ["What is the starting price?", "Indicative all-inclusive pricing starts from ₹85.90 lakh. Request the latest authorised price sheet before making a decision."],
          ["When is possession expected?", "The current RERA possession timeline is March 2032. Please verify the latest schedule and registration details."],
          ["Can I schedule a site visit?", "Yes. Submit an enquiry and our property advisor will coordinate a convenient guided visit."],
        ].map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-bold">{question}<span className="text-2xl group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-3 leading-7 text-[#17352f]/65">{answer}</p></details>)}</div></div></section>
      </main>

      <footer className="bg-[#102823] px-5 py-12 text-white"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3"><div><div className="inline-flex rounded-xl bg-white p-3"><Image src="/aibricks-logo.webp" alt="AI Bricks Realtors" width={150} height={114} className="h-20 w-auto object-contain" /></div><p className="mt-4 text-sm leading-6 text-white/60">Independent real estate advisory for informed property decisions.</p></div><div><p className="text-xs font-bold uppercase tracking-widest text-[#d8c79c]">Project</p><p className="mt-3 font-bold">{projectName}</p><p className="text-sm text-white/60">2 &amp; 3 BHK residences · {location}, Pune</p>{projectRera && <p className="mt-2 text-xs text-white/50">MahaRERA: {projectRera} · Possession: March 2032</p>}</div><div><p className="text-xs font-bold uppercase tracking-widest text-[#d8c79c]">Contact</p><a href={MAIN_CONTACT_TEL} className="mt-3 block font-bold">{MAIN_CONTACT_DISPLAY}</a><button onClick={() => openLead("Footer enquiry")} className="mt-2 text-sm text-white/70">Request a callback ↗</button></div></div><div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-xs leading-5 text-white/45">Project information, pricing, availability and imagery are indicative and must be verified from authorised documents. AI Bricks Realtors is a real estate advisory platform.</div></footer>

      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/20 bg-[#17352f] p-2 text-sm font-bold text-white shadow-2xl lg:hidden"><a href={`${MAIN_CONTACT_WHATSAPP}?text=${encodeURIComponent(`Hello, I would like details of ${projectName}.`)}`} className="flex items-center justify-center gap-2 rounded-lg px-3 py-3"><MessageCircle size={18} /> WhatsApp</a><button onClick={() => openLead("Mobile sticky enquiry")} className="flex items-center justify-center gap-2 rounded-lg bg-[#d8c79c] px-3 py-3 text-[#17352f]"><Phone size={18} /> Enquire now</button></div>

      <LeadCaptureModal open={Boolean(leadSource)} onClose={() => setLeadSource(null)} title={`Enquire about ${projectName}`} subtitle="Share your details to receive current pricing, floor plans and availability." submitLabel="Request details" messagePrefix={`[Kohinoor ad landing page] CTA: ${leadSource || "General enquiry"}`} {...leadProps} />
      <BookSiteVisitModal isOpen={siteVisitOpen} onClose={() => setSiteVisitOpen(false)} property={property} />
    </div>
  );
}
