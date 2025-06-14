import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { useAppDispatch } from './hooks/useAppDispatch';
import { useEffect } from 'react';
import { setupAxiosInterceptors } from './utils/axiosInstance';
import { verifyUser } from './store/actions/auth/verifyUser';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(verifyUser());
    setupAxiosInterceptors(dispatch);
  }, [dispatch]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
