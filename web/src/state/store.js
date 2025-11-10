import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * 전역 상태 관리 (Zustand)
 */
export const useStore = create(
  persist(
    (set, get) => ({
      // 뷰 상태
      view: {
        camera: { position: [0, 0, 5], target: [0, 0, 0] },
        perfMode: false,
        param: 'pm25',
        timeRange: {
          from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString(),
        },
        bbox: null,
        mapMode: '3d', // '3d' | '2d'
        zoomLevel: 1,
      },
      
      // 선택 상태
      selection: {
        type: 'none', // 'continent' | 'country' | 'city' | 'none'
        id: null,
        name: null,
      },
      
      // 데이터 상태
      data: {
        summaries: null,
        tilesCache: new Map(),
        eqPoints: [],
        continentData: null,
        countryData: null,
      },
      
      // UI 상태
      ui: {
        sidePanelOpen: false,
        loading: false,
        error: null,
      },
      
      // 액션
      setView: (view) => set((state) => ({
        view: { ...state.view, ...view },
      })),
      
      setSelection: (selection) => set((state) => ({
        selection: { ...state.selection, ...selection },
      })),
      
      setData: (data) => set((state) => ({
        data: { ...state.data, ...data },
      })),
      
      setUI: (ui) => set((state) => ({
        ui: { ...state.ui, ...ui },
      })),
    }),
    {
      name: 'earthpulse-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        view: {
          perfMode: state.view.perfMode,
          param: state.view.param,
          mapMode: state.view.mapMode,
        },
      }),
    }
  )
);

