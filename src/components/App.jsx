import React, { Component } from 'react';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import { AppDiv } from './App.styled';
import { ToastContainer, toast, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchImages } from './Api';

class App extends Component {
  state = {
    images: [],
    isLoading: false,
    error: null,
    query: '',
    page: 1,
    showModal: false,
    selectedImage: null,
    isLastPage: false,
  };

  componentDidUpdate(_prevProps, prevState) {
    if (prevState.query !== this.state.query || prevState.page !== this.state.page) {
      this.setState({ images: [], page: 1, isLastPage: false }, () => {
        this.fetchImages();
      });
    }
  }

  fetchImages = async () => {
    const { query, page } = this.state;

    this.setState({ isLoading: true });

    try {
      const data = await fetchImages(query, page);

      const { hits, totalHits } = data;

      if (hits.length === 0) {
        toast('Sorry, there are no images matching your request...', { position: toast.POSITION.TOP_CENTER });
      }

      const modifiedHits = hits.map(({ id, tags, webformatURL, largeImageURL }) => ({
        id,
        tags,
        webformatURL,
        largeImageURL
      }));

      this.setState(prevState => ({
        images: [...prevState.images, ...modifiedHits],
        isLastPage: prevState.images.length + modifiedHits.length >= totalHits,
      }));
    } catch (error) {
      this.setState({ error: error.message });
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleSearchSubmit = query => {
    if (this.state.query === query) {
      return;
    }
    this.setState({ query: query, page: 1, images: [], error: null, isLastPage: false });
  };

  handleImageClick = image => {
    this.setState({ selectedImage: image, showModal: true });
    document.body.style.overflow = 'hidden';
  };

  handleModalClose = () => {
    this.setState({ selectedImage: null, showModal: false });
    document.body.style.overflow = 'auto';
  };

  incrementPage = () => {
  this.setState(prevState => ({
    page: prevState.page + 1
  }));
};

  render() {
    const { images, isLoading, error, showModal, selectedImage, isLastPage } = this.state;

    return (
      <AppDiv>
        <ToastContainer transition={Flip} />
        <Searchbar onSubmit={this.handleSearchSubmit} />

        {error && <p>Error: {error}</p>}

        <ImageGallery images={images} onItemClick={this.handleImageClick} />

        {isLoading && <Loader />}

        {!isLoading && images.length > 0 && !isLastPage && (
          <Button onClick={this.incrementPage} />
        )}

        {showModal && (
          <Modal image={selectedImage} onClose={this.handleModalClose} />
        )}
      </AppDiv>
    );
  }
}

export default App;
