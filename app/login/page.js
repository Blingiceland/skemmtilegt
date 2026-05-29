'use client';
import { useState } from 'react';
import '../globals.css';

export default function Login() {
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      if (res.ok) {
        window.location.href = '/';
      } else {
        setErr('Rangt lykilorð');
        setLoading(false);
      }
    } catch {
      setErr('Eitthvað fór úrskeiðis');
      setLoading(false);
    }
  };

  return (
    <main className="login-wrap">
      <form onSubmit={submit} className="login-card">
        <div className="kicker">Aðgangur</div>
        <h1>Lokað svæði</h1>
        <p className="dek">
          Þessi reiknivél er í drögum og ekki opin almenningi. Sláðu inn lykilorð til að halda áfram.
        </p>
        <input
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          autoFocus
          placeholder="Lykilorð"
          className="pwd"
        />
        {err && <div className="err">{err}</div>}
        <button type="submit" disabled={loading} className="go">
          {loading ? 'Athuga…' : 'Áfram'}
        </button>
      </form>

      <style jsx>{`
        .login-wrap {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          padding: 24px; background: var(--paper);
        }
        .login-card {
          max-width: 440px; width: 100%;
          background: var(--paper-deep); border: 2px solid var(--ink);
          border-radius: 3px; padding: 40px;
          box-shadow: 6px 6px 0 var(--shadow);
          font-family: 'Archivo', sans-serif;
        }
        .kicker {
          text-transform: uppercase; letter-spacing: 0.28em; font-size: 0.72rem;
          font-weight: 700; color: var(--blood); margin-bottom: 16px;
        }
        h1 {
          font-family: 'Archivo', sans-serif; font-weight: 900;
          font-size: 1.9rem; line-height: 1.05; letter-spacing: -0.02em;
          margin-bottom: 14px; color: var(--ink);
        }
        .dek {
          font-size: 0.92rem; line-height: 1.55; color: #4a3d30; margin-bottom: 24px;
        }
        .pwd {
          width: 100%; padding: 14px 16px; font-size: 1rem;
          border: 1.5px solid var(--line); border-radius: 2px;
          background: var(--paper); font-family: 'Archivo';
          font-weight: 600; color: var(--ink); margin-bottom: 14px;
        }
        .pwd:focus { outline: none; border-color: var(--blood); }
        .err {
          color: var(--blood); font-size: 0.86rem; font-weight: 600;
          margin-bottom: 14px;
        }
        .go {
          width: 100%; padding: 14px 24px;
          background: var(--blood); color: #fff; border: 2px solid var(--blood);
          font-family: 'Archivo'; font-weight: 700; font-size: 0.95rem;
          text-transform: uppercase; letter-spacing: 0.05em;
          cursor: pointer; border-radius: 2px; transition: all 0.18s;
        }
        .go:hover:not(:disabled) { background: var(--blood-deep); border-color: var(--blood-deep); }
        .go:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </main>
  );
}
