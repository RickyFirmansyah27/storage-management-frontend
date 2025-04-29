
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { SidebarTrigger } from '@/components/ui/sidebar';

const NavBar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex justify-between items-center mb-6 p-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      {user && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            Halo, {user.name}
          </span>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
