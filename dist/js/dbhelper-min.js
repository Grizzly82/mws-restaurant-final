const DB_NAME="restaurantsDB",DB_TABLE_NAME="restaurants_table",DB_VERSION=2,PORT=1337;class DBHelper{static idbDatabase(){return navigator.serviceWorker?idb.open("mws-restaurant",DB_VERSION,e=>{e.createObjectStore("restaurantDb",{keyPath:"id"}).createIndex("id","id")}):Promise.resolve}static get DATABASE_URL(){return`http://localhost:${PORT}/restaurants`}static handleErrors(e){return e.ok||DBHelper.idbDatabase().then(t=>{if(!t)throw Error(e.statusText);let r=t.transaction("restaurantDb","readwrite").objectStore("restaurantDb");if(r.getAll()<=0)throw Error(e.statusText);return r.getAll()}),e.json()}static fetchRestaurants(e){return fetch(this.DATABASE_URL).then(this.handleErrors).then(t=>{const r=t;DBHelper.idbDatabase().then(e=>{if(!e)return;let t=e.transaction("restaurantDb","readwrite").objectStore("restaurantDb");r.forEach(function(e){t.put(e)});t.index("id").openCursor(null,"prev").then(function(e){return e.advance(30)}).then(function e(t){if(t)return t.delete(),t.continue().then(e)});return t.getAll()}).then(t=>(e(null,t),t))}).catch(e=>console.log(e))}static fetchRestaurantById(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.find(t=>t.id==e);r?t(null,r):t("Restaurant does not exist",null)}})}static fetchRestaurantByCuisine(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.filter(t=>t.cuisine_type==e);t(null,r)}})}static fetchRestaurantByNeighborhood(e,t){DBHelper.fetchRestaurants((r,n)=>{if(r)t(r,null);else{const r=n.filter(t=>t.neighborhood==e);t(null,r)}})}static fetchRestaurantByCuisineAndNeighborhood(e,t,r){DBHelper.fetchRestaurants((n,a)=>{if(n)r(n,null);else{let n=a;"all"!=e&&(n=n.filter(t=>t.cuisine_type==e)),"all"!=t&&(n=n.filter(e=>e.neighborhood==t)),r(null,n)}})}static fetchNeighborhoods(e){DBHelper.fetchRestaurants((t,r)=>{if(t)e(t,null);else{const t=r.map((e,t)=>r[t].neighborhood),n=t.filter((e,r)=>t.indexOf(e)==r);e(null,n)}})}static fetchCuisines(e){DBHelper.fetchRestaurants((t,r)=>{if(t)e(t,null);else{const t=r.map((e,t)=>r[t].cuisine_type),n=t.filter((e,r)=>t.indexOf(e)==r);e(null,n)}})}static urlForRestaurant(e){return`./restaurant.html?id=${e.id}`}static imageUrlForRestaurant(e){return e.photograph?`/img/${e.photograph}.jpg`:`/img/${e.id}.jpg`}static altUrlforRestaurant(e){return e.alt}static addReview(e){let t={name:"addReview",data:e,object_type:"review"};if(!navigator.onLine&&"addReview"===t.name)return void DBHelper.sendDataWhenOnline(t);let r={name:e.name,rating:parseInt(e.rating),comments:e.comments,restaurant_id:parseInt(e.restaurant_id)};console.log("Sending review: ",r);var n={method:"POST",body:JSON.stringify(r),headers:new Headers({"Content-Type":"application/json"})};fetch(`http://localhost:${PORT}/reviews`,n).then(e=>{const t=e.headers.get("content-type");return t&&-1!==t.indexOf("application/json")?e.json():"API call successfull"}).then(e=>{console.log("Fetch successful!")}).catch(e=>console.log("error:",e))}static sendDataWhenOnline(e){console.log("Offline OBJ",e),localStorage.setItem("data",JSON.stringify(e.data)),console.log(`Local Storage: ${e.object_type} stored`),window.addEventListener("online",t=>{console.log("Browser: Online again!");let r=JSON.parse(localStorage.getItem("data"));console.log("updating and cleaning ui"),[...document.querySelectorAll(".reviews_offline")].forEach(e=>{e.classList.remove("reviews_offline"),e.querySelector(".offline_label").remove()}),null!==r&&(console.log(r),"addReview"===e.name&&DBHelper.addReview(e.data),console.log("LocalState: data sent to api"),localStorage.removeItem("data"),console.log(`Local Storage: ${e.object_type} removed`))})}static updateFavStatus(e,t){console.log("changing status to: ",t),fetch(`http://localhost:${PORT}/restaurants/${e}/?is_favorite=${t}`,{method:"PUT"}).then(()=>{console.log("changed"),this.dbPromise().then(r=>{const n=r.transaction("restaurants","readwrite").objectStore("restaurants");n.get(e).then(e=>{e.is_favorite=t,n.put(e)})})})}static storeIndexedDB(e,t){this.dbPromise.then(function(r){if(!r)return;const n=r.transaction(e,"readwrite").objectStore(e);Array.isArray(t)?t.forEach(function(e){n.put(e)}):n.put(t)})}static getStoredObjectById(e,t,r){return this.dbPromise().then(function(n){if(!n)return;return n.transaction(e).objectStore(e).index(t).getAll(r)})}static fetchReviewsByRestId(e){return fetch(`${DBHelper.DATABASE_URL}reviews/?restaurant_id=${e}`).then(e=>e.json()).then(e=>(this.dbPromise().then(t=>{if(!t)return;const r=t.transaction("reviews","readwrite").objectStore("reviews");Array.isArray(e)?e.forEach(function(e){r.put(e)}):r.put(e)}),console.log("revs are: ",e),Promise.resolve(e))).catch(t=>DBHelper.getStoredObjectById("reviews","restaurant",e).then(e=>(console.log("looking for offline stored reviews"),Promise.resolve(e))))}static mapMarkerForRestaurant(e,t){const r=new google.maps.Marker({position:e.latlng,title:e.name,url:DBHelper.urlForRestaurant(e),map:t,animation:google.maps.Animation.DROP});return r.tabindex=-1,r}}