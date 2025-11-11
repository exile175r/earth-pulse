import { get } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';

export default class WorldWindEarthquakeLayer {
  constructor(wwd) {
    this.wwd = wwd;
    this.timeRange = null;
    this.placemarks = [];
    this.WorldWind = null;
  }

  setWorldWind(WorldWind) {
    this.WorldWind = WorldWind;
  }

  setTimeRange(timeRange) {
    this.timeRange = timeRange;
    this.loadData();
  }

  async loadData() {
    if (!this.timeRange || !this.timeRange.from || !this.timeRange.to) {
      return;
    }

    if (!this.WorldWind) {
      if (typeof window !== 'undefined' && window.WorldWind) {
        this.WorldWind = window.WorldWind;
      } else {
        return;
      }
    }

    try {
      const data = await get(endpoints.eq.recent({
        from: this.timeRange.from,
        to: this.timeRange.to,
        bucket: 'none',
      }));
      
      // 기존 placemark 제거
      this.placemarks.forEach(pm => {
        if (this.wwd) {
          if (this.wwd.removeRenderable) {
            this.wwd.removeRenderable(pm);
          } else if (this.wwd.removePlacemark) {
            this.wwd.removePlacemark(pm);
          }
        }
      });
      this.placemarks = [];
      
      const events = data.events || [];
      
      // 지진 데이터를 Placemark로 추가
      events.forEach((eq) => {
        const magnitude = eq.magnitude || 0;
        const intensity = Math.min(magnitude / 10, 1);
        
        // 규모에 따라 색상 결정 (빨강-노랑)
        const red = Math.floor(intensity * 255);
        const green = Math.floor((1 - intensity * 0.5) * 255);
        const blue = 0;
        const alpha = 0.8;
        
        const attributes = new this.WorldWind.PlacemarkAttributes(null);
        attributes.imageScale = 0.5 + intensity * 0.5; // 규모에 따라 크기 조절
        attributes.imageColor = new this.WorldWind.Color(red / 255, green / 255, blue / 255, alpha);
        attributes.imageSource = this.WorldWind.configuration.baseUrl + 'images/pushpins/plain-red.png';
        
        const position = new this.WorldWind.Position(eq.lat, eq.lng, 0);
        const placemark = new this.WorldWind.Placemark(position, true, attributes);
        
        placemark.userObject = {
          type: 'earthquake',
          magnitude: magnitude,
          occurred_at: eq.occurred_at,
        };
        
        // WorldWind는 addRenderable을 사용하여 Placemark 추가
        if (this.wwd.addRenderable) {
          this.wwd.addRenderable(placemark);
        } else if (this.wwd.addPlacemark) {
          this.wwd.addPlacemark(placemark);
        }
        this.placemarks.push(placemark);
      });
      
      this.wwd.redraw();
    } catch (error) {
      console.error('Error loading earthquake data:', error);
    }
  }
}
