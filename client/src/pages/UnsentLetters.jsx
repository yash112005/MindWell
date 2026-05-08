import React, { useState, useEffect } from 'react';
import { Mail, Shield, Plus, ArrowLeft, Trash2, Calendar, Sparkles, User, Clock, ChevronRight, Lock } from 'lucide-react';
import { getLetters, saveLetter, deleteLetter, getPatterns } from '../utils/unsentLetters';

const UnsentLetters = () => {
  const [letters, setLetters] = useState([]);
  const [view, setView] = useState('vault'); // vault, composer, reader
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [activeRecipient, setActiveRecipient] = useState(null);
  
  const [formData, setFormData] = useState({
    recipient: '',
    text: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    setLetters(getLetters());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    
    saveLetter(formData);
    setLetters(getLetters());
    setFormData({ recipient: '', text: '', date: new Date().toISOString().split('T')[0] });
    setView('vault');
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this letter forever? It cannot be recovered.')) {
      deleteLetter(id);
      setLetters(getLetters());
      if (view === 'reader') setView('vault');
    }
  };

  // Group letters by recipient
  const groupedLetters = letters.reduce((acc, letter) => {
    const recipient = letter.recipient || 'Unnamed';
    if (!acc[recipient]) acc[recipient] = [];
    acc[recipient].push(letter);
    return acc;
  }, {});

  const recipients = Object.keys(groupedLetters).sort();

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 min-h-[80vh]">
      {/* Vault Header */}
      {view === 'vault' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-indigo-500" /> The Unsent Vault
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Private letters to people, your past, or your future.</p>
            </div>
            <button 
              onClick={() => setView('composer')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" /> Write New Letter
            </button>
          </div>

          {letters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-dark-surface rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-800">
              <Mail className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">Your vault is empty</h3>
              <p className="text-gray-500 dark:text-gray-500 max-w-sm mt-2">Words left unsaid can weigh us down. Write them here to release them safely.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {recipients.map(recipient => {
                const recipientLetters = groupedLetters[recipient];
                const pattern = getPatterns(recipient);
                
                return (
                  <div key={recipient} className="bg-white dark:bg-dark-surface rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{recipient}</h3>
                          <p className="text-xs text-gray-500">{recipientLetters.length} letter{recipientLetters.length > 1 ? 's' : ''}</p>
                        </div>
                      </div>
                      
                      {pattern && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 animate-pulse-glow">
                          <Sparkles className="w-4 h-4" />
                          <span>AI Insight: Pattern of {pattern}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="divide-y divide-gray-50 dark:divide-gray-800">
                      {recipientLetters.sort((a,b) => new Date(b.date) - new Date(a.date)).map(letter => (
                        <button 
                          key={letter.id}
                          onClick={() => { setSelectedLetter(letter); setView('reader'); }}
                          className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-4">
                            <Clock className="w-4 h-4 text-gray-300" />
                            <div>
                              <p className="text-gray-900 dark:text-gray-200 line-clamp-1 font-medium">{letter.text.substring(0, 60)}...</p>
                              <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">{new Date(letter.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Composer View */}
      {view === 'composer' && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-dark-bg flex flex-col animate-fade-in">
          <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => setView('vault')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <Lock className="w-4 h-4" /> Encrypted Session
            </div>
            <button 
              onClick={handleSave}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors"
            >
              Save Privately
            </button>
          </div>

          <div className="flex-1 max-w-3xl mx-auto w-full p-8 md:p-12 overflow-y-auto">
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">To</label>
                  <input 
                    type="text"
                    placeholder="Person name / Past self / Future self..."
                    className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-100 dark:border-gray-800 focus:border-indigo-500 outline-none pb-2 dark:text-white"
                    value={formData.recipient}
                    onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Date</label>
                  <input 
                    type="date"
                    className="w-full text-2xl font-bold bg-transparent border-b-2 border-gray-100 dark:border-gray-800 focus:border-indigo-500 outline-none pb-2 dark:text-white"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <textarea 
                placeholder="Write what you couldn't say..."
                className="w-full h-[60vh] bg-transparent text-xl leading-relaxed outline-none resize-none dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-700"
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                autoFocus
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* Reader View */}
      {view === 'reader' && selectedLetter && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-dark-bg flex flex-col animate-fade-in">
          <div className="p-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
            <button 
              onClick={() => setView('vault')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest">Unsent Letter to</p>
              <h2 className="font-bold text-xl dark:text-white">{selectedLetter.recipient || 'Unnamed'}</h2>
            </div>
            <button 
              onClick={() => handleDelete(selectedLetter.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 max-w-2xl mx-auto w-full p-8 md:p-12 overflow-y-auto">
            <div className="flex items-center gap-2 text-gray-400 mb-8 font-mono text-sm">
              <Calendar className="w-4 h-4" /> {new Date(selectedLetter.date).toLocaleDateString()}
            </div>
            
            <div className="whitespace-pre-wrap text-xl leading-relaxed text-gray-800 dark:text-gray-200">
              {selectedLetter.text}
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Detected Emotions</p>
              <div className="flex flex-wrap gap-2">
                {selectedLetter.detected_emotions.map(emotion => (
                  <span key={emotion} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg text-sm capitalize font-medium">
                    {emotion}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnsentLetters;
