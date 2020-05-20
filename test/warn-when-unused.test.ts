import { warnWhenUnused } from '../src';

describe('it', () => {
  it('works', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementationOnce(() => null);
    const data = warnWhenUnused({ foo: 'bar', lorem: 'ipsum' });
    data.foo;

    await new Promise(r => setTimeout(r, 150));

    expect(spy).toBeCalledWith('Unused keys:\n@lorem');
  });
});
