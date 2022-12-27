// Handle storage in memory
Storage.prototype.setObjectItem = function setObjectItem(key, value) {
  const obj = JSON.stringify(value);
  this.setItem(key, obj);
};
Storage.prototype.getObjectItem = function getObjectItem(key) {
  return JSON.parse(this.getItem(key));
};
