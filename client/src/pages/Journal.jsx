import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Plus, Trash2, Calendar, Smile, Book } from 'lucide-react';

const Journal = () => {
  const { user } = useSelector((state) => state.auth);
  const [journals, setJournals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 5,
  });

  const getJournals = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get('http:
      setJournals(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) getJournals();
  }, [user]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('http://localhost:5000/api/journal', formData, config);
      setIsModalOpen(false);
      setFormData({ title: '', content: '', mood: 5 });
      getJournals();
    } catch (error) {
      console.error(error);
      alert('Failed to create journal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteJournal = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`http://localhost:5000/api/journal/${id}`, config);
        setJournals(journals.filter((j) => j._id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getMoodEmoji = (moodValue) => {
    if (moodValue >= 8) return '😄';
    if (moodValue >= 6) return '🙂';
    if (moodValue >= 4) return '😐';
    if (moodValue >= 2) return '😔';
    return '😢';
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Book className="w-8 h-8 text-primary-500" /> My Journal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Document your thoughts and track your emotional wellness.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Entry
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-10 text-gray-500">Loading journals...</div>
      ) : journals.length === 0 ? (
        <div className="card text-center py-16 flex flex-col items-center border-dashed border-2">
          <Book className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No entries yet</h3>
          <p className="text-gray-500 mb-6">Start your journaling journey today by creating your first entry.</p>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create First Entry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {journals.map((journal) => (
            <div key={journal._id} className="card flex flex-col hover:border-primary-300 dark:hover:border-primary-700 group relative">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  {new Date(journal.date).toLocaleDateString()}
                </div>
                <button 
                  onClick={() => deleteJournal(journal._id)} 
                  className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{journal.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4 flex-grow whitespace-pre-wrap">{journal.content}</p>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" title={`Mood: ${journal.mood}/10`}>{getMoodEmoji(journal.mood)}</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{journal.mood}/10</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="text-xs px-2 py-1 rounded-md bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-800 font-medium capitalize">
                    {journal.sentiment}
                  </div>
                  {journal.dominantEmotion && (
                    <div className="text-xs px-2 py-1 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium capitalize">
                      {journal.dominantEmotion}
                    </div>
                  )}
                </div>
              </div>
              
              {journal.keyThemes && journal.keyThemes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {journal.keyThemes.map((theme, i) => (
                    <span key={i} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded italic">
                      #{theme}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in-up">
          <div className="glass-panel rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100/50 dark:border-white/10 flex justify-between items-center sticky top-0 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-md z-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Book className="w-6 h-6 text-primary-500" /> New Journal Entry
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  className="input-field text-lg font-medium"
                  placeholder="How was your day?"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
                  <span className="text-xs text-gray-500">Express yourself freely</span>
                </div>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={onChange}
                  className="input-field min-h-[200px] resize-y"
                  placeholder="Write your thoughts here..."
                  required
                ></textarea>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Smile className="w-5 h-5 text-amber-500" /> How are you feeling today?
                  </label>
                  <span className="text-3xl">{getMoodEmoji(formData.mood)}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Low</span>
                  <input
                    type="range"
                    name="mood"
                    min="1"
                    max="10"
                    value={formData.mood}
                    onChange={onChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-600"
                  />
                  <span className="text-sm text-gray-500">High</span>
                </div>
                <div className="text-center mt-2 text-sm font-medium text-primary-600 dark:text-primary-400">
                  Mood level: {formData.mood} / 10
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? 'Analyzing...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
