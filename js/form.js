import {isArrayUnique, isEscapeKey} from './utils.js';
import {Effect, setEffect, onEffectPickerChange, onEffectSliderUpdate, effectPicker, effectSlider} from './effects.js';
import {Scale, onScaleControlClick, setScale, scaleControl, } from './scaler.js';

const form = document.querySelector('.img-upload__form');
const uploadOverlay = document.querySelector('.img-upload__overlay');
const uploadImageForm = document.querySelector('#upload-select-image');
const hashtags = document.querySelector('.text__hashtags');
const description = document.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper'
});

const onImageLoadCloseClick = () => {
  closeLoaderModal();
};

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

const onImageSubmit = (evt) => {
  evt.preventDefault();
  if (pristine.validate()) {
    uploadImageForm.submit();
    closeLoaderModal();
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

export const processingPhoto = () => {
  setScale(Scale.MAX);
  setEffect(Effect.NONE);

  scaleControl.addEventListener('click', onScaleControlClick);
  effectPicker.addEventListener('change', onEffectPickerChange);
  effectSlider.on('update', onEffectSliderUpdate);
};

const onImageSelect = () => {
  uploadOverlay.classList.remove('hidden');
  document.body.classList.add('modal-open');

  const uploadCancelButton = document.querySelector('#upload-cancel');
  uploadCancelButton.addEventListener('click', onImageLoadCloseClick);
  document.addEventListener('keydown', onImageLoadEscKeyDown);
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
  processingPhoto();
};