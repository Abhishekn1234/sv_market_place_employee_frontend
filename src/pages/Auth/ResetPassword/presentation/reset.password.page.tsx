import { useResetPassword } from '../presentation/hooks/useReset';
import { useState } from 'react';
import { Input } from '@/components/ui/input';   
import { Button } from '@/components/ui/button'; 
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react'; // Eye icons

export default function ResetPasswordForm() {
  const { resetPassword, loading } = useResetPassword();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword({ newPassword, confirmPassword });
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reset Your Password
        </h2>

        <div className="space-y-4">
          {/* New Password */}
          <div className="relative">
            <Input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full pr-10" // padding for icon
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowNewPassword(prev => !prev)}
            >
              {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(prev => !prev)}
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          disabled={loading}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>
    </div>
  );
}
