global.fetch = require('jest-fetch-mock');

import fetchLocation from '../src/client/views/page-trips/js/fetchLocation';

beforeEach(() => {
    fetch.resetMocks();
});

describe('Test the fetch', () => {
    it('it should return country name', async () => {
        fetch.mockResponseOnce(JSON.stringify({
            result: [
                {
                    name: 'Rome',
                    countryName: 'Italy',
                }],
        }));
        const res = await fetchLocation();
        expect(res).toEqual({result: [{name: 'Rome', countryName: 'Italy'}]});
        expect(fetch.mock.calls.length).toEqual(1);
    })
})
