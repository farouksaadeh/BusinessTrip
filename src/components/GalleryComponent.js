import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const UNSPLASH_ACCESS_KEY = 'g0wKetR_PyTPs_iAzxdZ0oEM3HPzVYCC2Lruk_OdkDY';

const fetchImages = async (query, count = 10) => {
  const response = await axios.get(`https://api.unsplash.com/search/photos`, {
    params: {
      query,
      per_page: count,
    },
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
    }
  });

  return response.data.results.map(image => ({
    original: image.urls.regular,
    thumbnail: image.urls.thumb,
  }));
};

const GalleryComponent = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const loadImages = async () => {
      const hotelImages = await fetchImages('hotel');
      const airlineImages = await fetchImages('airline');
      setImages([...hotelImages, ...airlineImages]);
    };

    loadImages();
  }, []);

  return <ImageGallery items={images} />;
};

export default GalleryComponent;
