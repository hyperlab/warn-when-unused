import { getUnusedProperties } from '../src';

describe('it', () => {
  it('works', () => {
    const [data, get] = getUnusedProperties(
      {
        foo: 'bar',
        happy: 'clappy',
        obj: { str: 'data', list: ['a', 'b'] },
      },
      ['@obj.str'] // This is a whitelist
    );

    expect(get()).toEqual([
      '@foo',
      '@happy',
      '@obj',
      '@obj.list',
      '@obj.list.0',
      '@obj.list.1',
    ]);

    data.foo;

    expect(get()).toEqual([
      '@happy',
      '@obj',
      '@obj.list',
      '@obj.list.0',
      '@obj.list.1',
    ]);

    data.obj.list[1]

    expect(get()).toEqual([
      '@happy',
      '@obj.list.0',
    ]);
  });
});
