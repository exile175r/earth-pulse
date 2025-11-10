/**
 * API 엔드포인트 URL 빌더
 */

export const endpoints = {
  health: () => '/health',
  
  eq: {
    recent: (params) => {
      const query = new URLSearchParams();
      if (params.from) query.set('from', params.from);
      if (params.to) query.set('to', params.to);
      if (params.bbox) query.set('bbox', params.bbox);
      if (params.minMag) query.set('minMag', params.minMag);
      if (params.bucket) query.set('bucket', params.bucket);
      return `/eq/recent?${query.toString()}`;
    },
  },
  
  aq: {
    recent: (params) => {
      const query = new URLSearchParams();
      if (params.from) query.set('from', params.from);
      if (params.to) query.set('to', params.to);
      if (params.bbox) query.set('bbox', params.bbox);
      if (params.param) query.set('param', params.param);
      if (params.bucket) query.set('bucket', params.bucket);
      return `/aq/recent?${query.toString()}`;
    },
    top: (params) => {
      const query = new URLSearchParams();
      if (params.from) query.set('from', params.from);
      if (params.to) query.set('to', params.to);
      if (params.metric) query.set('metric', params.metric);
      if (params.group) query.set('group', params.group);
      if (params.limit) query.set('limit', params.limit);
      if (params.country) query.set('country', params.country);
      return `/aq/top?${query.toString()}`;
    },
  },
  
  tiles: {
    aqHeat: (z, x, y, params = {}) => {
      const query = new URLSearchParams();
      if (params.param) query.set('param', params.param);
      if (params.time) query.set('time', params.time);
      return `/tiles/aq-heat/${z}/${x}/${y}?${query.toString()}`;
    },
  },
  
  admin: {
    ingest: (source) => `/admin/ingest?source=${source}`,
  },
};

