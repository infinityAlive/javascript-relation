## WebStorageUtil.js

|              Web Storage           |            Cookie                  |
|:----------------------------------:|:----------------------------------:|
|   只會存在 Client 端 (使用者的瀏覽器) | 會隨著使用者 request 送至 Server 端  |
|              儲存容量 5mb           |               4kb                  |

※ Web Stoage 因為不會被附加於使用者請求中，一起送往 Server，所以會節省網頁頻寬

※ 而 SessionStorage 和 LocalStorage 差異則是 **儲存效期不同**，  
SessionStorage 儲存之資料，在關閉分頁和瀏覽器時就會消失；  
LocalStorage 則是永久儲存在瀏覽器中。

以下是 WebStorageUtil.js 的主要功能，主要是呼叫 SessionStorage API  
幫我們儲存資料於瀏覽器中，也會主動偵測瀏覽器是否有支援 Web Storage API，  
如果未支援，則會改以 Cookie 儲存。  

### WebStorageUtil Function:

#### 1. _saveSingleValue:_  
**參數：key, value**  
> GG
> YY  
以 key, value 的 mapping 儲存於 SessionStorage 中。  
(原生 Web Storage API 就是使用 key, value 的方式儲存)  

* Example:  
`new WebStorageUtil().saveSingleValue('name', 'Yarin');`  

#### 2. _retrieveSingleValue:_  
**參數：key**  
取回儲存於 SessionStorage 中，key 所對應的 value。

* Example:  
`new WebStorageUtil().retrieveSingleValue('name');`  
  
#### 3. _saveObj:_  
**參數：key, valueObj**  
與 saveSingleValue 操作方式相同，但是 key 所對應的 valueObj 是一物件，並轉換成 JSON 格式儲存。

* Example:  
`new WebStorageUtil().saveObj('role', {name: 'Yarin', figure: 'fit'});`  
  
#### 4. _retrieveObj:_  
**參數：key**  
如果知道 key 在 SessionStorage 儲存的是物件格式的字串，便可以呼叫此 function 來取回物件。

* Example:  
`new WebStorageUtil().retrieveObj('role');`  
  
#### 5. _removeKey:_  
**參數：key**  
移除 SessionStorage 所儲存的 key 與其對應的 value。

* Example:  
`new WebStorageUtil().removeKey('name');`  
  
#### 6. _removeObjProperties:_  
**參數：key, properties**  
移除一至多個 SessionStorage 儲存之物件的某些 properties。

* Example:  
`var oneRole = {name: 'Yarin', figure: fit, occupation: 'warrior', skill: 'run'};`  
`var webStorageUtils = new WebStorageUtil();`  
`webStorageUtils.saveObj('role', oneRole);`  
`var properties = [figure, skill];`  
`webStorageUtils.removeObjProperties('role', properties);`  
  
#### 7. _saveFormChange:_  
**參數：id**  
當指定 id 下的表單元素在 change 事件觸發時，會將此元素內容值放進物件，  
並儲存至 SessionStorage 中，key 為 id，valueObj 為使用者輸入與選擇的內容。

* Example:  
參考[index.html](https://github.com/infinityAlive/javascriptRelation/blob/master/webStorageUtil/index.html)  
與 [index.js](https://github.com/infinityAlive/javascriptRelation/blob/master/webStorageUtil/index.js)  
  
#### 8. _loadFormChange:_  
**參數：id**  
如果使用者離開了頁面或重新整理，如果 SessionStorage 中有儲存表單內容，  
透過此 function 會將使用者剛剛輸入的表單內容，一一放回對應的表單元素。

* Example:  
參考[index.html](https://github.com/infinityAlive/javascriptRelation/blob/master/webStorageUtil/index.html  
與 [index.js](https://github.com/infinityAlive/javascriptRelation/blob/master/webStorageUtil/index.js)  
  
#### 9. _其他：_  
儲存與讀取 Cookie 值的相關 function，也撰寫於 WebStorageUtil.js 中。

* Example:  
`// 參數：key, value, 效期, 網域`  
`CookieUtils.saveCookie('name', 'Yarin', '1', 'infinity-fantasy.000webhostapp.com');`  
`CookieUtils.retrieveCookie('name');`  
`CookieUtils.removeCookie('name');`