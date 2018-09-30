

	const DB_NAME = 'restaurantsDB';
	const DB_TABLE_NAME = 'restaurants_table';
	const DB_VERSION = 2;
	const PORT = 1337;


/**
 * Common database helper functions.
 */
class DBHelper {

  static idbDatabase() {
    if (!navigator.serviceWorker) {
      return Promise.resolve;
    }
    return idb.open('mws-restaurant', DB_VERSION, (upgradeDB) => {
      let restaurantDb = upgradeDB.createObjectStore('restaurantDb', {
        keyPath: 'id'
      });
      restaurantDb.createIndex('id', 'id');
    });
  };



  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    //const port = 8080 // Change this to your server port
    const url = `http://localhost:${PORT}/restaurants`;

    return url;
  }

  /**
   * Fetch all restaurants.
   */

  static handleErrors(response) {
    // If Network failed
    if (!response.ok) {
      // Open Database and get url reference from idb
      DBHelper.idbDatabase().then((db) => {
        if (!db) throw Error(response.statusText);
        let tx = db.transaction('restaurantDb', 'readwrite');
        let store = tx.objectStore('restaurantDb');
        if (store.getAll() <= 0) {
          throw Error(response.statusText);
        }
        return store.getAll();
      });
    }
    return response.json();
  }


  static fetchRestaurants(callback) {
    return fetch(this.DATABASE_URL)
      .then(this.handleErrors)
      .then(res => {
        const restaurants = res;

        // Store Fetched Request in idb
        DBHelper.idbDatabase().then((db) => {
          if (!db) return;
          let tx = db.transaction('restaurantDb', 'readwrite');
          let store = tx.objectStore('restaurantDb');
          restaurants.forEach(function(restaurant) {
            store.put(restaurant);
          });
          // limit store to 30 items
          let data = store.index('id').openCursor(null, "prev").then(function(cursor) {
            return cursor.advance(30);
          }).then(function deleteRest(cursor) {
            if (!cursor) return;
            cursor.delete();
            return cursor.continue().then(deleteRest);
          });

          return store.getAll(); // Return Stored Data
        }).then(restaurants => {
          callback(null, restaurants);
          return restaurants;
        });
      })
      .catch(err => console.log(err))
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        const restaurant = restaurants.find(r => r.id == id);
        if (restaurant) { // Got the restaurant
          callback(null, restaurant);
        } else { // Restaurant does not exist in the database
          callback('Restaurant does not exist', null);
        }
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood)
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i)
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type)
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i)
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

	/* Restaurant image URL.
	*/
	 static imageUrlForRestaurant(restaurant) {
		 if (restaurant.photograph){
			 return (`/img/${restaurant.photograph}.jpg`);
		 }
		 else{
			 return (`/img/${restaurant.id}.jpg`);
		 }
 }
 
	 /** Cris Code for Alt text */
	 static altUrlforRestaurant(restaurant){
	 return(restaurant.alt);
   }
   



   static addReview(review) {
    let offline_obj = {
      name: 'addReview',
      data: review,
      object_type: 'review'
    };
    // Check if online
    if (!navigator.onLine && (offline_obj.name === 'addReview')) {
      DBHelper.sendDataWhenOnline(offline_obj);
      return;
    }
    let reviewSend = {
      "name": review.name,
      "rating": parseInt(review.rating),
      "comments": review.comments,
      "restaurant_id": parseInt(review.restaurant_id)
    };
    console.log('Sending review: ', reviewSend);
    var fetch_options = {
      method: 'POST',
      body: JSON.stringify(reviewSend),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    };
    fetch(`http://localhost:${PORT}/reviews`, fetch_options).then((response) => {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        return response.json();
      } else { return 'API call successfull'}})
    .then((data) => {console.log(`Fetch successful!`)})
    .catch(error => console.log('error:', error));
  }



  static sendDataWhenOnline(offline_obj) {
    console.log('Offline OBJ', offline_obj);
    localStorage.setItem('data', JSON.stringify(offline_obj.data));
    console.log(`Local Storage: ${offline_obj.object_type} stored`);
    window.addEventListener('online', (event) => {
      console.log('Browser: Online again!');
      let data = JSON.parse(localStorage.getItem('data'));
      console.log('updating and cleaning ui');
      [...document.querySelectorAll(".reviews_offline")]
      .forEach(el => {
        el.classList.remove("reviews_offline")
        el.querySelector(".offline_label").remove()
      });
      if (data !== null) {
        console.log(data);
        if (offline_obj.name === 'addReview') {
          DBHelper.addReview(offline_obj.data);
        }

        console.log('LocalState: data sent to api');

        localStorage.removeItem('data');
        console.log(`Local Storage: ${offline_obj.object_type} removed`);
      }
    });
  }


  static updateFavStatus(restaurantId, isFav) {
    console.log('changing status to: ', isFav);

    fetch(`http://localhost:${PORT}/restaurants/${restaurantId}/?is_favorite=${isFav}`, {
        method: 'PUT'
      })
      .then(() => {
        console.log('changed');
        this.dbPromise()
          .then(db => {
            const tx = db.transaction('restaurants', 'readwrite');
            const restaurantsStore = tx.objectStore('restaurants');
            restaurantsStore.get(restaurantId)
              .then(restaurant => {
                restaurant.is_favorite = isFav;
                restaurantsStore.put(restaurant);
              });
          })
      })

  }


  /**
   * Fetch all reviews.
   */

  static storeIndexedDB(table, objects) {
    this.dbPromise.then(function(db) {
      if (!db) return;

      let tx = db.transaction(table, 'readwrite');
      const store = tx.objectStore(table);
      if (Array.isArray(objects)) {
        objects.forEach(function(object) {
          store.put(object);
        });
      } else {
        store.put(objects);
      }
    });
  }

  static getStoredObjectById(table, idx, id) {
    return this.dbPromise()
      .then(function(db) {
        if (!db) return;

        const store = db.transaction(table).objectStore(table);
        const indexId = store.index(idx);
        return indexId.getAll(id);
      });
  }

  static fetchReviewsByRestId(id) {
    return fetch(`${DBHelper.DATABASE_URL}reviews/?restaurant_id=${id}`)
      .then(response => response.json())
      .then(reviews => {
        this.dbPromise()
          .then(db => {
            if (!db) return;

            let tx = db.transaction('reviews', 'readwrite');
            const store = tx.objectStore('reviews');
            if (Array.isArray(reviews)) {
              reviews.forEach(function(review) {
                store.put(review);
              });
            } else {
              store.put(reviews);
            }
          });
        console.log('revs are: ', reviews);
        return Promise.resolve(reviews);
      })
      .catch(error => {
        return DBHelper.getStoredObjectById('reviews', 'restaurant', id)
          .then((storedReviews) => {
            console.log('looking for offline stored reviews');
            return Promise.resolve(storedReviews);
          })
      });
  }




 
  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    marker.tabindex = -1;
    return marker;
  }

}

