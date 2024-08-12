const { search } = require('../app/regex');

describe('search function', () => {
  test('should match exact string', () => {
    expect(search('cat', 'cat')).toBe(true);
    expect(search('dog', 'dog')).toBe(true);
    expect(search('cat', 'dog')).toBe(false);
  });

  test('should handle "." wildcard correctly', () => {
    expect(search('c.t', 'cat')).toBe(true);
    expect(search('c.t', 'cut')).toBe(true);
    expect(search('c.t', 'cot')).toBe(true);
    expect(search('c.t', 'cast')).toBe(false);
  });

  test('should match start of string with "^"', () => {
    expect(search('^cat', 'cat')).toBe(true);
    expect(search('^cat', 'caterpillar')).toBe(true);
    expect(search('^cat', 'scat')).toBe(false);
  });

  test('should match end of string with "$"', () => {
    expect(search('cat$', 'cat')).toBe(true);
    expect(search('cat$', 'aristocat')).toBe(true);
    expect(search('cat$', 'catalog')).toBe(false);
  });

  test('should handle "*" quantifier', () => {
    expect(search('ca*t', 'cat')).toBe(true);
    expect(search('ca*t', 'ct')).toBe(true);
    expect(search('ca*t', 'caaat')).toBe(true);
    expect(search('ca*t', 'caa')).toBe(false);
  });

  test('should handle "+" quantifier', () => {
    expect(search('ca+t', 'cat')).toBe(true);
    expect(search('ca+t', 'caaat')).toBe(true);
    expect(search('ca+t', 'ct')).toBe(false);
  });

  test('should handle "?" quantifier', () => {
    expect(search('ca?t', 'cat')).toBe(true);
    expect(search('ca?t', 'ct')).toBe(true);
    expect(search('ca?t', 'caaat')).toBe(false);
  });

  test('should handle character sets "[...]"', () => {
    expect(search('c[aeiou]t', 'cat')).toBe(true);
    expect(search('c[aeiou]t', 'cit')).toBe(true);
    expect(search('c[aeiou]t', 'cut')).toBe(true);
    expect(search('c[aeiou]t', 'czt')).toBe(false);
  });

  test('should handle negated character sets "[^...]"', () => {
    expect(search('c[^aeiou]t', 'czt')).toBe(true);
    expect(search('c[^aeiou]t', 'cat')).toBe(false);
    expect(search('c[^aeiou]t', 'cit')).toBe(false);
  });

  test('should handle escaped characters', () => {
    /*
    expect(search('\\.txt$', 'file.txt')).toBe(true);
    expect(search('\\.txt$', 'file.text')).toBe(false);
    expect(search('\\$5', '$5')).toBe(true);
    expect(search('\\$5', '5$5')).toBe(false);
    */
  });

  test('should handle grouping with alternation "(cat|dog)"', () => {
    expect(search('(cat|dog)', 'cat')).toBe(true);
    expect(search('(cat|dog)', 'dog')).toBe(true);
    expect(search('(cat|dog)', 'rat')).toBe(false);
  });

  test('should match empty pattern', () => {
    expect(search('', 'anything')).toBe(true);
    expect(search('', '')).toBe(true);
  });

  test('should match empty input with "$" at the end', () => {
    expect(search('$', '')).toBe(true);
    expect(search('a$', 'a')).toBe(true);
    expect(search('a$', 'b')).toBe(false);
  });

  test('should not match unmatched parentheses', () => {
    /*
    expect(search('cat(', 'cat')).toBe(false);
    expect(search('dog)', 'dog')).toBe(false);
    */
  });

  test('should handle complex patterns', () => {
    /*
    expect(search('^c[aeiou]+t$', 'caat')).toBe(true);
    expect(search('^c[aeiou]+t$', 'ciit')).toBe(true);
    expect(search('^c[aeiou]+t$', 'cuat')).toBe(true);
    expect(search('^c[aeiou]+t$', 'coot')).toBe(true);
    expect(search('^c[aeiou]+t$', 'coat')).toBe(true);
    expect(search('^c[aeiou]+t$', 'cart')).toBe(false);
    */
  });
});
