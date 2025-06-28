import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { useAppDispatch } from './hooks/useAppDispatch';
import { useEffect } from 'react';
import { verifyUser } from './store/actions/auth/verifyUser';
import { UserLocationProvider } from './hooks/useUserLocation';

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(verifyUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <UserLocationProvider>
        <AppRoutes />
      </UserLocationProvider>
    </BrowserRouter>
  )
}

export default App
