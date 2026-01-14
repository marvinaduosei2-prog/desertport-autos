'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BuilderEditorPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Builder.io editor
    // You'll replace this URL with your actual Builder.io space URL after setup
    const builderUrl = 'https://builder.io/content';
    window.location.href = builderUrl;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
      <div className="text-center space-y-6 p-8">
        {/* Animated Logo/Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-lime-600 rounded-2xl shadow-2xl shadow-lime-600/50 animate-pulse">
          <svg className="w-12 h-12 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        </div>

        {/* Loading Text */}
        <div>
          <h1 className="text-4xl font-black text-white mb-3">
            Opening Visual Editor
          </h1>
          <p className="text-gray-600 text-lg">
            Redirecting to Builder.io...
          </p>
        </div>

        {/* Loading Dots */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Manual Link (fallback) */}
        <div className="pt-8">
          <p className="text-sm text-gray-500 mb-3">
            If you're not redirected automatically:
          </p>
          <a
            href="https://builder.io/content"
            className="inline-flex items-center gap-2 px-6 py-3 bg-lime-600 text-black font-bold rounded-lg hover:bg-lime-500 transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Builder.io
          </a>
        </div>

        {/* Info Box */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl max-w-md mx-auto">
          <h3 className="text-sm font-bold text-lime-500 uppercase tracking-wider mb-2">
            First Time Setup Required
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            After creating your free Builder.io account, come back here and I'll show you how to connect it to your site.
          </p>
        </div>
      </div>
    </div>
  );
}
