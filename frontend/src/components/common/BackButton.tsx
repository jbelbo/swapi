import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BackButton.module.css';

const BackButton: React.FC = () => {
  return (
    <Link to="/" className={styles.button}>
      Back to Search
    </Link>
  );
};

export default BackButton; 