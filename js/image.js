'use strict';

(function () {
  var PhotoParams = {
    WIDTH: '70px',
    HEIGHT: '70px'
  };

  var DEFAULT_AVATAR = 'img/muffin-grey.svg';
  var images = [];
  var avatarPreview = document.querySelector('.ad-form-header__preview > img');
  var avatarChooser = document.querySelector('.ad-form-header__input');
  var photoPreview = document.querySelector('.ad-form__photo');
  var photoChooser = document.querySelector('.ad-form__input');
  var photoContainer = document.querySelector('.ad-form__photo-container');


  var loadAvatar = function (src) {
    avatarPreview.src = src;
  };

  /**
   * Функция создания фотографий жилья
   * @param {string} src
   */
  var loadPhoto = function (src) {
    var photoPreviewClone = photoPreview.cloneNode();
    var image = document.createElement('img');
    image.src = src;
    image.style.width = PhotoParams.WIDTH;
    image.style.height = PhotoParams.HEIGHT;
    image.classList.add('ad-form__photo--upload');
    photoPreviewClone.appendChild(image);
    photoContainer.insertBefore(photoPreviewClone, photoPreview);
  };

  /**
   * Функция отрисовки изображений
   * @param {Array} files
   * @param {function} callback
   */
  var loadImages = function (files, callback) {
    if (files) {
      Array.from(files).forEach(function (file) {
        if (file.type.match('image')) {
          var reader = new FileReader();

          reader.addEventListener('load', function () {
            callback(reader.result);
          });

          reader.readAsDataURL(file);
        }
      });
    }
  };

  /**
   * Функция удаления изображений, добавленных на страницу
   */
  var removeImages = function () {
    images = document.querySelectorAll('.ad-form__photo--upload');
    images.forEach(function (item) {
      item.parentElement.remove();
    });
    avatarPreview.src = DEFAULT_AVATAR;
  };

  var onAvatarChange = function (evt) {
    loadImages(evt.target.files, loadAvatar);
  };

  var onPhotoChange = function (evt) {
    loadImages(evt.target.files, loadPhoto);
  };

  var addImageListeners = function () {
    avatarChooser.addEventListener('change', onAvatarChange);
    photoChooser.addEventListener('change', onPhotoChange);
  };

  var removeImageListeners = function () {
    avatarChooser.removeEventListener('change', onAvatarChange);
    photoChooser.removeEventListener('change', onPhotoChange);
    removeImages();
  };

  window.image = {
    addListeners: addImageListeners,
    removeListeners: removeImageListeners
  };
})();
