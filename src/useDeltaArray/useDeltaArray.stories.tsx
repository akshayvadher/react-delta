import React, { useEffect, useState } from 'react';
import { action } from '@storybook/addon-actions';
import useDeltaArray from './useDeltaArray';

export default {
  title: 'useDeltaArray',
};

export const Primitives = () => {
  const [count, setCount] = useState(0);
  const [unrelatedState, setUnrelatedState] = useState(false);

  const deltas = useDeltaArray([count, unrelatedState]);

  useEffect(() => {
    action('Deltas')(deltas);
  });

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Increment: {count}</button>
      <button onClick={() => setUnrelatedState((p) => !p)}>
        Toggle Unrelated State: {String(unrelatedState)}
      </button>
    </div>
  );
};

export const Shallow = () => {
  const [state, setState] = useState({ count: 0 });
  const [unrelatedState, setUnrelatedState] = useState(false);

  const deltas = useDeltaArray([state, unrelatedState]);

  useEffect(() => {
    action('Shallow deltas')(deltas);
  });

  return (
    <div>
      <button onClick={() => setState((s) => ({ count: s.count }))}>
        Replace: {JSON.stringify(state)}
      </button>
      <button onClick={() => setState((s) => ({ count: s.count + 1 }))}>
        Increment: {JSON.stringify(state)}
      </button>
      <button onClick={() => setUnrelatedState((p) => !p)}>
        Toggle Unrelated State: {String(unrelatedState)}
      </button>
    </div>
  );
};

export const Deep = () => {
  const [state, setState] = useState({ count: 0 });
  const [unrelatedState, setUnrelatedState] = useState(false);

  const deltas = useDeltaArray([state, unrelatedState], { deep: true });

  useEffect(() => {
    action('Deep deltas')(deltas);
  });

  return (
    <div>
      <button onClick={() => setState((s) => ({ count: s.count }))}>
        Replace: {JSON.stringify(state)}
      </button>
      <button onClick={() => setState((s) => ({ count: s.count + 1 }))}>
        Increment: {JSON.stringify(state)}
      </button>
      <button onClick={() => setUnrelatedState((p) => !p)}>
        Toggle Unrelated State: {String(unrelatedState)}
      </button>
    </div>
  );
};
