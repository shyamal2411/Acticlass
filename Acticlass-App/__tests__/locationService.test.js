import locationService from '../src/services/locationService';
 
describe('locationService', () => {
 
  describe('distance', () => {
    it('should calculate distance between two locations', () => {
    /**
     *
     * @typedef {Object} Location
     * @property {number} lat
     * @property {number} long
     * @type {Location} 
     * */
    const location1 = { lat: 44.649229494725915, long: -63.60041489865453 };
      const location2 = { lat: 44.64946346273278, long: -63.59962364692803 };
      const distance = locationService.distance(location1, location2);
      expect(distance).toBeCloseTo(67, -2);
    });
  });
 
 
});