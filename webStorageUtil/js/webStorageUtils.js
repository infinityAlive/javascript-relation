/**
 * 存入與操作 SessionStorage value
 */
function SessionStorageUtils() {
  var objectSelf = this;
  var isSupportWebStorage;
  if (typeof window.sessionStorage === 'object') {
    try {
      sessionStorage.setItem('test', 'OK');
      isSupportWebStorage = true;
      console.log('*** Browser support web storage, test is ' + sessionStorage.test);
      sessionStorage.removeItem('test');
    } catch (exception) {
      isSupportWebStorage = false;
      console.log('*** this browser do not support web storage');
    }
  } else {
    isSupportWebStorage = false;
    console.log('*** this browser do not support web storage');
  }


  objectSelf.saveSingleValue = function (key, value) {
    if (isSupportWebStorage === true) {
      sessionStorage[key] = value;
    } else {
      CookieUtils.saveCookie(key, value);
    }
  };

  objectSelf.retrieveSingleValue = function (key) {
    if (isSupportWebStorage === true) {
      return sessionStorage[key];
    } else {
      return CookieUtils.retrieveCookie(key);
    }
  };

  objectSelf.saveObj = function (key, valueObj) {
    this.saveSingleValue(key, JSON.stringify(valueObj));
  };

  objectSelf.retrieveObj = function (key) {
    var valueObj = {};
    var value;

    if (isSupportWebStorage === true) {
      value = sessionStorage[key];
    } else {
      value = CookieUtils.retrieveCookie(key);
    }

    if (value) {
      valueObj = JSON.parse(value);
    }

    return valueObj;
  };

  objectSelf.removeObj = function (key) {
    var cookieValue;

    if (isSupportWebStorage === true) {
      if (!sessionStorage)
        sessionStorage.removeItem(key);
    } else {
      cookieValue = CookieUtils.retrieveCookie(key);

      if (!cookieValue) {
        CookieUtils.removeCookie(key);
      }
    }
  };

  objectSelf.removeSingleValue = function (key) {
    if (isSupportWebStorage === true) {
      sessionStorage.removeItem(key);
    } else {
      removeCookie(key);
    }
  }

  objectSelf.removeObjProperties = function (ObjectKey, property) {
    var obj;

    if (isSupportWebStorage === true) {
      obj = JSON.parse(sessionStorage[ObjectKey]);
    } else {
      obj = JSON.parse(CookieUtils.retrieveCookie(ObjectKey));
    }

    if (!obj) {
      if (Array.isArray(property)) {
        property.forEach(function (prop) {
          delete obj[prop];
        });
      } else {
        delete obj[property];
      }
    }

    this.saveObj(ObjectKey, obj);
  };

  objectSelf.saveFormChange = function (id) {
    var formElements = document.querySelectorAll('#' + id
      + ' input, ' + '#' + id + ' select');
    formElements.forEach(function (element) {
      element.addEventListener('change', function () {
        var changeObj = objectSelf.retrieveObj(id);
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

        objectSelf.saveObj(id, changeObj);
      })
    });
  };

  this.loadFormChange = function (id) {
    var changeObj = this.retrieveObj(id);
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
              tiggerEvent(option);
            }
          });
        });
      }
    }
  };

  var tiggerEvent = function (target, eventName) {
    var event;

    if (!eventName)
      return;

    if ("createEvent" in document) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(eventName, false, true);
      target.dispatchEvent(event);
    }
    else {
      event = document.createEventObject();
      target.fireEvent('on' + eventName, event);
    }
  }
};

function CookieUtils(domain) {}

CookieUtils.removeCookie = function (key) {
  CookieUtils.saveCookie(key, '', -1);
};

/**
 * 儲存 cookie
 */
CookieUtils.saveCookie = function (key, value, days, domain) {
  var now, milliseconds, expires, cookieContent;

  if (days) {
    if (days > 0) {
      now = new Date();
      milliseconds = days * 24 * 60 * 60 * 1000;
      now.setTime(now.getTime() + milliseconds);
      expires = now.toGMTString();
    } else {
      expires = 'Thu, 01 Jan 1970 00:00:01 GMT';
    }
  } else {
    expires = '';
  }

  cookieContent = key + '=' + encodeURIComponent(value);
  cookieContent += '; domain=' + domain;
  cookieContent += '; expires=' + expires;
  cookieContent += '; path=/';
  document.cookie = cookieContent;
};

CookieUtils.retrieveCookie = function (key) {
  var arg = key + '=';
  var argLen = arg.length;
  var cookieLen = document.cookie.length;
  var i = 0, j;
  var endString;

  while (i < cookieLen) {
    j = i + argLen;
    if (document.cookie.substring(i, j) == arg) {
      // 獲得 cookie 解碼後的值
      endString = document.cookie.indexOf(";", j);
      if (endString == -1) {
        endString = cookieLen;
      }
      return decodeURIComponent(document.cookie.substring(j, endString));
    }

    i = document.cookie.indexOf(' ', i) + 1;
    if (i == 0) {
      break;
    }
  }
  return null;
};