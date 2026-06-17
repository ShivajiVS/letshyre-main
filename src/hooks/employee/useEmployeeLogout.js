import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { logoutMe } from '@/services/auth.service';

export const useEmployeeLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutMe,
    onSuccess: () => {
      // Clear all queries on logout to prevent stale data
      queryClient.clear();
      
      // Delay to allow any UI animations/loading states to display briefly
      setTimeout(() => {
        localStorage.removeItem('user');
        navigate('/employee/sign-in', { replace: true });
      }, 800);
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Optional: Add toast notification for failure
    }
  });
};
