import { useParams } from 'react-router';

function DetailProductDashPage() {
  const { params } = useParams();
  return (
    <div>
      <p>DetailProductDashPage</p>
      <p>{params}</p>
    </div>
  );
}

export default DetailProductDashPage;
