import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useDoseBridge } from '../../store/useDoseBridge';
import { EducationalArticle } from '../../types';

export const EducationTab: React.FC = () => {
  const { language, speakText } = useDoseBridge();

  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<EducationalArticle | null>(null);

  useEffect(() => {
    async function load() {
      const data = await api.getResources();
      setArticles(data);
      if (data.length > 0 && !activeArticle) {
        setActiveArticle(data[0]);
      }
    }
    load();
  }, []);

  const categories = [
    { id: 'all', label: 'All Guides' },
    { id: 'instructions', label: 'Reading Labels' },
    { id: 'storage', label: 'Safe Storage' },
    { id: 'safety', label: 'Missed Doses' },
    { id: 'interactions', label: 'Food & Drink Rules' },
    { id: 'emergency', label: 'When to Seek Urgent Care' },
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === 'all' || art.category === selectedCategory;
    const title = art.title[language] || art.title.en || '';
    const summary = art.summary[language] || art.summary.en || '';
    const matchesQuery =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleSpeakArticle = (art: EducationalArticle) => {
    const title = art.title[language] || art.title.en;
    const body = art.simpleContent[language] || art.simpleContent.en;
    const textToSpeak = `${title}. ${body}`;
    speakText(textToSpeak, language);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#1e3a2f]">
              Patient Education & Monograph Library
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] mt-0.5">
              Medicine & Health Guides
            </h1>
            <p className="text-xs sm:text-sm text-[#57534e] mt-1">
              Plain-language medical guidance written without confusing jargon.
            </p>
          </div>

          {/* Search box */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics (e.g. food, storage)..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#faf8f5] border border-[#e7e2d8] text-xs text-[#1c1917] placeholder:text-[#a8a29e] focus:outline-none focus:border-[#1e3a2f]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-5 border-t border-[#f2ede4] scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#1e3a2f] text-[#fcfbf9] border-[#1e3a2f]'
                  : 'bg-[#faf8f5] text-[#57534e] border-[#e7e2d8] hover:bg-[#f2ede4]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Articles List & Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Article Index */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#78716c] px-1">
            Library Index ({filteredArticles.length} entries)
          </div>

          {filteredArticles.map((art) => {
            const isSelected = activeArticle?.id === art.id;
            const title = art.title[language] || art.title.en;
            const summary = art.summary[language] || art.summary.en;

            return (
              <div
                key={art.id}
                onClick={() => setActiveArticle(art)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#faf8f5] border-[#1e3a2f] shadow-xs'
                    : 'bg-white border-[#e7e2d8] hover:border-[#d6cebf]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1e3a2f] bg-[#e7e2d8]/60 px-2 py-0.5 rounded-md">
                    {art.category} • {art.readTime}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeakArticle(art);
                    }}
                    className="text-xs font-medium text-[#1e3a2f] hover:underline"
                  >
                    Listen
                  </button>
                </div>

                <h3 className="text-base font-serif font-bold text-[#1c1917] mt-2 leading-snug">
                  {title}
                </h3>
                <p className="text-xs text-[#57534e] mt-1 line-clamp-2 leading-relaxed">
                  {summary}
                </p>
              </div>
            );
          })}
        </div>

        {/* Right Column: Monograph Reading Pane */}
        <div className="lg:col-span-2">
          {activeArticle ? (
            <article className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e7e2d8] shadow-xs space-y-6">
              {/* Article Top Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-[#f2ede4]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1e3a2f]">
                    Clinical Monograph
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] mt-1 leading-snug">
                    {activeArticle.title[language] || activeArticle.title.en}
                  </h2>
                  <span className="text-xs text-[#78716c] mt-1 block">
                    Estimated reading time: {activeArticle.readTime} • Filed under: {activeArticle.category}
                  </span>
                </div>

                <button
                  onClick={() => handleSpeakArticle(activeArticle)}
                  className="px-4 py-2 rounded-xl bg-[#1e3a2f] hover:bg-[#162c23] text-white font-medium text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  Read Guide Aloud
                </button>
              </div>

              {/* Summary Highlight Box */}
              <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e7e2d8] text-[#1c1917]">
                <span className="text-[11px] font-bold text-[#78716c] uppercase tracking-wider block mb-1">
                  Summary at a Glance:
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {activeArticle.summary[language] || activeArticle.summary.en}
                </p>
              </div>

              {/* Body */}
              <div className="text-[#292524] leading-relaxed text-sm sm:text-base whitespace-pre-line font-normal space-y-3">
                {activeArticle.simpleContent[language] || activeArticle.simpleContent.en}
              </div>

              {/* Key Takeaways */}
              <div className="p-5 rounded-2xl bg-[#fffbeb] border border-[#fde68a]">
                <h4 className="text-xs font-bold text-[#92400e] uppercase tracking-wider mb-3">
                  Essential Takeaways & Safeguards
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm font-medium text-[#78350f]">
                  {activeArticle.keyTakeaways.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#b45309] mt-2 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ) : (
            <div className="flex items-center justify-center p-12 rounded-3xl bg-white border border-[#e7e2d8] text-[#78716c] text-sm">
              Select a health guide from the left index to read.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
