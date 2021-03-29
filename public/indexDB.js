
let db;
// request for creating new budget database
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
   // create object store called "transaction" and set autoIncrement to true
  const db = event.target.result;
  db.createObjectStore("transactions", { autoIncrement: true });
};

request.onsuccess = function(event) {
  db = event.target.result;
console.log('navigator online = ' + navigator.onLine);
  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function(event) {
  console.log("semething went wrong!!" + event.target.errorCode);
};

function saveRecord(record) {
  // create a transaction on the transaction db with readwrite access
  const transaction = db.transaction(["transactions"], "readwrite");

  // access your transaction object store
  const store = transaction.objectStore("transactions");
console.log(record);
  // add record to your store with add method.
  store.add(record);
}

function checkDatabase() {
  // open a transaction on your transactions
  const transaction = db.transaction(["transactions"], "readwrite");
  // access your transaction object store
  const store = transaction.objectStore("transactions");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(() => {
        // if successful, open a transaction on your transactions (store/collection)
        const transaction = db.transaction(["transactions"], "readwrite");

        // access your transactions object store
        const store = transaction.objectStore("transactions");

        // clear all items in your store
        store.clear();
      });
    }
  };
}

// listen for app coming back online
window.addEventListener("online", checkDatabase);

window.addEventListener("offline", (event) => {
  console.log("your app is offline");
})

