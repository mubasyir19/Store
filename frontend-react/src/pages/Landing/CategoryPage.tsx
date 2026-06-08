import { useAuthStore } from '../../stores/authStore';

function CategoryPage() {
  const { accessToken, user } = useAuthStore();
  console.log('access token =', accessToken);
  console.log('user =', user);
  return (
    <div>
      <p>CategoryPage</p>
    </div>
  );
}

export default CategoryPage;
