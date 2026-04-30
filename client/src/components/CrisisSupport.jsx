import { Phone, Heart, ExternalLink, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

const helplines = [
  { name: 'iCall', number: '9152987821', desc: 'Mon–Sat, 8am–10pm', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', textColor: 'text-blue-700 dark:text-blue-300', dotColor: 'bg-blue-500' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 Free Support', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800', textColor: 'text-purple-700 dark:text-purple-300', dotColor: 'bg-purple-500' },
  { name: 'NIMHANS', number: '080-46110007', desc: 'National helpline', color: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800', textColor: 'text-teal-700 dark:text-teal-300', dotColor: 'bg-teal-500' },
];

const CrisisSupport = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border-2 border-red-200 dark:border-red-800/60 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 overflow-hidden shadow-sm">
      {}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="font-bold text-red-700 dark:text-red-400 text-sm">
              Crisis Support Available 24/7
            </p>
            <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">
              You are never alone. Immediate help is one call away.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-red-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-red-500" />
          )}
        </div>
      </button>

      {}
      {expanded && (
        <div className="px-5 pb-5 space-y-3 animate-fade-in-up">
          <p className="text-sm text-red-600 dark:text-red-400 leading-relaxed mb-4 border-t border-red-200 dark:border-red-800/50 pt-3">
            If you're experiencing a mental health crisis or having thoughts of harming yourself,
            please reach out to a professional immediately.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {helplines.map((h) => (
              <div key={h.name} className={`rounded-xl border p-3 ${h.color}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${h.dotColor}`} />
                  <p className={`text-xs font-bold ${h.textColor}`}>{h.name}</p>
                </div>
                <a
                  href={`tel:${h.number.replace(/-/g, '')}`}
                  className={`flex items-center gap-1.5 font-bold text-base ${h.textColor} hover:underline`}
                >
                  <Phone className="w-4 h-4" />
                  {h.number}
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{h.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-red-200 dark:border-red-800/50">
            <Heart className="w-4 h-4 text-red-400 flex-shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400">
              Remember: it's okay to ask for help. Seeking support is a sign of strength.
            </p>
            <a
              href="https://www.nimhans.ac.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-1 text-xs text-red-500 hover:underline flex-shrink-0"
            >
              More resources <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrisisSupport;
