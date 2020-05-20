# warn-when-unused

Tiny package that can be used to warn when over fetching data.

Uses ES5 Proxies to monitor property access will output a warning to the console when there are unused data.

## Standalone usage

#### Warn when unused

```js
import { warnWhenUnused } from 'warn-when-unused';

const data = {
  color: 'blue',
  num: 1,
};

// Warn/log when unused (after a small timeout)
data = warnWhenUnused(data);
let num = data.num;
```

#### Output

Will log the following to the console:

```
Unused keys:
@color
```

#### Get unused keys/properties

```js
import { getUnusedProperties } from 'warn-when-unused';

const data = {
  color: 'blue',
  num: 1,
};

// Warn/log when unused (after a small timeout)
let [proxy, getUnused] = getUnusedProperties(data);
let num = proxy.num;

console.log('Unused:', getUnused());
```

#### Output

Will log the following to the console:

```
Unused: ['@color']
```

## Usage with React

#### Example

```js
import { useWarnWhenUnused } from 'warn-when-unused';

function App() {
  const data = useWarnWhenUnused(
    {
      name: 'Jonatan',
      happy: 'clappy',
      obj: { str: 'data', list: ['a', 'b'] },
    },
    ['@obj.str'] // This is a whitelist
  );

  return (
    <div className="App">
      <h1>Hello {data.name}</h1>
      <Nested data={data} />
    </div>
  );
}

function Nested({ data }) {
  return (
    <div>
      Happy: {data.happy}, obj.list.0: {data.obj.list[0]}
    </div>
  );
}
```

#### Output

Will log the following to the console since the second element in the `list` array is never accessed:

```
Unused keys:
@obj.list.1
```

## License

MIT
