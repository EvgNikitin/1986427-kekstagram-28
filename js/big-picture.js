import {isEscapeKey} from './utils.js';

const bigPicture = document.querySelector('.big-picture');
const closeButton = bigPicture.querySelector('.big-picture__cancel');
const commentsCount = document.querySelector('.social__comment-count');
const commentsLoader = document.querySelector('.comments-loader');
const commentsBlock = document.querySelector('.social__comments');
const commentElement = commentsBlock.querySelector('li');
let comments = [];

const renderComments = () => {
  let commentsShowed = 0;
  const step = 5;
  const allComments = comments.length;
  return () => {
    const start = commentsShowed;
    const showCommentsCount = Math.min(allComments, commentsShowed + step);
    for (let i = start; i < showCommentsCount; i++) {
      const {avatar, name, message} = comments[i];
      const newComment = commentElement.cloneNode(true);
      const picture = newComment.querySelector('.social__picture');
      picture.src = avatar;
      picture.alt = name;
      newComment.querySelector('.social__text').textContent = message;
      commentsBlock.append(newComment);
      commentsShowed++;
    }
    if (commentsShowed === allComments) {
      commentsLoader.classList.add('hidden');
    } else {
      commentsLoader.classList.remove('hidden');
    }
    commentsCount.querySelector('.comments-opened').textContent = commentsShowed;
    commentsCount.querySelector('.comments-count').textContent = allComments;
  };
};

const renderPictureDetails = ({url, likes, description}) => {
  bigPicture.querySelector('.big-picture__img img').src = url;
  bigPicture.querySelector('.big-picture__img img').alt = description;
  bigPicture.querySelector('.likes-count').textContent = likes;
  bigPicture.querySelector('.social__caption').textContent = description;
};

const hideBigPicture = () => {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
};

export const showBigPicture = (data) => {
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  comments = data.comments;
  commentsBlock.innerHTML = '';
  const renderedComments = renderComments(data);
  renderPictureDetails(data);
  renderedComments();
  commentsLoader.addEventListener('click', renderedComments);
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideBigPicture();
  }
}

const onCancelButtonClick = () => {
  hideBigPicture();
};

closeButton.addEventListener('click', onCancelButtonClick);
