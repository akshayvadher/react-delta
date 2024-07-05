import { useRef } from 'react';
import useDeltaArray from '../useDeltaArray';
import { DeltaObject } from '../shared';
import { isEqual } from 'lodash-es';

interface Options {
  deep?: boolean;
}

function useDeltaObject<T extends object>(
  obj: T,
  { deep = false }: Options = {},
): DeltaObject<T> {
  const keys = Object.keys(obj);
  const originalKeysRef = useRef(keys);

  if (!isEqual(keys, originalKeysRef.current)) {
    console.warn(
      'Object keys changed across renders, but should remain constant.',
    );
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const values = originalKeysRef.current.map((key) => obj[key]);
  const deltas = useDeltaArray(values, { deep });
  const deltasObj = deltas.reduce((o, delta, i) => {
    const key = originalKeysRef.current[i];
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    o[key] = delta;
    return o;
  }, {});
  return deltasObj as DeltaObject<T>;
}

export default useDeltaObject;
