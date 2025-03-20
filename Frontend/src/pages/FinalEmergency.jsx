import React from 'react';
import HospitalFinder from '../components/HospitalMap';
import '../App.css';

function Emergency() {
  return (
    <div className="app">
      <header className="app-header">
      </header>
      <main>
        <HospitalFinder />
      </main>
    </div>
  );
}

export default Emergency;