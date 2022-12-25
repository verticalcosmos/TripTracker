// Add setObjectItem method to the storage that adds object types.
Storage.prototype.setObjectItem = function setObjectItem(key, value) {
  const obj = JSON.stringify(value);
  this.setItem(key, obj);
};

// Add getObjectItem method to the storage that gets object types.
Storage.prototype.getObjectItem = function getObjectItem(key) {
  return JSON.parse(this.getItem(key));
};
