#### Web Storage

|              Web Storage           |            Cookie                  |
|:----------------------------------:|-----------------------------------:|
|   只會存在 Client 端 (使用者的瀏覽器) |  會隨著使用者 request 送至 Server 端  |
|              儲存容量 5mb           |               4kb                  |

※ Web Stoage 因為不會被附加於使用者請求中，一起送往 Server，所以會節省網頁頻寬

※ 而 SessionStorage 和 LocalStorage 差異則是 **儲存效期不同**，
SessionStorage 儲存之資料，在關閉分頁和瀏覽器時就會消失；
LocalStorage 是永久儲存在瀏覽器中。