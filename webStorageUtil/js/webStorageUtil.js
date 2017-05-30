/**
 * 存入與操作 SessionStorage value
 */
function WebStorageUtil() {
  var objSelf = this;
  var isSupportWebStorage;
  if (typeof window.sessionStorage === 'object') {
    try {
      sessionStorage.setItem('test', 'OK');
      isSupportWebStorage = true;
      console.log('*** Browser support web storage, test is ' + sessionStorage.test);
      sessionStorage.removeItem('test');
    } catch (exception) {
      isSupportWebStorage = false;
      console.log('*** this browser does not support Web Storage API');
    }
  } else {
    isSupportWebStorage = false;
    console.log('*** this browser does not support Web Storage API');
  }

  /**
   * To Use key and value to store in SessionStorage.
   */
  objSelf.saveSingleValue = function (key, value) {
    if (isSupportWebStorage === true) {
      sessionStorage[key] = value;
    } else {
      CookieUtils.saveCookie(key, value);
    }
  };

  /**
   * Retrieve the value stored in the SessionStorage by key.
   */
  objSelf.retrieveSingleValue = function (key) {
    if (isSupportWebStorage === true) {
      return sessionStorage[key];
    } else {
      return CookieUtils.retrieveCookie(key);
    }
  };

  /**
   * The valueObj of the corresponding key is an object.
   * It will be converted to JSON format to save in SessionStorage.
   */
  objSelf.saveObj = function (key, valueObj) {
    if (typeof valueObj === 'object') {
      objSelf.saveSingleValue(key, JSON.stringify(valueObj));
    } else {
      console.log('valueObj is not an object');
    }
  };

  /**
   * Retrieve the object stored in the SessionStorage by key.
   */
  objSelf.retrieveObj = function (key) {
    var valueObj = {};
    var value;

    if (isSupportWebStorage === true) {
      value = sessionStorage[key];
    } else {
      value = CookieUtils.retrieveCookie(key);
    }

    if (value) {
      valueObj = JSON.parse(value);

      if (typeof valueObj !== 'object') {
        console.log('valueObj is not an object');
      }
    }

    return valueObj;
  };

  /**
   * Save binding event of specific element in SessionStorage,
   * When this element put data from SessionStorage,
   * The binding event of this element must be trigger.
   */
  objSelf.saveEvent = function (eventTargetName, eventType) {
    if (!objSelf.retrieveSingleValue(eventTargetName + '_event'))
      objSelf.saveSingleValue(eventTargetName + '_event', eventType)
  };

  /**
   * Remove specific key in SessionStorage and its corresponding value.
   */
  objSelf.removeKey = function (key) {
    if (isSupportWebStorage === true) {
      sessionStorage.removeItem(key);
    } else {
      CookieUtils.removeCookie(key);
    }
  }

  /**
   * Remove one or more object properties stored in the SessionStorage.
   */
  objSelf.removeObjProperties = function (key, properties) {
    var valueObj;

    if (isSupportWebStorage === true) {
      valueObj = JSON.parse(sessionStorage[key]);
    } else {
      valueObj = JSON.parse(CookieUtils.retrieveCookie(key));
    }

    if (!valueObj && typeof valueObj === 'object') {
      if (Array.isArray(properties)) {
        properties.forEach(function (prop) {
          delete valueObj[prop];
        });
      } else {
        delete valueObj[properties];
      }
    }

    objSelf.saveObj(key, valueObj);
  };

  /**
   * When the form element in the specific id is triggered by the change event,
   * the contents of this element are put into the object and stored in SessionStorage.
   * Key is id, valueObj is the content of user input or select.
   */
  objSelf.saveFormChange = function (id) {
    var formElements = document.querySelectorAll('#' + id
      + ' input, ' + '#' + id + ' select');
    formElements.forEach(function (element) {
      element.addEventListener('change', function () {
        var changeObj = objSelf.retrieveObj(id);
        if (!changeObj) {
          changeObj = {};
        }
        if (element.type === 'checkbox' && element.checked === true) {
          var checkBoxValues;
          if (changeObj[element.name]) {
            checkBoxValues = changeObj[element.name];
          } else
            checkBoxValues = [];

          checkBoxValues.push(element.value);
          changeObj[element.name] = checkBoxValues;
        } else {
          changeObj[element.name] = element.value;
        }

        objSelf.saveObj(id, changeObj);
      })
    });
  };

  /**
   * Put stored contents to the corresponding elements of form one by one.
   */
  objSelf.loadFormChange = function (id) {
    var changeObj = objSelf.retrieveObj(id);
    var elementName, saveElementValue;

    if (!changeObj)
      return;

    for (elementName in changeObj) {
      saveElementValue = changeObj[elementName];
      var isInputMatch = false;
      var inputs = document.querySelectorAll('#' + id + ' input');
      var selects = document.querySelectorAll('#' + id + ' select');

      inputs.forEach(function (input) {
        if (input.name === elementName) {
          if (input.type === 'checkbox') {
            if (Array.isArray(saveElementValue) && saveElementValue.includes(input.value)) {
              input.checked = true;
              tiggerEvent(input);
            }
          } else if (input.type === 'radio') {
            if (input.value === saveElementValue) {
              input.checked = true;
              tiggerEvent(input);
            }
          } else {
            input.value = saveElementValue;
          }

          isInputMatch = true;
        }
      });

      if (!isInputMatch && selects) {
        selects.forEach(function (select) {
          select.querySelectorAll('option').forEach(function (option) {
            if (option.value === saveElementValue) {
              option.selected = true;
              tiggerEvent(select);
            }
          });
        });
      }
    }
  };

  /**
   * When load SessionStorage obj value to put in elements of checkbox, radio or select,
   * if above elements bind an event, this function will be call to trigger event.
   */
  var tiggerEvent = function (target) {
    var event;
    var canBubble, canPreventDefault;
    var eventType = objSelf.retrieveSingleValue(target.name + '_event');
    if (!eventType)
      return;

    if ("createEvent" in document) {
      canBubble = false, canPreventDefault = true;
      event = document.createEvent("HTMLEvents");
      event.initEvent(eventType, canBubble, canPreventDefault);
      target.dispatchEvent(event);
    }
    else {
      event = document.createEventObject();
      target.fireEvent('on' + eventType, event);
    }
  }
};

/**
 * Operation of Cookie
 */
function CookieUtils(domain) {
}

/**
 * Save key-value mapping by cookie
 */
CookieUtils.saveCookie = function (key, value, days, domain) {
  var now, milliseconds, expires, cookieContent;

  if (days) {
    if (days > 0) {
      now = new Date();
      milliseconds = days * 24 * 60 * 60 * 1000;
      now.setTime(now.getTime() + milliseconds);
      expires = now.toUTCString();
    } else {
      expires = 'Thu, 01 Jan 1970 00:00:01 UTC';
    }
  } else {
    expires = '';
  }

  /*
   * The encodeURIComponent function converts the passed string to UTF-8 encoding.
   */
  cookieContent = key + '=' + encodeURIComponent(value);
  cookieContent += '; domain=' + domain;
  cookieContent += '; expires=' + expires;
  cookieContent += '; path=/';
  document.cookie = cookieContent;
};

/**
 * Retrieve cookie value of specific key
 */
CookieUtils.retrieveCookie = function (key) {
  var matches = document.cookie.match(new RegExp('(^| )' + key + '=([^;]+)'));
  if (matches)
    return decodeURIComponent(matches[2]);

  return null;
}

/**
 * remove key-value in cookie
 */
CookieUtils.removeCookie = function (key) {
  CookieUtils.saveCookie(key, '', -1);
};