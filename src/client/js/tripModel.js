class Trip {
    constructor(city, country, longitude, lattitude, createdAt) {
      this.city = city;
      this.country = country;
      this.longitude = longitude;
      this.lattitude = lattitude;
      this.createdAt = createdAt;
    }
  
    remove() {
      const arrayOfTrips = localStorage.getObjectItem('trips');
      arrayOfTrips.forEach((trip, i) => {
        if (trip.city === this.city) {
          return arrayOfTrips.splice(i, 1);
        }
      });
      localStorage.setObjectItem('trips', arrayOfTrips);
    }
  }
  export default Trip;
