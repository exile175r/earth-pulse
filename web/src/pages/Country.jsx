import { useParams } from 'react-router-dom';

export default function Country() {
  const { code } = useParams();
  
  return (
    <div>
      <h1>국가 상세: {code}</h1>
      {/* TODO: 국가 상세 정보 표시 */}
    </div>
  );
}

