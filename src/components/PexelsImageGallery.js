import React, { useEffect, useState } from 'react';
import { createClient } from 'pexels';

const client = createClient('g2nYiD2jz1NZFyNJi4EgSrTBLlptInmmOggC8HDInHNF4nuMRWnjYAHM'); 

const PexelsImageGallery = ({ query, alt }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await client.photos.search({ query, per_page: 1 });
        if (response.photos.length > 0) {
          setImageUrl(response.photos[0].src.medium);
        }
      } catch (error) {
        console.error('Error fetching images from Pexels:', error);
      }
    };

    fetchImage();
  }, [query]);

  if (!imageUrl) return null;

  return <img src={imageUrl} alt={alt} className="result-image" />;
};

export default PexelsImageGallery;
