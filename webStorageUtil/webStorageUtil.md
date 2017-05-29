## WebStorageUtil.js

|                  Web Storage                    |                      Cookie                      |
|:-----------------------------------------------:|:------------------------------------------------:|
|   Only save in the Client side (User's browser) | Will be sent to the Server with user request |
|            Capacity of Storage is _**5mb**_     |                  _**4kb**_                       |

> The best timing of use Web Stoage API is refresh web form page. We can save data of user input or select in Web Stoage. If user refresh web form page, he doesn't input data again. And then, we can replace Cookie with Web Storage to save information.  
  
> Web Storage can save bandwidth of network because it doesn't sent to Server with user request. The difference between SessionStorage and LocalStorage is their **Experation**. When web page or browser is cloesd, the SessionStorage data will disappear. But LocalStorage is permanently stored in browser.  
  
> The following is Functions of WebStorageUtil.js.  
> Functions mainly call **SessionStorage API** to store information in browser,  
> also take the initiative to detect whether the browser has support Web Storage API.  
> If browser is not supported, will change to save by **Cookie**.  
  
  我想使用 Web Storage 的最佳時機點是在儲存表單元素的時候，使用者不用因為不小心手誤按下重整之後，結果資料全部都要重打...當然也可以取代 Cookie 來儲存資料。  

  Web Stoage 不會被附加於使用者請求一起送往 Server，因而節省了網頁頻寬，而 SessionStorage 和 LocalStorage 差異是在 **儲存效期的不同**，SessionStorage 儲存之資料，在關閉分頁和瀏覽器時就會消失；LocalStorage 則是永久儲存在瀏覽器中。  

  以下是 WebStorageUtil.js 的功能，主要是呼叫 **SessionStorage API**將資料儲存於瀏覽器中，也會主動偵測瀏覽器是否有支援 Web Storage API，如果未支援，則會改以 **Cookie** 儲存。  

### WebStorageUtil Function:

#### 1. _saveSingleValue:_  
**parameter: key, value**
> To Use key and value to store in SessionStorage.  
> (Native Web Storage API just use key-value mapping to store)  
>  
> 以 key, value 的 mapping 儲存於 SessionStorage 中。  
> (原生 Web Storage API 就是使用 key, value 的方式儲存)  

* Example:  
`new WebStorageUtil().saveSingleValue('name', 'Yarin');`  

#### 2. _retrieveSingleValue:_  
**parameter: key**  
> Retrieve the value stored in the SessionStorage by key.  
> 取回儲存於 SessionStorage 中，key 所對應的 value。

* Example:  
`new WebStorageUtil().retrieveSingleValue('name');`  
  
#### 3. _saveObj:_  
**parameter: key, valueObj**  
> The valueObj of the corresponding key is an object. It will be converted to JSON format to save in SessionStorage.  
> 與 saveSingleValue 操作方式相同，但是 key 所對應的 valueObj 是一物件，將轉換成 JSON 格式儲存於 SessionStorage 中。

* Example:  
`new WebStorageUtil().saveObj('role', {name: 'Yarin', figure: 'fit'});`  
  
#### 4. _retrieveObj:_  
**parameter: key**  
> If you know the key in the SessionStorage is stored by string of object format, you can call **retrieveObj** function to retrieve the object.  
> 如果知道 key 在 SessionStorage 儲存的是物件格式的字串，便可以呼叫 **retrieveObj** 來取回物件。

* Example:  
`new WebStorageUtil().retrieveObj('role');`  
  
#### 5. _saveEvent:_  
**parameter: eventTargetName, eventType**
> Save binding event of specific element and element name mapping in SessionStorage, when data is put into corresponding element from SessionStorage, The binding event of this element must be trigger.  
> 儲存表單元素與其綁定的事件於 SessionStorage，如果從 SessionStorage 儲存的資料被放進對應的表單元素，則必須觸發此元素所綁定的事件。

#### 6. _removeKey:_  
**parameter: key**  
> Remove specific key in SessionStorage and its corresponding value.  
> 移除 SessionStorage 所儲存的 key 與其對應的 value。

* Example:  
`new WebStorageUtil().removeKey('name');`  
  
#### 7. _removeObjProperties:_  
**parameter: key, properties**  
> Remove one or more object properties stored in the SessionStorage.  
> 移除一至多個儲存在 SessionStorage 的物件 properties。

* Example:  
`var oneRole = {name: 'Yarin', figure: fit, occupation: 'warrior', skill: 'run'};`  
`var webStorageUtils = new WebStorageUtil();`  
`webStorageUtils.saveObj('role', oneRole);`  
`var properties = [figure, skill];`  
`webStorageUtils.removeObjProperties('role', properties);`  
  
#### 8. _saveFormChange:_  
**parameter: id**  
> When the form element in the specific id is triggered by the change event, the contents of this element are put into the object and stored in SessionStorage. Key is id, valueObj is the content of user input or select.  
> 當指定 id 下的表單元素在 change 事件觸發時，會將此元素內容值放進物件，並儲存於 SessionStorage 中。其中 key 為 id，valueObj 為使用者輸入或選擇的內容。

* Example:  
Refer to [index.html](https://github.com/infinityAlive/javascriptRelation/blob/master/webStorageUtil/index.html)  
and [index.js](https://github.com/infinityAlive/javascriptRelation/blob/master/webStorageUtil/js/index.js)  
  
#### 9. _loadFormChange:_  
**parameter: id**  
> If user leaves or refreshes form page and there are contents stored in SessionStorage,
Through **loadFormChange** will put stored contents to the corresponding elements of form one by one.  
> 如果使用者離開或重新整理表單網頁，又 SessionStorage 中有儲存表單內容，透過 **loadFormChange** 會將使用者剛剛輸入的表單內容，一一放回對應的表單元素。

* Example:  
Refer to [index.html](https://github.com/infinityAlive/javascriptRelation/blob/master/webStorageUtil/index.html)  
and [index.js](https://github.com/infinityAlive/javascriptRelation/blob/master/webStorageUtil/js/index.js)  
  
#### 10. _Cookie functions:_  
> Store and read the cookie value by related function, is written in WebStorageUtil.js.  
> 儲存與讀取 Cookie 值的相關 function，也撰寫於 WebStorageUtil.js 中。

* Example:  
`// parameter: key, value, expiration, domain`  
`CookieUtils.saveCookie('name', 'Yarin', '1', 'infinity-fantasy.000webhostapp.com');`  
`CookieUtils.retrieveCookie('name');`  
`CookieUtils.removeCookie('name');`