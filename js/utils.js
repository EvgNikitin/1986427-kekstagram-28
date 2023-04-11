export const isArrayUnique = (tags) => {
  const lowerTags = tags.map((tag) => tag.toLowerCase());
  return lowerTags.length === new Set(lowerTags).size;
};

export const isEscapeKey = (evt) => evt.key === 'Escape';

export function debounce (callback, timeoutDelay = 500) {
  let timeoutId;

  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
}
