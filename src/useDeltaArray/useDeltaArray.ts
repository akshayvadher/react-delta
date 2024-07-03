import { useRef } from 'react';
import usePrevious from '../usePrevious';
import { DeltaArray } from '../shared';
import { isEqual } from 'lodash-es';

const range = (n: number) => [...Array(n).keys()];

interface Options {
  deep?: boolean;
}

function useDeltaArray<T extends unknown[]>(
  valueArray: T,
  { deep = false }: Options = {},
): DeltaArray<T> {
  const originalArrayLength = useRef(valueArray.length);

  if (valueArray.length !== originalArrayLength.current) {
    console.warn(
      'Length of array changed across renders, but should remain constant.',
    );
  }

  const equals = deep ? isEqual : Object.is;

  const prevArray = usePrevious(valueArray);

  const deltas = range(originalArrayLength.current).map((i) => {
    if (!prevArray) {
      return {
        curr: valueArray[i],
      };
    } else if (!equals(valueArray[i], prevArray[i])) {
      return {
        prev: prevArray[i],
        curr: valueArray[i],
      };
    } else {
      return null;
    }
  });

  return deltas as DeltaArray<T>;
}

export default useDeltaArray;
