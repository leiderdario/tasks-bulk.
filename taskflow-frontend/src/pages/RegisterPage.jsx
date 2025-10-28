import { RegisterForm } from '@/components/auth/RegisterForm';
import { CheckSquare } from 'lucide-react';

export const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
              <CheckSquare size={32} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Crear Cuenta
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Únete a TaskFlow y organiza tus tareas
            </p>
          </div>

          {/* Form */}
          <RegisterForm />
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
          © 2025 TaskFlow. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};
