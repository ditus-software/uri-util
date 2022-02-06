//
// Copyright (c) DITUS INC. All rights reserved. See LICENSE file in the project
// root for details.
//
import UriUtil from './uri-util';

describe('UriUtil', () => {
  describe('appendForwardSlash', () => {
    it('returns a forward slash when the uri is null, undefined, an empty string, or white space.', () => {
      expect(UriUtil.appendForwardSlash(null)).toBe('/');
      expect(UriUtil.appendForwardSlash(undefined)).toBe('/');
      expect(UriUtil.appendForwardSlash('')).toBe('/');
      expect(UriUtil.appendForwardSlash(' ')).toBe('/');
    });

    it('appends a forward slash when the uri contains a value and does not already end with a forward slash.', () => {
      expect(UriUtil.appendForwardSlash('abc')).toBe('abc/');
    });

    it('does not append a forward slash when the uri contains a value and already ends with a forward slash.', () => {
      expect(UriUtil.appendForwardSlash('abc/')).toBe('abc/');
    });
  });

  describe('combine', () => {
    it('returns null if both values are null, whitespace, empty string, or undefined.', () => {
      expect(UriUtil.combine(null, null)).toBeNull();
      expect(UriUtil.combine(null, undefined)).toBeNull();
      expect(UriUtil.combine(undefined, null)).toBeNull();
      expect(UriUtil.combine(undefined, undefined)).toBeNull();
      expect(UriUtil.combine(null, '')).toBeNull();
      expect(UriUtil.combine('', null)).toBeNull();
      expect(UriUtil.combine(undefined, '')).toBeNull();
      expect(UriUtil.combine('', undefined)).toBeNull();
      expect(UriUtil.combine('', '')).toBeNull();
      expect(UriUtil.combine(null, ' ')).toBeNull();
      expect(UriUtil.combine(' ', null)).toBeNull();
      expect(UriUtil.combine(undefined, ' ')).toBeNull();
      expect(UriUtil.combine(' ', undefined)).toBeNull();
      expect(UriUtil.combine('', ' ')).toBeNull();
      expect(UriUtil.combine(' ', '')).toBeNull();
      expect(UriUtil.combine(' ', ' ')).toBeNull();
    });

    it('returns the first value without an ending backslash if the second value is not specified.', () => {
      expect(UriUtil.combine('apple', null)).toBe('apple');
    });

    it('returns the first value with the ending backslash removed if it has one and if the second value is not specified.', () => {
      expect(UriUtil.combine('apple/', null)).toBe('apple');
    });

    it('returns the second value without a preceding backslash if the first value is not specified.', () => {
      expect(UriUtil.combine(null, 'apple')).toBe('apple');
    });

    it('returns the second value with the preceding backslash removed if it has one and if the first value is not specified.', () => {
      expect(UriUtil.combine(null, '/apple')).toBe('apple');
    });

    it('returns the first and second value separated by a backslash.', () => {
      expect(UriUtil.combine('pear', 'apple')).toBe('pear/apple');
    });

    it('returns the first and second value separated by a backslash, removing any backslash from the end of the first value.', () => {
      expect(UriUtil.combine('pear/', 'apple')).toBe('pear/apple');
    });

    it('returns the first and second value separated by a backslash, removing any backslash from the start of the second value.', () => {
      expect(UriUtil.combine('pear', '/apple')).toBe('pear/apple');
    });

    it('returns the first and second value separated by a backslash, removing any backslash from the end of the first value and start of the second value.', () => {
      expect(UriUtil.combine('pear/', '/apple')).toBe('pear/apple');
    });
  });

  describe('getDomainName', () => {
    it('returns null when uri is null, undefined, an empty string, or white space.', () => {
      expect(UriUtil.getDomainName(null)).toBeNull();
      expect(UriUtil.getDomainName(undefined)).toBeNull();
      expect(UriUtil.getDomainName('')).toBeNull();
      expect(UriUtil.getDomainName(' ')).toBeNull();
    });

    it('returns the domain name without the protocol when the protocol is not SSL.', () => {
      expect(UriUtil.getDomainName('http://any.org')).toBe('any.org');
    });

    it('returns the domain name without the protocol when the protocol is SSL.', () => {
      expect(UriUtil.getDomainName('https://any.org')).toBe('any.org');
    });

    it('returns the domain name when there is no protocol.', () => {
      expect(UriUtil.getDomainName('any.org')).toBe('any.org');
    });

    it('returns the domain name without the port.', () => {
      expect(UriUtil.getDomainName('https://any.org:123')).toBe('any.org');
    });

    it('returns the domain name without a www prefix.', () => {
      expect(UriUtil.getDomainName('www.any.org')).toBe('any.org');
    });

    it('returns the domain name without the sub-domain.', () => {
      expect(UriUtil.getDomainName('hello.any.org')).toBe('any.org');
    });

    it('returns the domain name when it only consists of a single word.', () => {
      expect(UriUtil.getDomainName('localhost')).toBe('localhost');
    });

    it('returns the domain name without sub-paths.', () => {
      expect(UriUtil.getDomainName('https://www.any.org/this/is/not/returned')).toBe('any.org');
    });

    it('returns the domain name without a question mark at the end.', () => {
      expect(UriUtil.getDomainName('https://www.any.org?')).toBe('any.org');
      expect(UriUtil.getDomainName('https://www.any.org/?')).toBe('any.org');
    });

    it('returns the domain name without any query string.', () => {
      expect(UriUtil.getDomainName('https://www.any.org?first=name&last=name')).toBe('any.org');
    });
  });

  describe('parseIntParameter', () => {
    it('returns the default value when the value is null, undefined, an empty string, or white space.', () => {
      expect(UriUtil.parseIntParameter(null, 1, 999, 123)).toBe(123);
      expect(UriUtil.parseIntParameter(undefined, 1, 999, 123)).toBe(123);
      expect(UriUtil.parseIntParameter('', 1, 999, 123)).toBe(123);
      expect(UriUtil.parseIntParameter('   ', 1, 999, 123)).toBe(123);
    });

    it('returns the default value when the value is not a number.', () => {
      expect(UriUtil.parseIntParameter('hello', 1, 999, 123)).toBe(123);
    });

    it('returns the default value when the value is not an integer.', () => {
      expect(UriUtil.parseIntParameter('1.5', 1, 999, 123)).toBe(123);
    });

    it('returns the default value when the value is less than the minimum.', () => {
      expect(UriUtil.parseIntParameter('0', 1, 999, 123)).toBe(123);
    });

    it('returns the default value when the value is greater than the maximum.', () => {
      expect(UriUtil.parseIntParameter('1000', 1, 999, 123)).toBe(123);
    });

    it('returns the value when the value is equal to the minimum.', () => {
      expect(UriUtil.parseIntParameter('1', 1, 999, 123)).toBe(1);
    });

    it('returns the value when the value is equal to the maximum.', () => {
      expect(UriUtil.parseIntParameter('999', 1, 999, 123)).toBe(999);
    });

    it('returns the value when the value is between the minimum and the maximum.', () => {
      expect(UriUtil.parseIntParameter('2', 1, 999, 123)).toBe(2);
      expect(UriUtil.parseIntParameter('998', 1, 999, 123)).toBe(998);
    });
  });

  describe('parseStringParameter', () => {
    it('returns the default value when the value is null, undefined, an empty string, or white space.', () => {
      expect(UriUtil.parseStringParameter(null, '123')).toBe('123');
      expect(UriUtil.parseStringParameter(undefined, '123')).toBe('123');
      expect(UriUtil.parseStringParameter('', '123')).toBe('123');
      expect(UriUtil.parseStringParameter('   ', '123')).toBe('123');
    });

    it('returns the value if the value is not null, undefined, an empty string, or white space.', () => {
      expect(UriUtil.parseStringParameter('this', '123')).toBe('this');
    });
  });

  describe('removeParameter', () => {
    it('returns the uri when the uri is null, undefined, an empty string, or white space.', () => {
      expect(UriUtil.removeParameter(null, 'first')).toBeNull();
      expect(UriUtil.removeParameter(undefined, 'first')).toBeUndefined();
      expect(UriUtil.removeParameter('', 'first')).toBe('');
      expect(UriUtil.removeParameter(' ', 'first')).toBe(' ');
    });

    it('returns the uri when the parameter is null, undefined, an empty string, or white space.', () => {
      expect(UriUtil.removeParameter('https://any.org/', null)).toBe('https://any.org/');
      expect(UriUtil.removeParameter('https://any.org/', undefined)).toBe('https://any.org/');
      expect(UriUtil.removeParameter('https://any.org/', '')).toBe('https://any.org/');
      expect(UriUtil.removeParameter('https://any.org/', ' ')).toBe('https://any.org/');
    });

    it('returns the uri when no parameters exist.', () => {
      expect(UriUtil.removeParameter('https://any.org/', 'first')).toBe('https://any.org/');
    });

    it('returns the uri when no parameters exist but the uri ends with a question mark.', () => {
      expect(UriUtil.removeParameter('https://any.org?', 'first')).toBe('https://any.org');
    });

    it('is able to remove the first parameter in a set of parameters.', () => {
      expect(UriUtil.removeParameter('https://any.org?first=name&last=name', 'first')).toBe('https://any.org?last=name');
    });

    it('is able to remove the middle parameter in a set of parameters.', () => {
      expect(UriUtil.removeParameter('https://any.org?first=name&last=name&middle=name', 'last')).toBe('https://any.org?first=name&middle=name');
    });

    it('is able to remove the last parameter in a set of parameters.', () => {
      expect(UriUtil.removeParameter('https://any.org?first=name&last=name&middle=name', 'middle')).toBe('https://any.org?first=name&last=name');
    });

    it('is able to remove a parameter that is the only parameter and not leave a question mark.', () => {
      expect(UriUtil.removeParameter('https://any.org?first=name', 'first')).toBe('https://any.org');
    });
  });

  describe('addParameter', () => {
    it('appends a question mark with the parameter/value when the url is null, undefined, whitespace, or an empty string.', () => {
      expect(UriUtil.addParameter(null, 'first', 'name')).toBe('?first=name');
      expect(UriUtil.addParameter(undefined, 'first', 'name')).toBe('?first=name');
      expect(UriUtil.addParameter('', 'first', 'name')).toBe('?first=name');
      expect(UriUtil.addParameter(' ', 'first', 'name')).toBe('?first=name');
    });

    it('returns the URL as-is when the parameter is null, undefined, whitespace, or an empty string.', () => {
      expect(UriUtil.addParameter('hello', null, 'name')).toBe('hello');
      expect(UriUtil.addParameter('hello', undefined, 'name')).toBe('hello');
      expect(UriUtil.addParameter('hello', '', 'name')).toBe('hello');
      expect(UriUtil.addParameter('hello', ' ', 'name')).toBe('hello');
    });

    it('removes the parameter if the value is null, undefined, whitespace, or an empty string.', () => {
      expect(UriUtil.addParameter('hello?name=test', 'name', null)).toBe('hello');
      expect(UriUtil.addParameter('hello?name=test', 'name', undefined)).toBe('hello');
      expect(UriUtil.addParameter('hello?name=test', 'name', '')).toBe('hello');
      expect(UriUtil.addParameter('hello?name=test', 'name', '  ')).toBe('hello');
    });

    it('removes the parameter if it does not have a value and leaves parameters after it intact.', () => {
      expect(UriUtil.addParameter('hello?name=test&last=joe&middle=jane', 'name', null)).toBe('hello?last=joe&middle=jane');
    });

    it('removes the parameter if it does not have a value and leaves parameters around it intact.', () => {
      expect(UriUtil.addParameter('hello?name=test&last=joe&middle=jane', 'last', null)).toBe('hello?name=test&middle=jane');
    });

    it('removes the parameter if it does not have a value and leaves parameters before it intact.', () => {
      expect(UriUtil.addParameter('hello?name=test&last=joe&middle=jane', 'middle', null)).toBe('hello?name=test&last=joe');
    });

    it('removes the question mark if the only parameter is removed due to it not having a value.', () => {
      expect(UriUtil.addParameter('hello?name=test', 'name', null)).toBe('hello');
    });

    it('adds a question mark if this is the first parameter being added to the URL.', () => {
      expect(UriUtil.addParameter('hello', 'name', 'john')).toBe('hello?name=john');
    });

    it('does not add a question mark if this is the first parameter being added to the URL and a question mark already exists.', () => {
      expect(UriUtil.addParameter('hello?', 'name', 'john')).toBe('hello?name=john');
    });

    it('adds an ampersand if this is the second parameter being added to the URL.', () => {
      expect(UriUtil.addParameter('hello?first=jane', 'last', 'doe')).toBe('hello?first=jane&last=doe');
    });

    it('replaces the parameter value if it already exists.', () => {
      expect(UriUtil.addParameter('hello?first=jane', 'first', 'sam')).toBe('hello?first=sam');
      expect(UriUtil.addParameter('hello?first=jane&last=doe', 'first', 'sam')).toBe('hello?last=doe&first=sam');
    });

    it('encodes the value of the parameter.', () => {
      expect(UriUtil.addParameter('hello?first=jane', 'last', 'this is cool')).toBe('hello?first=jane&last=this%20is%20cool');
    });
  });
});
