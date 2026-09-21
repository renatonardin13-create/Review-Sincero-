import React from 'react';
import { AuthUser } from '../../types';

interface QuizAdminProps {
  currentUser: AuthUser;
}

export const QuizAdmin: React.FC<QuizAdminProps> = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">🎯 ADMIN QUIZ DE VENDAS</h1>
      <p>Interface administrativa em desenvolvimento.</p>
    </div>
  );
};
