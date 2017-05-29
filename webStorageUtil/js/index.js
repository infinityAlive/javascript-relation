(function processForm() {
  var webStorageUtils = new WebStorageUtil();
  webStorageUtils.saveFormChange('formDiv');
  webStorageUtils.loadFormChange('formDiv');
})();