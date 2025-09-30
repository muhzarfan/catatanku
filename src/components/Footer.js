import React from 'react';
import '../styles/NotesApp.css';

const Footer = ({ totalNotes }) => {
  return (
    <footer className="footer">
      <div>Dibuat oleh Muhammad Zharfan Alfanso • Total Catatan: {totalNotes}</div>
    </footer>
  );
};

export default Footer;
