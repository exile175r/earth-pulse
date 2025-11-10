import { useParams } from 'react-router-dom';

export default function City() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>도시 상세: {id}</h1>
      {/* TODO: 도시 상세 정보 표시 */}
    </div>
  );
}

