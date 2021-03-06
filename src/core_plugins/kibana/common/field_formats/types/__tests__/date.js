import expect from 'expect.js';
import moment from 'moment-timezone';
import { DateFormat } from '../date';

describe('Date Format', function () {
  let convert;
  let mockConfig;

  beforeEach(function () {
    mockConfig = {};
    mockConfig.dateFormat = 'MMMM Do YYYY, HH:mm:ss.SSS';
    mockConfig['dateFormat:tz'] = 'Browser';
    const getConfig = (key) => mockConfig[key];

    const date = new DateFormat({}, getConfig);

    convert = date.convert.bind(date);
  });

  it('decoding an undefined or null date should return an empty string', function () {
    expect(convert(null)).to.be('-');
    expect(convert(undefined)).to.be('-');
  });

  it('should clear the memoization cache after changing the date', function () {
    function setDefaultTimezone() {
      moment.tz.setDefault(mockConfig['dateFormat:tz']);
    }
    const time = 1445027693942;

    mockConfig['dateFormat:tz'] = 'America/Chicago';
    setDefaultTimezone();
    const chicagoTime = convert(time);

    mockConfig['dateFormat:tz'] = 'America/Phoenix';
    setDefaultTimezone();
    const phoenixTime = convert(time);

    expect(chicagoTime).not.to.equal(phoenixTime);
  });

  it('should parse date math values', function () {
    expect(convert('2015-01-01||+1M/d')).to.be('January 1st 2015, 00:00:00.000');
  });
});
