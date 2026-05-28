'use client';
import '../app/globals.css';
import Reiknivel from '../components/Reiknivel';
import Hatid from '../components/Hatid';
import Kynning from '../components/Kynning';

export default function Page() {
  return (
    <main>
      <div id="reiknivel">
        <Reiknivel />
      </div>
      <div id="hatid">
        <Hatid />
      </div>
      <Kynning />
    </main>
  );
}
