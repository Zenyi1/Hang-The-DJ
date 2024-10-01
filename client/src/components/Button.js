// src/components/Button.js
import React from 'react';
import styles from '../styles/HomePage.module.css';

const Button = ({ text }) => {
  return (
    <button className={styles.button}>
      {text}
    </button>
  );
};

export default Button;
