import { useState, useEffect } from 'react';
import { fetchImages } from '../services/api';
import { Searchbar } from './Searchbar/Searchbar';
import { Loader } from './Loader/Loader';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Button } from './Button/Button';
import { animateScroll } from 'react-scroll';
import { Modal } from './Modal/Modal';

export const App = () => {
  const [query, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [largeImageURL, setLargeImageURL] = useState('');

  const per_page = 12;

  useEffect(() => {
    getImages(query, page);
  }, [query, page]);

  const getImages = async (query, page) => {
    if (!query) {
      return;
    }
    setIsLoading(true);

    try {
      const { hits, totalHits } = await fetchImages(query, page);
        if (hits.length === 0) {
        return alert('Sorry, not found.');
      }
      setImages(prevImages => [...prevImages, ...hits]);
      setLoadMore(page < Math.ceil(totalHits / per_page));
    } catch (error) {
      setError({ error });
    } finally {
      setIsLoading(false);
    }
  };

    const formSubmit = searchQuery => {
    setSearchQuery(searchQuery);
    setImages([]);
    setPage(1);
    setLoadMore(false);
  };

  const onloadMore = () => {
    setIsLoading(true);
    setPage(prevPage => prevPage + 1);
    scrollOnMoreButton();
  };

  const scrollOnMoreButton = () => {
    animateScroll.scrollToBottom({
      duration: 1000,
      delay: 10,
      smooth: 'linear',
    });
  };

  const openModal = largeImageURL => {
    setShowModal(true);
    setLargeImageURL(largeImageURL);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Searchbar onSubmit={formSubmit} />
      {isLoading ? (
        <Loader />
      ) : (
        <ImageGallery images={images} openModal={openModal} />
      )}
      {error && <p>something went wrong!</p>}

      {loadMore && <Button onloadMore={onloadMore} page={page} />}

      {showModal && (
        <Modal largeImageURL={largeImageURL} onClose={closeModal} />
      )}
    </>
  );
}
