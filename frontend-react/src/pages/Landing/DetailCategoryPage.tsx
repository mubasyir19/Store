import { useParams } from 'react-router';

function DetailCategoryPage() {
  const { slug } = useParams();
  return (
    <div>
      <p>DetailCategoryPage</p>
      <p>{slug}</p>
    </div>
  );
}

export default DetailCategoryPage;
