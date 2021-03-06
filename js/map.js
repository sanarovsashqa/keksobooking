'use strict';

(function () {
  var activePage;
  var map = document.querySelector('.map');
  var mainPin = map.querySelector('.map__pin--main');

  var mainPinParams = {
    WIDTH: 65,
    HEIGHT: 84,
    DEFAULT_X: '570px',
    DEFAULT_Y: '375px',
    y: {
      MIN: 130,
      MAX: 630
    },
    x: {
      MIN: 0
    }
  };

  /**
   * @typedef {Object} mainPinCoordinates
   * @property {x}
   * @property {y}
   */

  /**
   * Функция получения координат главного пина
   * @return {mainPinCoordinates}
   */
  var getMainPinCoords = function () {
    var x = mainPin.offsetLeft + Math.floor(mainPinParams.WIDTH / 2);
    var y = mainPin.offsetTop + mainPinParams.HEIGHT;

    return {
      x: x,
      y: y
    };
  };

  var onLoadSuccess = function (adData) {
    window.pins.create(window.filter.activate(adData));
  };

  var onLoadError = function (errorMessage) {
    window.createErrorMessage(errorMessage);
  };

  /**
   * Функция приведения страницы в активное состояние
   */
  var activateMap = function () {
    map.classList.remove('map--faded');
    window.backend.load(onLoadSuccess, onLoadError);
    window.form.activate();
  };

  /**
   * Функция приведения страницы в неактивное состояние
   */
  var deactivateMap = function () {
    map.classList.add('map--faded');
    mainPin.style.left = mainPinParams.DEFAULT_X;
    mainPin.style.top = mainPinParams.DEFAULT_Y;
    window.card.disable();
    window.form.deactivate();
    window.form.setAdress(getMainPinCoords());
    window.pins.remove();
    window.filter.deactivate();
    activePage = false;
  };

  /**
   * Функция инициализации страницы
   */
  var initPage = function () {
    deactivateMap();

    mainPin.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        var mainPinCoords = getMainPinCoords();

        if (mainPinCoords.y - shift.y >= mainPinParams.y.MIN && mainPinCoords.y - shift.y <= mainPinParams.y.MAX) {
          mainPin.style.top = mainPin.offsetTop - shift.y + 'px';
        }

        if (mainPinCoords.x - shift.x >= mainPinParams.x.MIN && mainPinCoords.x - shift.x <= map.offsetWidth) {
          mainPin.style.left = (mainPin.offsetLeft - shift.x) + 'px';
        }

        window.form.setAdress(mainPinCoords);
      };

      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        if (!activePage) {
          activateMap();
          activePage = true;
        }

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  initPage();

  window.map = {
    getMainPinCoords: getMainPinCoords,
    deactivate: deactivateMap
  };
})();
