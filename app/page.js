'use client';
import '../app/globals.css';
import Reiknivel from '../components/Reiknivel';
import Kynning from '../components/Kynning';
import Greinargerd from '../components/Greinargerd';

export default function Page() {
  return (
    <main>
      <div id="reiknivel">
        <Reiknivel />
      </div>
      <Kynning />
      <Greinargerd />
    </main>
  );
}
