import {isArrayUnique, isEscapeKey} from './utils.js';
import {Effect, setEffect, onEffectSliderUpdate, effectPicker, effectSlider} from './effects.js';
import {Scale, onScaleControlClick, setScale, scaleControl, } from './scaler.js';
import {UPLOAD_PHOTO, REQUEST_METHOD_POST, sendRequest} from './RequestApi.js';
import {MESSAGE_TYPE_ERROR, MESSAGE_TYPE_SUCCESS, showMessage} from './MessageInfo.js';

const form = document.querySelector('.img-upload__form');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadImageForm = document.querySelector('#upload-select-image');
const hashtags = document.querySelector('.text__hashtags');
const description = document.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper'
});

const onImageLoadEscKeyDown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeLoaderModal();
  }
};

function closeLoaderModal () {
  uploadImageForm.reset();

  document.body.classList.remove('modal-open');
  uploadOverlay.classList.add('hidden');

  document.removeEventListener('keydown', onImageLoadEscKeyDown);
}

const sendForm = async () => {
  const formData = new FormData(form);

  form.querySelector('#upload-submit')
    .setAttribute('disabled', '');

  try {
    await sendRequest(UPLOAD_PHOTO, {
      method: REQUEST_METHOD_POST,
      body: formData
    });

    closeLoaderModal();
    showMessage(MESSAGE_TYPE_SUCCESS);
  } catch {
    showMessage(MESSAGE_TYPE_ERROR);
  }

  form.querySelector('#upload-submit').removeAttribute('disabled');
};

const onImageSubmit = async (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    await sendForm();
  }
};

const validateHashtag = (hashtag) => new RegExp('^#[а-яёa-z0-9]{1,19}$').test(hashtag);

const validateHashtags = (value) => {
  const tags = value
    .trim()
    .split(' ')
    .filter((tag) => tag.trim().length);
  return tags.length <= 5 && isArrayUnique(tags) && tags.every(validateHashtag);
};

const setPicture = (url) => {
  document.querySelector('.img-upload__preview img')
    .setAttribute('src', url);

  effectPicker.querySelectorAll('span')
    .forEach((span) => {
      span.style.setProperty('background-image', `url(${url})`);
    });
};

export const processingPhoto = (file) => {
  setPicture(URL.createObjectURL(file));
  setScale(Scale.MAX);
  setEffect(Effect.NONE, true);

  scaleControl.addEventListener('click', onScaleControlClick);
  effectPicker.addEventListener('change', (event) => {
    const effectName = event.target.getAttribute('value');
    const show = effectName === Effect.NONE;
    setEffect(effectName, show);
  });
  effectSlider.on('update', onEffectSliderUpdate);
};

const onImageSelect = (event) => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  document.querySelector('#upload-cancel').addEventListener('click', closeLoaderModal);
  document.addEventListener('keydown', onImageLoadEscKeyDown);
  if (event.target === form.filename) {
    processingPhoto(event.target.files.item(0));
  }
};

const onInputKeyDown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
  pristine.addValidator(hashtags, validateHashtags, 'Неверный формат хэштэгов');
};

export const formListener = () => {
  form.addEventListener('change', onImageSelect);
  uploadImageForm.addEventListener('submit', onImageSubmit);
  hashtags.addEventListener('keydown', onInputKeyDown);
  description.addEventListener('keydown', onInputKeyDown);
};
