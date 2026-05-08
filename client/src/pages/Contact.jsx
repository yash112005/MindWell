import { useState } from 'react';
import axios from 'axios';
import { Send, MapPin, Mail, Phone } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      setStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Something went wrong. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Have questions or need support? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {}
        <div className="md:col-span-1 space-y-6">
          <div className="card bg-primary-600 text-white border-none shadow-lg">
            <h3 className="text-xl font-bold mb-6">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary-200" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-primary-100 text-sm mt-1">123 Wellness Blvd, Suite 100<br/>San Francisco, CA 94105</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary-200" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-primary-100 text-sm mt-1">support@mindwell.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary-200" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-primary-100 text-sm mt-1">+1 (800) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a Message</h2>
            
            {status.message && (
              <div className={`p-4 rounded-lg mb-6 ${status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300'}`}>
                {status.message}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    className="input-field"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChange}
                    className="input-field"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={onChange}
                  rows="5"
                  className="input-field resize-none"
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="btn-primary w-full md:w-auto px-8 flex items-center justify-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
