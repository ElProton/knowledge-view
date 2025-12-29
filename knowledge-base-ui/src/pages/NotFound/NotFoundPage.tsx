import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '72px', margin: '0 0 16px', color: '#ccc' }}>404</h1>
      <h2 style={{ margin: '0 0 24px', color: '#333' }}>Page non trouvée</h2>
      <p style={{ margin: '0 0 24px', color: '#666' }}>
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#6366f1',
          color: '#fff',
          textDecoration: 'none',
          borderRadius: '4px',
        }}
      >
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default NotFoundPage;
