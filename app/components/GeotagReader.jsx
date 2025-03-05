'use client';

import { useState, useEffect } from 'react';

export default function GeotagReader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [exifData, setExifData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [libraries, setLibraries] = useState({
    exifr: null,
    heic2any: null,
    loaded: false
  });

  // Dynamically import browser-only libraries
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        // Properly import the modules
        const exifrModule = await import('exifr');
        const heic2anyModule = await import('heic2any');
        
        // Set both libraries at once to ensure consistency
        setLibraries({
          exifr: exifrModule.default,
          heic2any: heic2anyModule.default,
          loaded: true
        });
      } catch (err) {
        console.error("Error loading libraries:", err);
        setError("Failed to load required libraries. Please check your internet connection and try again.");
      }
    };
    
    loadLibraries();
  }, []);

  const handleFileChange = async (event) => {
    // Make sure libraries are loaded
    if (!libraries.loaded) {
      setError("Libraries are still loading. Please try again in a moment.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const file = event.target.files[0];
      
      if (!file) return;
      
      setSelectedFile(file);
      
      // Handle HEIC files by converting to JPEG first
      let processedFile = file;
      if (file.name.toLowerCase().endsWith('.heic')) {
        const blob = await libraries.heic2any({
          blob: file,
          toType: 'image/jpeg',
        });
        processedFile = new File([blob], file.name.replace('.heic', '.jpg'), { 
          type: 'image/jpeg' 
        });
      }
      
      // Create image preview
      const imageUrl = URL.createObjectURL(processedFile);
      setImagePreview(imageUrl);
      
      // Parse EXIF data
      const data = await libraries.exifr.parse(processedFile, {
        gps: true,
        exif: true,
      });
      
      setExifData(data);
      setLoading(false);
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try another file.");
      setLoading(false);
    }
  };

  const renderMap = () => {
    if (!exifData || !exifData.latitude || !exifData.longitude) {
      return <div className="p-4 bg-red-100 text-red-700 rounded-lg">No GPS data found in this image.</div>;
    }
    
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${exifData.longitude-0.01}%2C${exifData.latitude-0.01}%2C${exifData.longitude+0.01}%2C${exifData.latitude+0.01}&amp;layer=mapnik&amp;marker=${exifData.latitude}%2C${exifData.longitude}`;
    
    // Google Maps links
    const googleMapsUrl = `https://www.google.com/maps?q=${exifData.latitude},${exifData.longitude}`;
    const googleStreetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${exifData.latitude},${exifData.longitude}`;
    
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold">Location Map</h3>
        <iframe 
          title="Location Map"
          width="100%" 
          height="300" 
          className="border-0 rounded-lg shadow-md" 
          src={mapUrl}>
        </iframe>
        
        <div className="mt-4 flex flex-wrap gap-4">
          <a 
            href={`https://www.openstreetmap.org/?mlat=${exifData.latitude}&mlon=${exifData.longitude}`} 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clipRule="evenodd" />
            </svg>
            OpenStreetMap
          </a>
          
          <a 
            href={googleMapsUrl} 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Google Maps
          </a>
          
          <a 
            href={googleStreetViewUrl} 
            target="_blank" 
            rel="noreferrer"
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Street View
          </a>
        </div>
      </div>
    );
  };

  const formatDateTimeOriginal = (dateTimeOriginal) => {
    if (!dateTimeOriginal) return 'Unknown';
    
    try {
      const date = new Date(dateTimeOriginal);
      return date.toLocaleString();
    } catch (e) {
      return dateTimeOriginal.toString();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Image Geotag Reader</h1>
      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Select an image file (JPG or HEIC):</label>
        <input
          type="file"
          accept=".jpg,.jpeg,.heic"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={!libraries.loaded}
        />
        {!libraries.loaded && !error && (
          <p className="text-sm text-gray-500 mt-1">Loading required libraries...</p>
        )}
      </div>
      
      {loading && (
        <div className="flex justify-center my-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {imagePreview && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Image Preview</h2>
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-w-full h-auto rounded-lg shadow-md max-h-96 object-contain bg-gray-100"
          />
        </div>
      )}
      
      {exifData && (
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">EXIF Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Location Data</h3>
              {exifData.latitude && exifData.longitude ? (
                <div>
                  <p><span className="font-medium">Latitude:</span> {exifData.latitude.toFixed(6)}</p>
                  <p><span className="font-medium">Longitude:</span> {exifData.longitude.toFixed(6)}</p>
                  <p><span className="font-medium">Altitude:</span> {exifData.altitude ? `${exifData.altitude.toFixed(1)} meters` : 'Unknown'}</p>
                </div>
              ) : (
                <p>No GPS data found in this image.</p>
              )}
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">Image Details</h3>
              <p><span className="font-medium">Camera:</span> {exifData.Make ? `${exifData.Make} ${exifData.Model || ''}` : 'Unknown'}</p>
              <p><span className="font-medium">Date Taken:</span> {formatDateTimeOriginal(exifData.DateTimeOriginal)}</p>
              <p><span className="font-medium">Dimensions:</span> {exifData.ExifImageWidth && exifData.ExifImageHeight ? `${exifData.ExifImageWidth} × ${exifData.ExifImageHeight}` : 'Unknown'}</p>
            </div>
          </div>
          
          {renderMap()}
        </div>
      )}
    </div>
  );
}