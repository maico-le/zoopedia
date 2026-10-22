import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf9] text-slate-800">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
