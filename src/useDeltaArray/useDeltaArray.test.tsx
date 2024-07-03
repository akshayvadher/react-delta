import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { mount } from 'enzyme';
import useDeltaArray from './useDeltaArray';

interface AppProps {
  count: number;
  obj: object;
  deep?: boolean;
  observer: (deltas: unknown) => void;
}

const App = ({ observer, count, obj, deep = false }: AppProps) => {
  const deltas = useDeltaArray([count, obj], { deep });

  observer(deltas);

  return null;
};

interface MismatchedKeysProps {
  array: unknown[];
  observer: (deltas: unknown) => void;
  deep?: boolean;
}

const MismatchedKeys = ({
  observer,
  array,
  deep = false,
}: MismatchedKeysProps) => {
  const deltas = useDeltaArray(array, { deep });

  observer(deltas);

  return null;
};

const FIRST_RENDER_DELTAS = [{ curr: 0 }, { curr: { id: 123 } }];

describe('useDeltaArray', () => {
  it('first render should have deltas with no prev key', () => {
    const observer = vi.fn();
    mount(<App observer={observer} count={0} obj={{ id: 123 }} />);

    const firstRenderCounts = observer.mock.calls[0][0];

    expect(firstRenderCounts).toEqual(FIRST_RENDER_DELTAS);
  });

  it('second render should have deltas with curr and prev keys', () => {
    const observer = vi.fn();
    const wrapper = mount(
      <App observer={observer} count={0} obj={{ id: 123 }} />,
    );

    const firstRenderDeltas = observer.mock.calls[0][0];

    expect(firstRenderDeltas).toEqual(FIRST_RENDER_DELTAS);

    wrapper.setProps({ count: 1 });

    const secondRenderDeltas = observer.mock.calls[1][0];

    expect(firstRenderDeltas).toEqual(FIRST_RENDER_DELTAS);
    expect(secondRenderDeltas).toEqual([{ curr: 1, prev: 0 }, null]);
  });

  it('second render deltas should be null if values didnt change since first render', () => {
    const observer = vi.fn();
    const wrapper = mount(
      <App observer={observer} count={0} obj={{ id: 123 }} />,
    );

    const firstRenderDeltas = observer.mock.calls[0][0];

    expect(firstRenderDeltas).toEqual(FIRST_RENDER_DELTAS);

    wrapper.setProps({ bar: 1 });

    const secondRenderDeltas = observer.mock.calls[1][0];

    expect(firstRenderDeltas).toEqual(FIRST_RENDER_DELTAS);
    expect(secondRenderDeltas).toEqual([null, null]);
  });

  it('when not deep, delta should exist even if object is deeply equal', () => {
    const observer = vi.fn();
    const wrapper = mount(
      <App observer={observer} count={0} obj={{ id: 123 }} />,
    );

    const firstRenderDeltas = observer.mock.calls[0][0];

    expect(firstRenderDeltas).toEqual(FIRST_RENDER_DELTAS);

    wrapper.setProps({ obj: { id: 123 } });

    const secondRenderDeltas = observer.mock.calls[1][0];

    expect(secondRenderDeltas).toEqual([
      null,
      { curr: { id: 123 }, prev: { id: 123 } },
    ]);
  });

  it('when deep, delta should not exist if object is deeply equal', () => {
    const observer = vi.fn();
    const wrapper = mount(
      <App observer={observer} count={0} obj={{ id: 123 }} deep={true} />,
    );

    const firstRenderDeltas = observer.mock.calls[0][0];

    expect(firstRenderDeltas).toEqual(FIRST_RENDER_DELTAS);

    wrapper.setProps({ obj: { id: 123 } });

    const secondRenderDeltas = observer.mock.calls[1][0];

    expect(secondRenderDeltas).toEqual([null, null]);
  });

  it('when deep, delta should exist if object is not deeply equal', () => {
    const observer = vi.fn();
    const wrapper = mount(
      <App observer={observer} count={0} obj={{ id: 123 }} deep={true} />,
    );

    const firstRenderDeltas = observer.mock.calls[0][0];

    expect(firstRenderDeltas).toEqual(FIRST_RENDER_DELTAS);

    wrapper.setProps({ obj: { id: 234 } });

    const secondRenderDeltas = observer.mock.calls[1][0];

    expect(secondRenderDeltas).toEqual([
      null,
      { curr: { id: 234 }, prev: { id: 123 } },
    ]);
  });

  it('longer array on nonfirst render should only return deltas for array keys from first render', () => {
    const observer = vi.fn();
    const wrapper = mount(
      <MismatchedKeys observer={observer} array={[0, 0]} />,
    );

    const firstRenderDeltas = observer.mock.calls[0][0];

    expect(firstRenderDeltas).toEqual([{ curr: 0 }, { curr: 0 }]);

    wrapper.setProps({ array: [1, 0, 1] });

    const secondRenderDeltas = observer.mock.calls[1][0];

    expect(secondRenderDeltas).toEqual([{ curr: 1, prev: 0 }, null]);
  });

  it('shorter array on nonfirst render should return deltas for array keys from first render', () => {
    const observer = vi.fn();
    const wrapper = mount(
      <MismatchedKeys observer={observer} array={[0, 0]} />,
    );

    const firstRenderDeltas = observer.mock.calls[0][0];

    expect(firstRenderDeltas).toEqual([{ curr: 0 }, { curr: 0 }]);

    wrapper.setProps({ array: [1] });

    const secondRenderDeltas = observer.mock.calls[1][0];

    expect(secondRenderDeltas).toEqual([
      { curr: 1, prev: 0 },
      { curr: undefined, prev: 0 },
    ]);
  });
});
