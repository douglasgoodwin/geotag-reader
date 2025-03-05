'use client';

import dynamic from 'next/dynamic';

// Import the component with no SSR
const GeotagReader = dynamic(() => import('./components/GeotagReader'), { 
  ssr: false,
  loading: () => (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Image Geotag Reader</h1>
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p>Loading application...</p>
      </div>
    </div>
  )
});

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8">
      <GeotagReader />
    </main>
  );
}