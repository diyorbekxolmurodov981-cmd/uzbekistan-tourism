'use client';

import React, { useState, useMemo } from 'react';
import { translations, Lang } from '@/lib/i18n';
import { calculatePrice, Currency } from '@/lib/pricing';
import { MapPin, Compass, Sparkles, CheckCircle2, X } from 'lucide-react';

const SAMPLE_TOURS = [
  {
    id: 'tour-silk-road-classic',
    type: 'inbound',
    style: 'historical',
    destination: 'Samarkand ? Bukhara ? Khiva',
    title: {
      en: 'Golden Silk Road Expedition (7 Days)',
      uz: 'Oltin Buyuk Ipak Yo?li Ekspeditsiyasi (7 kun)',
      ru: '??????? ?????????? ?? ????????? ???? (7 ????)',
    },
    days: 7,
    basePrice: 680,
    baseCurrency: 'USD' as Currency,
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000',
  },
  {
    id: 'tour-yurt-aydarkul',
    type: 'inbound',
    style: 'desert_yurt',
    destination: 'Kyzylkum ? Aydarkul ? Nurata',
    title: {
      en: 'Kyzylkum Yurt Camp & Nurata Trekking (3 Days)',
      uz: 'Qizilqum O?tov Lageri va Nurota Trekingi (3 kun)',
      ru: '??????? ?????? ???????? ? ???????? ? ?????? (3 ???)',
    },
    days: 3,
    basePrice: 290,
    baseCurrency: 'USD' as Currency,
    badge: 'Eco-Camp',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000',
  },
  {
    id: 'tour-zaamin-weekend',
    type: 'domestic',
    style: 'mountain_eco',
    destination: 'Zaamin (Zomin)',
    title: {
      en: 'Zaamin National Park & Glass Bridge Weekend',
      uz: 'Zomin Milliy Bog?i va Shisha Ko?prik (Dam olish kuni)',
      ru: '?????????? ???????????? ???? ? ?????????? ????',
    },
    days: 2,
    basePrice: 650000,
    baseCurrency: 'UZS' as Currency,
    badge: 'Weekend Trip',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
  },
  {
    id: 'tour-chimgan-amirsoy',
    type: 'domestic',
    style: 'mountain_eco',
    destination: 'Chimgan ? Amirsoy ? Charvak',
    title: {
      en: 'Amirsoy Alpine Resort & Charvak Lake Getaway',
      uz: 'Amirsoy Tog? Kurorti va Chorvoq Sayohati',
      ru: '?????? ?????? ??????? ? ????? ??????',
    },
    days: 1,
    basePrice: 380000,
    baseCurrency: 'UZS' as Currency,
    badge: 'Family Choice',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
  },
  {
    id: 'tour-aral-expedition',
    type: 'inbound',
    style: 'desert_yurt',
    destination: 'Aral Sea ? Moynaq ? Nukus',
    title: {
      en: 'Aral Sea & Ustyurt Canyons 4x4 Expedition',
      uz: 'Orol Dengizi va Ustyurt Kanyonlariga 4x4 Ekspeditsiya',
      ru: '?????????? 4x4 ?? ????????? ???? ? ??????? ???????',
    },
    days: 3,
    basePrice: 440,
    baseCurrency: 'USD' as Currency,
    badge: 'Adventure',
    image: 'https://images.unsplash.com/photo-1542401886-65d6c61db217?q=80&w=1000',
  },
  {
    id: 'tour-fergana-craft',
    type: 'both',
    style: 'craft_gastronomy',
    destination: 'Fergana Valley (Rishtan ? Margilan)',
    title: {
      en: 'Silk Weaving & Rishtan Ceramics Heritage Tour',
      uz: 'Marg?ilon Ipakchiligi va Rishton Kulolchiligi Turi',
      ru: '??? ???????: ???? ????????? ? ???????? ???????',
    },
    days: 2,
    basePrice: 185,
    baseCurrency: 'USD' as Currency,
    badge: 'Cultural',
    image: 'https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1000',
  },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('uz');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [segment, setSegment] = useState<'inbound' | 'domestic'>('inbound');
  const [selectedStyle, setSelectedStyle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookingTour, setBookingTour] = useState<(typeof SAMPLE_TOURS)[0] | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', contact: '', email: '', date: '' });
  const [bookingResult, setBookingResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const t = translations[lang];

  const filteredTours = useMemo(() => {
    return SAMPLE_TOURS.filter((tour) => {
      const matchesSegment = tour.type === 'both' || tour.type === segment;
      const matchesStyle = selectedStyle === 'all' || tour.style === selectedStyle;
      const matchesQuery =
        tour.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.title[lang].toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSegment && matchesStyle && matchesQuery;
    });
  }, [segment, selectedStyle, searchQuery, lang]);

  const formatMoney = (amount: number, curr: Currency) => {
    if (curr === 'UZS') return `${amount.toLocaleString()} so'm`;
    if (curr === 'EUR') return `?${amount}`;
    return `$${amount}`;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTour) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: bookingTour.id,
          fullName: formData.fullName,
          contactHandle: formData.contact,
          email: formData.email,
          travelDate: formData.date,
          adults,
          children,
          tourCategory: isPrivate ? 'private' : 'group',
          selectedCurrency: currency,
        }),
      });
      const data = await res.json();
      if (data.success) setBookingResult(data.bookingRef);
      else alert(data.error || 'Xatolik yuz berdi');
    } catch {
      alert('Serverga ulanishda xatolik');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-7 h-7 text-[#1B4965]" />
            <span className="font-bold text-xl tracking-tight text-[#1B4965]">{t.brand}</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5 text-sm font-medium text-stone-800"
            >
              <option value="USD">USD ($)</option>
              <option value="UZS">UZS (so'm)</option>
              <option value="EUR">EUR (?)</option>
            </select>
            <div className="flex rounded-lg border border-stone-200 overflow-hidden text-xs font-semibold">
              {(['uz', 'en', 'ru'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2.5 py-1.5 uppercase transition ${
                    lang === l ? 'bg-[#1B4965] text-white' : 'bg-white text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="relative bg-[#1B4965] text-white py-20 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Uzbekistan Eco & Heritage Travel
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {segment === 'inbound'
              ? 'Discover the Timeless Magic of the Silk Road'
              : 'O?zbekistonning eng go?zal maskanlari bo?ylab unutilmas sayohat'}
          </h1>
          <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-md rounded-2xl mb-8">
            <button
              onClick={() => { setSegment('inbound'); setCurrency('USD'); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                segment === 'inbound' ? 'bg-[#C86D51] text-white shadow-lg' : 'text-white/80 hover:text-white'
              }`}
            >
              {t.inbound}
            </button>
            <button
              onClick={() => { setSegment('domestic'); setCurrency('UZS'); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition ${
                segment === 'domestic' ? 'bg-[#C86D51] text-white shadow-lg' : 'text-white/80 hover:text-white'
              }`}
            >
              {t.domestic}
            </button>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-xl max-w-3xl mx-auto flex flex-col sm:flex-row gap-3 text-stone-800">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-stone-50 rounded-xl">
              <MapPin className="w-5 h-5 text-[#C86D51]" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="px-4 py-2.5 bg-stone-50 rounded-xl text-sm font-medium outline-none border border-stone-200"
            >
              <option value="all">{t.allStyles}</option>
              <option value="historical">{t.historical}</option>
              <option value="mountain_eco">{t.mountain_eco}</option>
              <option value="desert_yurt">{t.desert_yurt}</option>
              <option value="craft_gastronomy">{t.craft_gastronomy}</option>
            </select>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredTours.map((tour) => {
            const displayPrice = calculatePrice({
              basePrice: tour.basePrice,
              baseCurrency: tour.baseCurrency,
              targetCurrency: currency,
              adults: 1,
              children: 0,
              isPrivate: false,
            });

            return (
              <div key={tour.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition flex flex-col">
                <div className="relative h-56">
                  <img src={tour.image} alt={tour.title[lang]} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 bg-[#1B4965] text-white text-xs font-bold px-3 py-1 rounded-full">{tour.badge}</span>
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2.5 py-1 rounded-lg">{tour.days} {t.days}</span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-[#C86D51] uppercase tracking-wider mb-1">{tour.destination}</div>
                    <h3 className="text-lg font-bold text-stone-900 mb-3">{tour.title[lang]}</h3>
                  </div>
                  <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-500 block">{t.from}</span>
                      <span className="text-xl font-extrabold text-[#1B4965]">{formatMoney(displayPrice, currency)}</span>
                    </div>
                    <button
                      onClick={() => { setBookingTour(tour); setBookingResult(null); }}
                      className="bg-[#C86D51] hover:bg-[#b55c41] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition"
                    >
                      {t.bookNow}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {bookingTour && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
            <button onClick={() => setBookingTour(null)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700">
              <X className="w-6 h-6" />
            </button>
            {bookingResult ? (
              <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">{t.bookingSuccess}</h3>
                <div className="text-2xl font-mono font-extrabold text-[#1B4965] bg-amber-50 py-3 px-6 rounded-xl inline-block mb-4">{bookingResult}</div>
                <p className="text-sm text-stone-600">Menejerimiz tez orada WhatsApp yoki Telegram orqali bog?lanadi.</p>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-[#1B4965] pr-6">{bookingTour.title[lang]}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-600">{t.adults}</label>
                    <input type="number" min={1} max={20} value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="w-full mt-1 border rounded-xl px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-600">{t.children}</label>
                    <input type="number" min={0} max={15} value={children} onChange={(e) => setChildren(Number(e.target.value))} className="w-full mt-1 border rounded-xl px-3 py-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600">{t.category}</label>
                  <select value={isPrivate ? 'private' : 'group'} onChange={(e) => setIsPrivate(e.target.value === 'private')} className="w-full mt-1 border rounded-xl px-3 py-2 text-sm">
                    <option value="group">{t.group}</option>
                    <option value="private">{t.private}</option>
                  </select>
                </div>
                <input type="text" required placeholder={t.fullName} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" required placeholder={t.contact} value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                  <input type="email" required placeholder={t.email} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full border rounded-xl px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600">{t.date}</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full mt-1 border rounded-xl px-3 py-2 text-sm" />
                </div>
                <div className="bg-amber-50 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-semibold text-stone-700">Jami summa:</span>
                  <span className="text-xl font-extrabold text-[#1B4965]">
                    {formatMoney(calculatePrice({ basePrice: bookingTour.basePrice, baseCurrency: bookingTour.baseCurrency, targetCurrency: currency, adults, children, isPrivate }), currency)}
                  </span>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-[#1B4965] hover:bg-[#14374d] text-white font-bold py-3 rounded-xl transition">
                  {isSubmitting ? 'Yuborilmoqda...' : t.submitBooking}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}