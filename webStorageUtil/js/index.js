(function processForm() {

  var sessionStorageUtils = new SessionStorageUtils();
  sessionStorageUtils.saveFormChange('formDiv');
  sessionStorageUtils.loadFormChange('formDiv');
})();