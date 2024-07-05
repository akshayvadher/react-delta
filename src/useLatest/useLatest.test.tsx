import { describe, expect, it, vi } from 'vitest';
import React from 'react';
import { mount } from 'enzyme';
import useLatest from './useLatest';

interface Props {
  count: number;
  observer: (countRef: { current: number }) => void;
}

const App = ({ observer, count }: Props) => {
  const countRef = useLatest(count);

  observer(countRef);

  return null;
};

describe('useLatest', () => {
  it('old render should have access to values from future render', () => {
    const observer = vi.fn();
    const wrapper = mount(<App observer={observer} count={0} />);

    const firstRenderRef = observer.mock.calls[0][0];

    expect(firstRenderRef).toEqual({ current: 0 });

    wrapper.setProps({ count: 1 });

    const secondRenderRef = observer.mock.calls[1][0];

    expect(firstRenderRef).toEqual({ current: 1 });
    expect(secondRenderRef).toEqual({ current: 1 });
  });
});
