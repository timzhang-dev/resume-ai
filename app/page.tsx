'use client';

import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      setError('Please enter a resume bullet point');
      return;
    }

    setIsLoading(true);
    setError(null);
    setImprovedText('');

    try {
      const response = await fetch('/api/improve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to improve bullet point');
      }

      setImprovedText(data.improvedText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Resume Bullet Point Improver
          </h1>
          <p className="text-gray-600">
            Transform your resume bullet points into impactful, professional statements
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="input-text"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Resume Bullet Point
            </label>
            <textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g., Worked on a project that increased sales"
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder-gray-400"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Improving...
              </span>
            ) : (
              'Improve Bullet'
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {improvedText && (
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Improved Bullet Point
            </label>
            <div className="p-4 bg-white border border-gray-300 rounded-lg shadow-sm min-h-[80px]">
              <p className="text-gray-900 whitespace-pre-wrap">{improvedText}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}




