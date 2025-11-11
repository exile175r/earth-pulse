import { get } from '../api/client.js';
import { endpoints } from '../api/endpoints.js';

export default class WorldWindAirQualityLayer {
  constructor(wwd) {
    this.wwd = wwd;
    this.timeRange = null;
    this.parameter = 'pm25';
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

  setParameter(parameter) {
    this.parameter = parameter;
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
      const data = await get(endpoints.aq.recent({
        from: this.timeRange.from,
        to: this.timeRange.to,
        param: this.parameter,
        bucket: '1h',
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
      
      const buckets = data.buckets || [];
      
      // 대기질 데이터를 Placemark로 추가 (샘플링하여 너무 많지 않게)
      const sampleSize = Math.min(buckets.length, 1000);
      const step = Math.max(1, Math.floor(buckets.length / sampleSize));
      
      for (let i = 0; i < buckets.length; i += step) {
        const bucket = buckets[i];
        if (!bucket.measurements || bucket.measurements.length === 0) continue;
        
        // 버킷의 평균 위치 계산
        let totalLat = 0;
        let totalLng = 0;
        let count = 0;
        
        bucket.measurements.forEach(m => {
          try {
            const lat = typeof m.lat === 'number' ? m.lat : parseFloat(m.lat);
            const lng = typeof m.lng === 'number' ? m.lng : parseFloat(m.lng);
            if (!isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng)) {
              totalLat += lat;
              totalLng += lng;
              count++;
            }
          } catch (err) {
            console.warn('Error processing measurement location:', err, m);
          }
        });
        
        if (count === 0) continue;
        
        const avgLat = totalLat / count;
        const avgLng = totalLng / count;
        const avgValue = bucket.avg || 0;
        
        // 값에 따라 색상 결정 (파랑-초록-노랑-빨강)
        let red, green, blue;
        if (avgValue < 50) {
          // 좋음 (파랑)
          red = 0;
          green = 100;
          blue = 255;
        } else if (avgValue < 100) {
          // 보통 (초록)
          red = 0;
          green = 255;
          blue = 0;
        } else if (avgValue < 150) {
          // 나쁨 (노랑)
          red = 255;
          green = 255;
          blue = 0;
        } else {
          // 매우 나쁨 (빨강)
          red = 255;
          green = 0;
          blue = 0;
        }
        
        const attributes = new this.WorldWind.PlacemarkAttributes(null);
        attributes.imageScale = 0.3;
        attributes.imageColor = new this.WorldWind.Color(red / 255, green / 255, blue / 255, 0.6);
        attributes.imageSource = this.WorldWind.configuration.baseUrl + 'images/pushpins/plain-blue.png';
        
        const position = new this.WorldWind.Position(avgLat, avgLng, 0);
        const placemark = new this.WorldWind.Placemark(position, true, attributes);
        
        placemark.userObject = {
          type: 'airquality',
          parameter: this.parameter,
          value: avgValue,
          time: bucket.start,
        };
        
        // WorldWind는 addRenderable을 사용하여 Placemark 추가
        if (this.wwd.addRenderable) {
          this.wwd.addRenderable(placemark);
        } else if (this.wwd.addPlacemark) {
          this.wwd.addPlacemark(placemark);
        }
        this.placemarks.push(placemark);
      }
      
      this.wwd.redraw();
    } catch (error) {
      console.error('Error loading air quality data:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        timeRange: this.timeRange,
        parameter: this.parameter,
      });
      
      // OpenAQ API v2가 더 이상 사용 불가능한 경우 사용자에게 알림
      if (error.message && error.message.includes('410') || error.message.includes('deprecated')) {
        console.warn('OpenAQ API v2 is deprecated. Consider using an alternative data source.');
      }
      
      // 에러가 발생해도 앱이 계속 작동하도록 빈 배열로 설정
      this.placemarks = [];
    }
  }
}

