import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { useAppDispatch } from './hooks/useAppDispatch';
import { useEffect } from 'react';
import { setupAxiosInterceptors } from './utils/axiosInstance';
import { verifyUser } from './store/actions/auth/verifyUser';
import { useNearestCity } from './hooks/useNearestCity';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(verifyUser());
    setupAxiosInterceptors(dispatch);
  }, [dispatch]);

  const { city } = useNearestCity();
  console.log(city);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
