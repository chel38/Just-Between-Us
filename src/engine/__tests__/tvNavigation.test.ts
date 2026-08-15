import { describe, expect, it } from 'vitest';
import { findSpatialTarget, isTvActivationKey } from '../../hooks/useTvNavigation';

describe('TV focus navigation', () => {
  const choices = [
    { left: 0, right: 200, top: 0, bottom: 50 },
    { left: 0, right: 200, top: 60, bottom: 110 },
    { left: 0, right: 200, top: 120, bottom: 170 },
  ];

  it('moves down and up between logical choices', () => {
    expect(findSpatialTarget(choices, 0, 'down')).toBe(1);
    expect(findSpatialTarget(choices, 2, 'up')).toBe(1);
  });

  it('recognizes remote OK/Enter without treating Back as activation', () => {
    expect(isTvActivationKey('Enter')).toBe(true);
    expect(isTvActivationKey('OK')).toBe(true);
    expect(isTvActivationKey('Escape')).toBe(false);
  });
});
