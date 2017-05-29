(function processForm() {
  var webStorageUtils = new WebStorageUtil();
  var bindFigure = function () {
    var radios = document.getElementsByName('figure');
    radios.forEach(function (radio) {
      radio.addEventListener('click', function (event) {
        console.log('event is = ' + event.type);
        document.getElementById('showFigure').innerHTML = 'Your figure is ' + this.value;

        /*
         * If the element bind an event, the element name
         * and its binding event are stored in SessionStorage.
         * When refresh this form page, the binding event of this element will be trigger.
         */
        webStorageUtils.saveEvent(radio.name, event.type);
      });
    });
  };

  var bindSkill = function () {
    var selects = document.getElementsByName('skill');
    selects.forEach(function (select) {
      select.addEventListener('change', function (event) {
        console.log('event is = ' + event.type);
        document.getElementById('showSkill').innerHTML = 'Your skill is ' + this.value;

        webStorageUtils.saveEvent(select.name, event.type);
      });
    });
  };

  bindFigure();
  bindSkill();
  webStorageUtils.saveFormChange('formDiv');
  webStorageUtils.loadFormChange('formDiv');
})();