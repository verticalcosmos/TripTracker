class Trip {
    constructor(city, country, longitude, lattitude, createdAt) {
      this.city = city;
      this.country = country;
      this.longitude = longitude;
      this.lattitude = lattitude;
      this.createdAt = createdAt;
    }
  
    remove() {
      // old arrayOfTrips.
      const arrayOfTrips = localStorage.getObjectItem('trips');
      // remove the obj from the array.
      // eslint-disable-next-line consistent-return
      arrayOfTrips.forEach((trip, i) => {
        if (trip.city === this.city) {
          return arrayOfTrips.splice(i, 1);
        }
      });
      // update localStorage with the new arrayOfTrips.
      localStorage.setObjectItem('trips', arrayOfTrips);
    }
  }
  export default Trip;