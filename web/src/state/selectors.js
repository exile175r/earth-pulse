/**
 * 상태 셀렉터 (계산된 값)
 */
import { useStore } from './store.js';

export function useTimeRange() {
  return useStore((state) => state.view.timeRange);
}

export function useParameter() {
  return useStore((state) => state.view.param);
}

export function useMapMode() {
  return useStore((state) => state.view.mapMode);
}

export function useSelection() {
  return useStore((state) => state.selection);
}

export function useLoading() {
  return useStore((state) => state.ui.loading);
}

