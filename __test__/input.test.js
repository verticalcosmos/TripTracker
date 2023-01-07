import Trip from '../src/client/js/tripModel.js'

describe('Trip model', () => {
    it('A trip instance should be created', () => {
        const newTrip = new Trip('city', 'country', 12, 13, {});
        expect(newTrip.country).toEqual('country');
    });
})
