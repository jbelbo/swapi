import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <h1 className={styles.title}>SWStarter</h1>
      </Link>
    </header>
  );
};

export default Header; 