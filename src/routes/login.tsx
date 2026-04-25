import { createRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from '@tanstack/react-form';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { Route as rootRoute } from './__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginView,
});

function LoginView() {
  const setSession = useAuthStore((state) => state.setSession);
  const navigate = useNavigate({ from: '/login' });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: value.email,
        password: value.password,
      });
      if (data.session) {
        setSession(data.session);
        navigate({ to: '/' });
      } else {
        console.error(error);
        alert(error?.message);
      }
    },
  });

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 font-sans text-slate-300">
      <div className="w-full max-w-sm p-8 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl">
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-slate-950 font-bold italic">
            K
          </div>
          <h1 className="text-lg font-bold tracking-tight text-slate-100">KOA Manager <span className="text-emerald-500 text-xs font-mono">RC6</span></h1>
        </div>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="email"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email (Supabase)</label>
                <input
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          />
          <form.Field
            name="password"
            children={(field) => (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-800 rounded text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          />
          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className="w-full mt-6 px-4 py-2 bg-emerald-600 text-slate-950 text-sm font-bold rounded hover:bg-emerald-500 disabled:opacity-50"
          >
            {form.state.isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
