# Geotag Reader

A web application that extracts GPS coordinates from images to support environmental sampling and data collection efforts.

## About This Project

This application was developed to help people measure the Lead in their neighborhoods following the 2025 fires in Altadena and the Pacific Palisades. 
It will support environmental sampling efforts. 
The app helps researchers and field teams easily extract location data from photos taken during sample collection, ensuring accurate documentation of where soil samples were collected.


![Geotag Reader App Screenshot](https://www.evernote.com/shard/s51/sh/d7a6798c-27d2-4765-b9a8-0da1c8940cb6/M14lxXWJOgMSZjtZyDAyaDJFDpaVtBGVGPELIbftJnywqsJXX19SvWJBuQ/deep/0/image.jpg)


### How It Works

1. Upload a JPG or HEIC image file (taken with a smartphone or GPS-enabled camera)
2. The app extracts EXIF data including precise GPS coordinates
3. View the exact location on a map
4. Access Google Maps and Street View for the sample location
5. Record coordinates for soil testing and environmental analysis

## The Bigger Project

This tool is part of a larger citizen science and environmental health initiative in collaboration with USC Professor Seth John. The project aims to:

- Track soil contamination levels following the Altadena fires
- Monitor lead and arsenic levels below FEMA's 6-inch soil remediation depth
- Provide residents with information about potential contamination on their properties

Professor John's lab, which typically focuses on trace metals in the Pacific Ocean, has repurposed their equipment to analyze Southern California soils. Using X-ray technology, they can quickly identify contaminants in soil samples.

### Why This Matters

- FEMA typically removes only the top 6 inches of soil in remediation efforts
- Our sampling helps determine if contaminants exist below this depth
- Initial results have shown varying levels of lead contamination across properties
- The EPA marks soil with more than 200 ppm (parts per million) of lead as potentially contaminated
- California's benchmark is 80 ppm

# Technical Details

This application is built with:

- Next.js for the frontend framework
- Tailwind CSS for styling
- Client-side JavaScript libraries for image processing
- exifr for EXIF data extraction
- heic2any for HEIC image conversion

The app runs entirely in the browser with no server processing, ensuring privacy and fast performance.

## Getting Started

To run this application locally:

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

## Deployment

This application is deployed on Vercel and can be accessed at [insert your deployment URL here].

## Contributing

Contributions to improve the application are welcome. Please feel free to submit pull requests or open issues to suggest enhancements.