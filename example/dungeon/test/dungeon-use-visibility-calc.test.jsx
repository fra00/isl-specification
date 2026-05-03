import { renderHook } from '../bin/node_modules/@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useVisibilityCalc } from '../bin/dungeon-use-visibility-calc';

describe('useVisibilityCalc', () => {
  it('reveals full rooms when the hero starts inside a room', () => {
    const { result } = renderHook(() => useVisibilityCalc({
      gameSession: { currentMap: { grid: [] }, openedDoors: [] },
      visibilityMap: { data: [
        { x: 1, y: 1, valo: '2', vis1: '3', vis2: '4' },
        { x: 2, y: 1, valo: '2' },
        { x: 3, y: 1, valo: '3' },
        { x: 4, y: 1, valo: '5' },
      ] },
    }));

    expect(result.current.calculateVisibleCells(1, 1)).toEqual([
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ]);
  });

  it('reveals corridor cells until a room boundary or rock blocks visibility', () => {
    const { result } = renderHook(() => useVisibilityCalc({
      gameSession: {
        currentMap: {
          grid: [
            { x: 2, y: 1, arnt: { antroc: false } },
            { x: 3, y: 1, arnt: { antroc: true } },
            { x: 1, y: 2, arnt: { antroc: false } },
          ],
        },
        openedDoors: [],
      },
      visibilityMap: { data: [
        { x: 1, y: 1, valo: '1' },
        { x: 2, y: 1, valo: '1' },
        { x: 3, y: 1, valo: '1' },
        { x: 1, y: 2, valo: '1' },
        { x: 1, y: 3, valo: '9' },
      ] },
    }));

    expect(result.current.calculateVisibleCells(1, 1)).toEqual([
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ]);
  });

  it('evaluates line of sight across open doors and blockers', () => {
    const { result } = renderHook(() => useVisibilityCalc({
      gameSession: {
        openedDoors: ['2,1'],
        currentMap: {
          grid: [
            { x: 1, y: 1, arnt: { antroc: false }, mobili: { num: null } },
            { x: 2, y: 1, arnt: { antroc: false }, mobili: { num: null } },
            { x: 3, y: 1, arnt: { antroc: false }, mobili: { num: null } },
          ],
        },
      },
      visibilityMap: { data: [
        { x: 1, y: 1, valo: 'A' },
        { x: 2, y: 1, valo: 'B' },
        { x: 3, y: 1, valo: 'B' },
      ] },
    }));

    expect(result.current.hasLineOfSight(1, 1, 3, 1)).toBe(true);
  });

  it('rejects line of sight when furniture, rocks or closed wall transitions block the path', () => {
    const furnitureHook = renderHook(() => useVisibilityCalc({
      gameSession: {
        openedDoors: [],
        currentMap: { grid: [
          { x: 1, y: 1, arnt: { antroc: false }, mobili: { num: null } },
          { x: 2, y: 1, arnt: { antroc: false }, mobili: { num: 1 } },
          { x: 3, y: 1, arnt: { antroc: false }, mobili: { num: null } },
        ] },
      },
      visibilityMap: { data: [
        { x: 1, y: 1, valo: 'A' },
        { x: 2, y: 1, valo: 'A' },
        { x: 3, y: 1, valo: 'A' },
      ] },
    }));
    expect(furnitureHook.result.current.hasLineOfSight(1, 1, 3, 1)).toBe(false);

    const wallHook = renderHook(() => useVisibilityCalc({
      gameSession: {
        openedDoors: [],
        currentMap: { grid: [
          { x: 1, y: 1, arnt: { antroc: false }, mobili: { num: null } },
          { x: 2, y: 1, arnt: { antroc: false }, mobili: { num: null } },
        ] },
      },
      visibilityMap: { data: [
        { x: 1, y: 1, valo: 'A' },
        { x: 2, y: 1, valo: 'B' },
      ] },
    }));
    expect(wallHook.result.current.hasLineOfSight(1, 1, 2, 1)).toBe(false);
  });
});