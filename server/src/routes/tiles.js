import express from 'express';
import { tileService } from '../services/tileService.js';

const router = express.Router();

/**
 * GET /api/tiles/aq-heat/:z/:x/:y
 * 대기질 히트맵 타일
 * Query params: param, time
 */
router.get('/aq-heat/:z/:x/:y', async (req, res) => {
  try {
    const { z, x, y } = req.params;
    const { param = 'pm25', time } = req.query;
    
    const tile = await tileService.getHeatmapTile({
      z: parseInt(z, 10),
      x: parseInt(x, 10),
      y: parseInt(y, 10),
      parameter: param,
      time: time ? new Date(time) : new Date(),
    });
    
    if (!tile) {
      return res.status(404).json({ error: 'Tile not found' });
    }
    
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=900'); // 15분
    res.send(tile);
  } catch (error) {
    console.error('Error in /api/tiles/aq-heat:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

