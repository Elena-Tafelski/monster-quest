import { authService } from './userService';
import clsx from 'clsx';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLoginSuccess: (token: string, username: string) => void;
}

const Register = ({ onLoginSuccess }: LoginProps) => {
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await authService.register(username, email, password);
      const response = await authService.login(username, password);

      localStorage.setItem('token', response.token);
      localStorage.setItem('username', response.username);

      if (onLoginSuccess) {
        onLoginSuccess(response.token, response.username);
      }

      navigate('/');
    } catch (err: any) {
      console.error('Registrierung/Login fehlgeschlagen:', err);
      alert(err.message || 'Registrierung fehlgeschlagen. Bitte versuche es mit anderen Daten.');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-lg flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <input name="username" type="text" placeholder="Username" className="rounded border p-2" />
        <input name="email" type="email" placeholder="E-Mail" className="rounded border p-2" />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="rounded border p-2"
        />
        <button
          type="submit"
          className={clsx(
            'rounded-xl bg-blue-600 font-bold text-white',
            'mt-4 p-4 shadow-lg',
            'transition hover:bg-blue-700 disabled:opacity-50'
          )}
        >
          Registrieren
        </button>
        <Link to="/login">Login</Link>
      </form>
    </div>
  );
};

export default Register;
