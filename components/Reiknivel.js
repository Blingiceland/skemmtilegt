'use client';
import { useState, useMemo } from 'react';

// ===== STADFESTAR FORSENDUR 2026 =====
const VSK_ALM = 0.24;
const VSK_LAGT = 0.11;
const VSK_AFENGI = 0.11;
const TRYGGINGAGJALD = 0.0635;
const UTSVAR = 0.1494;
const STADGR_THREP1 = 0.3149;
const TEKJUSKATTUR_HLUTI = STADGR_THREP1 - UTSVAR; // 0.1655
const GJ_BJOR = 156.45, GJ_VIN = 142.5, GJ_STERKT = 192.85;
const THROSKULDUR = 2.25;

const fmt = (n) => Math.round(n).toLocaleString('is-IS') + ' kr';
const num = (v) => { const x = parseFloat(v); return isNaN(x) ? 0 : x; };

function excise(litrar, abv, gjaldPerCl) {
  const clVinandi = litrar * 100 * (abv / 100);
  const clThroskuldur = litrar * THROSKULDUR;
  return Math.max(0, clVinandi - clThroskuldur) * gjaldPerCl;
}

const DILLON = {
  mode: 'event', alcoholTotal: '200000', ticketSales: '0', lodging: '0',
  wages: '75000', security: '25000', sound: '45000', rent: '0', marketing: '0',
  other24: '0', crew11: '0',
  grant: '', derived: '', cultPct: 85,
};
const STORT = {
  mode: 'event', alcoholTotal: '8500000', ticketSales: '12000000', lodging: '4500000',
  wages: '7700000', security: '450000', sound: '650000', rent: '1800000', marketing: '900000',
  other24: '4200000', crew11: '1800000',
  grant: '3000000', derived: '', cultPct: 85,
};
const ECLIPSE_2026 = {
  mode: 'event', alcoholTotal: '125000000', ticketSales: '300000000', lodging: '100000000',
  wages: '200000000', security: '55000000', sound: '40000000', rent: '0', marketing: '25000000',
  other24: '130000000', crew11: '2000000',
  grant: '', derived: '', cultPct: 90,
};
const EMPTY = {
  mode: 'event', alcoholTotal: '', ticketSales: '', lodging: '', wages: '',
  security: '', sound: '', rent: '', marketing: '',
  other24: '', crew11: '',
  grant: '', derived: '', cultPct: 85,
};

export default function Reiknivel() {
  const [s, setS] = useState({ ...EMPTY });
  const set = (k) => (e) => setS((p) => ({ ...p, [k]: e.target.value }));

  const r = useMemo(() => {
    const alcoholRevenue = num(s.alcoholTotal);
    const ticketSales = s.mode === 'annual' ? 0 : num(s.ticketSales);
    const lodging = s.mode === 'annual' ? 0 : num(s.lodging);
    const wages = num(s.wages);
    const securityGross = num(s.security);
    const soundGross = num(s.sound);
    const rentGross = num(s.rent);
    const mktGross = num(s.marketing);
    const other24Gross = num(s.other24);
    const crew11Gross = num(s.crew11);
    const grant = num(s.grant);
    const derivedSales = num(s.derived);
    const cultPct = Math.max(0, Math.min(100, num(s.cultPct))) / 100;

    const excTotal = alcoholRevenue * 0.16; // aaetlad afengisgjald
    const totalRevenue = alcoholRevenue + ticketSales + lodging;

    const outVatAlc = alcoholRevenue - alcoholRevenue / (1 + VSK_AFENGI);
    const outVatTix = 0; // tónleikamiðar eru VSK-frjálsir
    const outVatLodging = lodging - lodging / (1 + VSK_LAGT);
    const outputVAT = outVatAlc + outVatTix + outVatLodging;

    const rentInputVat = rentGross - rentGross / (1 + VSK_ALM);
    const mktInputVat = mktGross - mktGross / (1 + VSK_ALM);
    const securityNet = securityGross / (1 + VSK_ALM);
    const soundNet = soundGross / (1 + VSK_ALM);
    const securityInputVat = securityGross - securityNet;
    const soundInputVat = soundGross - soundNet;
    const other24InputVat = other24Gross - other24Gross / (1 + VSK_ALM);
    const crew11InputVat = crew11Gross - crew11Gross / (1 + VSK_LAGT);
    const alcCogsGross = alcoholRevenue * 0.35;
    const alcInputVat = alcCogsGross - alcCogsGross / (1 + VSK_AFENGI);
    const inputVAT = rentInputVat + mktInputVat + securityInputVat + soundInputVat + other24InputVat + crew11InputVat + alcInputVat;
    const netVAT = Math.max(0, outputVAT - inputVAT);

    // Aðkeypt þjónusta (öryggi, hljóð) er aðallega launakostnaður hjá þjónustuveitanda
    // og myndar þannig sömu launatengdu skatta og bein laun.
    const laborBase = wages + securityNet + soundNet;
    const payroll = laborBase * TRYGGINGAGJALD;
    const incomeTaxState = laborBase * TEKJUSKATTUR_HLUTI;
    const municipal = laborBase * UTSVAR;

    const stateTotal = netVAT + excTotal + payroll + incomeTaxState;
    const municipalTotal = municipal;
    const govTotal = stateTotal + municipalTotal;

    // menningarvidbot
    const derivedVat = derivedSales - derivedSales / (1 + VSK_AFENGI);
    const cultureExcise = excTotal * cultPct;
    const cultureVatAlc = (outVatAlc - alcInputVat) * cultPct;
    const cultureVatTix = outVatTix;
    const cultureVatLodging = outVatLodging; // gisting á viðburði er 100% menningardrifin
    const cultureLabour = payroll + incomeTaxState + municipal;
    const cultureAdditional =
      cultureLabour + cultureExcise + Math.max(0, cultureVatAlc) + cultureVatTix + cultureVatLodging + derivedVat;
    const cultureShare = govTotal > 0 ? Math.min(1, cultureAdditional / govTotal) : 0;

    const netWages = wages - wages * STADGR_THREP1;
    const cashOut = netWages + securityGross + soundGross + rentGross + mktGross + other24Gross + crew11Gross + govTotal;
    const organizerShare = totalRevenue - cashOut;

    const mult = grant > 0 ? govTotal / grant : 0;

    return {
      excTotal, totalRevenue, outVatAlc, outVatTix, outVatLodging, outputVAT, inputVAT, netVAT,
      payroll, incomeTaxState, municipal, stateTotal, municipalTotal, govTotal,
      cultureAdditional, cultureShare, organizerShare, grant, mult,
    };
  }, [s]);

  const setMode = (m) => setS((p) => ({ ...p, mode: m }));
  const load = (preset) => setS({ ...preset });

  const summary = () => {
    const txt =
`MENNING ER SKATTSTOFN — Samantekt
${s.mode === 'annual' ? 'Árlegt skattspor venue' : 'Stakur viðburður'}

Heildartekjur: ${fmt(r.totalRevenue)}
Skatttekjur hins opinbera samtals: ${fmt(r.govTotal)}
  Til ríkis: ${fmt(r.stateTotal)}
  Til sveitarfélags (útsvar): ${fmt(r.municipalTotal)}
  Þar af beinlínis vegna tónleikanna: ${fmt(r.cultureAdditional)} (${Math.round(r.cultureShare * 100)}%)
Hlutur tónleikahaldara: ${fmt(r.organizerShare)}${
      r.grant > 0
        ? `\n\nMargfaldari: ${r.mult.toFixed(1)}× skattkrónur á hverja styrkkrónu (${fmt(r.grant)} styrkur)`
        : ''
    }`;
    navigator.clipboard.writeText(txt).then(() => alert('Samantekt afrituð á klippiborð.'));
  };

  const neg = r.organizerShare < 0;

  return (
    <div className="wrap">
      <header>
        <div className="stamp no-print">Drög · 2026</div>
        <div className="kicker">Skattgreining tónlistarviðburða</div>
        <h1>Menning er <em>skattstofn</em>,<br />ekki skraut.</h1>
        <p className="dek">
          Hverjir einustu tónleikar framleiða skatttekjur í gegnum fimm aðskilda skattstofna samtímis.
          Þetta tól sýnir töluna — og hvað hún þýðir.
        </p>
      </header>

      <div className="rule" />

      <div className="tabs">
        <button className={'tab' + (s.mode === 'event' ? ' active' : '')} onClick={() => setMode('event')}>
          Stakur viðburður<small>Eitt kvöld, ein tala</small>
        </button>
        <button className={'tab' + (s.mode === 'annual' ? ' active' : '')} onClick={() => setMode('annual')}>
          Heilt ár á venue<small>Ársvelta → árlegt skattspor</small>
        </button>
      </div>

      <div className="grid">
        {/* INPUT */}
        <div className="panel">
          <h2>{s.mode === 'annual' ? 'Heilt ár á venue' : 'Stakur viðburður'}</h2>
          <p className="sub">{s.mode === 'annual' ? 'Sláðu inn heildartölur ársins.' : 'Sláðu inn tölur eins kvölds.'}</p>

          <div className="scenario-chips no-print">
            <div className="chip" onClick={() => load(DILLON)}>🎵 Dillon Tónleikar</div>
            <div className="chip" onClick={() => load(STORT)}>🏟 Stórtónleikar (dæmi)</div>
            <div className="chip" onClick={() => load(ECLIPSE_2026)}>🌒 Eclipse 2026</div>
            <div className="chip" onClick={() => load(EMPTY)}>↺ Hreinsa</div>
          </div>

          {s.mode === 'annual' && (
            <div className="annual-note">
              <strong>Ársstilling.</strong> Sláðu inn heildartölur ársins. Vélin gerir ráð fyrir að staðurinn
              sé <em>eingöngu opinn á tónleikakvöldum</em> — svo öll velta er menningartengd.
            </div>
          )}

          <div className="group-title">Tekjur</div>
          <Field label="Áfengissala" hint="(með VSK, 11% — veitingaþrep)">
            <KrInput value={s.alcoholTotal} onChange={set('alcoholTotal')} />
          </Field>

          {s.mode === 'event' && (
            <>
              <Field label="Miðasala" hint="(VSK-frjáls — engin skattskil til ríkis)">
                <KrInput value={s.ticketSales} onChange={set('ticketSales')} />
              </Field>
              <Field label="Gisting" hint="(tjöld, glamping, húsbílar — 11% VSK)">
                <KrInput value={s.lodging} onChange={set('lodging')} />
              </Field>
            </>
          )}

          <div className="group-title">Gjöld</div>
          <Field label="Laun — heildarlaunakostnaður" hint="(brúttó laun starfsfólks + listafólks)">
            <KrInput value={s.wages} onChange={set('wages')} />
          </Field>
          <div className="row2">
            <Field label="Öryggisgæsla" hint="(aðkeypt, m. 24% VSK)" small>
              <KrInput value={s.security} onChange={set('security')} />
            </Field>
            <Field label="Hljóðmennska" hint="(aðkeypt, m. 24% VSK)" small>
              <KrInput value={s.sound} onChange={set('sound')} />
            </Field>
          </div>
          <div className="row2">
            <Field label="Leiga" hint="(m. VSK)" small>
              <KrInput value={s.rent} onChange={set('rent')} />
            </Field>
            <Field label="Markaðskostn." hint="(m. VSK)" small>
              <KrInput value={s.marketing} onChange={set('marketing')} />
            </Field>
          </div>
          <Field label="Önnur aðföng" hint="(búnaðarleiga, flutningar, rafmagn o.fl. — 24% VSK)">
            <KrInput value={s.other24} onChange={set('other24')} />
          </Field>
          <Field label="Gisting & uppihald (listamenn/starfsfólk)" hint="(11% VSK)">
            <KrInput value={s.crew11} onChange={set('crew11')} />
          </Field>

          <Field label="Afleidd sala sem tónleikarnir framkalla annars staðar"
                 hint="(valfrjálst) Sala sem verður til vegna tónleikanna á öðrum stöðum — matur, kokteilar, betri vörur. Sjálfgefið 0.">
            <KrInput value={s.derived} onChange={set('derived')} />
          </Field>

          <Field label="Hve stór hluti barsölu er tónleikadrifinn?"
                 hint="Á tónleikastað kemur fólk vegna tónlistarinnar — tómt hús selur ekki. Lækkaðu til að sýna „jafnvel í versta falli“.">
            <div className="slider-row">
              <input type="range" min="0" max="100" step="5" value={s.cultPct} onChange={set('cultPct')} />
              <span className="slider-val">{s.cultPct}%</span>
            </div>
          </Field>

          <div className="group-title">
            Opinber stuðningur <span className="optional">(valfrjálst)</span>
          </div>
          <Field label="Opinber styrkur til viðburðar / venue"
                 hint="Settu inn styrk og vélin reiknar margfaldarann: hve margar skattkrónur koma til baka á hverja styrkkrónu.">
            <KrInput value={s.grant} onChange={set('grant')} />
          </Field>
        </div>

        {/* RESULT */}
        <div className="result-panel">
          <div className="hero-number">
            <div className="htag">{s.mode === 'annual' ? 'Árlegt skattspor' : 'Skatttekjur ríkis & sveitarfélaga'}</div>
            <div className="hval">{fmt(r.govTotal)}</div>
            <div className="hsuffix">{s.mode === 'annual' ? 'sem þessi eini staður framleiðir á ári' : 'af þessum eina viðburði'}</div>
          </div>

          {r.grant > 0 && (
            <div className="multiplier-band">
              <div className="mbig">{r.mult.toFixed(1)}×</div>
              <div className="mtext">
                <strong>skattkrónur á hverja styrkkrónu</strong>
                <span>{fmt(r.grant)} styrkur → {fmt(r.govTotal)} í skatttekjur</span>
              </div>
            </div>
          )}

          <div className="breakdown">
            <div className="bd-section">
              <div className="bd-head">Ríkissjóður fær</div>
              <Bd label="Virðisaukaskattur (nettó)" val={r.netVAT} />
              <Bd label="Áfengisgjald" val={r.excTotal} />
              <Bd label="Tryggingagjald (6,35%)" val={r.payroll} />
              <Bd label="Staðgreiðsla (ríkishluti)" val={r.incomeTaxState} />
              <Bd label="Til ríkisins" val={r.stateTotal} total />
            </div>
            <div className="bd-section">
              <div className="bd-head">Sveitarfélagið fær</div>
              <Bd label="Útsvar (14,94%)" val={r.municipalTotal} />
            </div>
            <div className="bd-section">
              <div className="bd-head">VSK sundurliðun</div>
              <Bd label="Útskattur (af sölu)" val={r.outputVAT} />
              <Bd label="• áfengi (11%)" val={r.outVatAlc} sub />
              <Bd label="• gisting (11%)" val={r.outVatLodging} sub />
              <Bd label="• miðar — VSK-frjálsir" val={0} sub />
              <div className="bd-line"><span>Innskattur (af aðföngum)</span><span>-{fmt(r.inputVAT)}</span></div>
            </div>
          </div>

          <div className="culture-band">
            <div className="cb-tag">Þar af beinlínis vegna tónleikanna</div>
            <div className="cb-num">{fmt(r.cultureAdditional)}</div>
            <div className="cb-share">{Math.round(r.cultureShare * 100)}% af heildar-skattsporinu</div>
            <div className="cb-note">
              Skattsporið sem <strong>hyrfi ef tónleikarnir féllu niður</strong> — launatengd gjöld listafólks
              og starfsfólks, miðar, og sá hluti barsölu sem er tilkominn vegna tónlistarinnar. Stilltu
              hlutfallið vinstra megin. Punkturinn stendur eftir á öllum stillingum: menningin framkallar
              skatttekjurnar, ríkið innheimtir þær.
            </div>
          </div>

          <div className="gov-vs">
            <div>
              <div className="gvtag">Ríkið tekur (VSK, áfengisgj., tryggingagj., staðgr.)</div>
              <div className="gvnum gov">{fmt(r.stateTotal)}</div>
            </div>
            <div>
              <div className="gvtag">{s.mode === 'annual' ? 'Hlutur — hæðin ein og sér' : 'Hlutur tónleikahaldara'}</div>
              <div className={'gvnum you' + (neg ? ' neg' : '')}>{fmt(r.organizerShare)}</div>
            </div>
          </div>

          <div className="municipal-note">
            Útsvar ({fmt(r.municipalTotal)}) rennur til lögheimilissveitarfélags hvers starfsmanns — ekki til
            staðarins. Tölurnar hér að ofan eru <strong>ríkishlutinn</strong>, sem fellur til óháð því hvar fólk býr.
          </div>

          {s.mode === 'annual' && neg && (
            <div className="share-context">
              Tónlistarhæðin skilar <strong>{fmt(Math.abs(r.organizerShare))} tapi</strong> á árinu þegar hún er
              skoðuð ein og sér. Á sama tíma tók ríkið <strong>{fmt(r.stateTotal)}</strong> í skatttekjur af
              starfseminni (auk {fmt(r.municipalTotal)} í útsvar). Tónleikahaldarinn leggur til úr eigin vasa
              til að halda grasrótinni gangandi — og <strong>niðurgreiðir um leið ríkissjóð</strong>. Menningin
              fjármagnar ríkið, ekki öfugt.
            </div>
          )}
        </div>
      </div>

      <div className="actions no-print">
        <button className="btn btn-primary" onClick={() => window.print()}>⎙ Prenta / vista sem PDF</button>
        <button className="btn btn-ghost" onClick={summary}>⧉ Afrita samantekt</button>
      </div>

      <div className="footnote">
        <strong>Forsendur (staðfestar fyrir 2026):</strong> VSK á veitingasölu áfengis 11% (veitingaþrep) · Tónleikamiðar
        eru VSK-frjálsir · VSK almennt þrep 24% (leiga, markaðskostnaður) · Tryggingagjald 6,35% ·
        Útsvar (vegið meðaltal) 14,94% · Staðgreiðsla 31,49% (ríkishluti 16,55%) · Áfengisgjald: bjór 156,45,
        vín 142,50, sterkt 192,85 kr/cl af hreinum vínanda umfram 2,25 cl/lítra. Innskattur áfengiskaupa
        reiknast af 11%. Heimildir: Skatturinn (lög nr. 99/2025) og fjármála- og efnahagsráðuneytið.
        <br /><br />
        <em>Tólið gefur áætlun til að sýna stærðargráðu skattsporsins. „Þar af beinlínis vegna tónleikanna“
        er varfærin tala — hún eignar menningu hvorki áfengisgjald né VSK af barsölu, aðeins það sem hyrfi ef
        tónleikarnir féllu niður.</em>
      </div>

      <style jsx>{`
        .wrap { max-width: 1180px; margin: 0 auto; padding: 48px 24px 80px; }
        header { text-align: center; margin-bottom: 8px; position: relative; }
        .kicker { text-transform: uppercase; letter-spacing: 0.32em; font-size: 0.72rem; font-weight: 700; color: var(--blood); margin-bottom: 18px; }
        h1 { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: clamp(2.6rem, 6vw, 4.8rem); line-height: 0.95; letter-spacing: -0.02em; margin-bottom: 6px; }
        h1 em { font-style: italic; color: var(--blood); }
        .dek { font-family: 'Archivo', sans-serif; font-style: italic; font-size: clamp(1rem, 2vw, 1.35rem); font-weight: 500; max-width: 620px; margin: 18px auto 0; color: #4a3d30; }
        .rule { width: 100%; height: 2px; background: var(--ink); margin: 34px 0; position: relative; }
        .rule::after { content: '◆'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--paper); padding: 0 14px; color: var(--blood); font-size: 0.8rem; }
        .tabs { display: flex; border: 2px solid var(--ink); border-radius: 2px; overflow: hidden; margin-bottom: 32px; }
        .tab { flex: 1; padding: 16px 20px; background: transparent; border: none; cursor: pointer; font-family: 'Archivo'; font-weight: 700; font-size: 0.92rem; color: var(--ink); border-right: 2px solid var(--ink); text-transform: uppercase; letter-spacing: 0.04em; transition: all 0.2s; }
        .tab:last-child { border-right: none; }
        .tab.active { background: var(--ink); color: var(--paper); }
        .tab small { display: block; font-weight: 400; text-transform: none; letter-spacing: 0; font-size: 0.72rem; opacity: 0.7; margin-top: 3px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
        @media (max-width: 880px) { .grid { grid-template-columns: 1fr; } }
        .panel { background: var(--paper-deep); border: 2px solid var(--ink); border-radius: 3px; padding: 28px; box-shadow: 6px 6px 0 var(--shadow); }
        h2 { font-family: 'Archivo', sans-serif; font-size: 1.5rem; font-weight: 900; margin-bottom: 4px; }
        .sub { font-size: 0.82rem; color: #6a5a48; margin-bottom: 22px; }
        .group-title { font-family: 'Archivo'; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--blood-deep); margin: 26px 0 12px; padding-bottom: 6px; border-bottom: 1.5px dashed var(--line); }
        .optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: #7a6a55; }
        .scenario-chips { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
        .chip { font-family: 'Archivo'; font-weight: 600; font-size: 0.78rem; padding: 8px 16px; border: 1.5px solid var(--line); border-radius: 20px; cursor: pointer; background: var(--paper); transition: all 0.15s; }
        .chip:hover { border-color: var(--blood); color: var(--blood); }
        .annual-note { background: var(--paper); border-left: 4px solid var(--gold); padding: 12px 16px; font-size: 0.8rem; margin-bottom: 20px; border-radius: 2px; color: #5a4a38; }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .slider-row { display: flex; align-items: center; gap: 14px; margin-top: 4px; }
        .slider-row input[type=range] { flex: 1; accent-color: var(--blood); }
        .slider-val { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 1.2rem; min-width: 54px; text-align: right; color: var(--blood); }
        .result-panel { background: var(--ink); color: var(--paper); border: 2px solid var(--ink); border-radius: 3px; box-shadow: 6px 6px 0 var(--shadow); position: sticky; top: 24px; overflow: hidden; }
        @media (max-width: 880px) { .result-panel { position: relative; top: 0; } }
        .hero-number { padding: 32px 28px 28px; text-align: center; background: linear-gradient(160deg, #221a14 0%, #1a1410 100%); border-bottom: 2px solid var(--gold); }
        .htag { text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.68rem; color: var(--gold-soft); font-weight: 700; margin-bottom: 12px; }
        .hval { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: clamp(2.4rem, 6vw, 3.6rem); line-height: 1; color: var(--paper); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .hsuffix { font-size: 0.9rem; color: var(--gold-soft); margin-top: 8px; font-style: italic; font-family: 'Archivo', sans-serif; }
        .multiplier-band { background: var(--green); color: #fff; padding: 18px 28px; display: flex; align-items: center; gap: 16px; border-bottom: 2px solid var(--ink); }
        .mbig { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 2.6rem; line-height: 1; font-variant-numeric: tabular-nums; }
        .mtext { font-size: 0.86rem; line-height: 1.35; }
        .mtext strong { display: block; font-size: 0.96rem; }
        .breakdown { padding: 24px 28px; }
        .bd-section { margin-bottom: 22px; }
        .bd-section:last-child { margin-bottom: 0; }
        .bd-head { text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.66rem; font-weight: 700; color: var(--gold-soft); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #4a3d30; }
        .culture-band { background: var(--paper); color: var(--ink); padding: 20px 28px; border-top: 2px solid var(--gold); }
        .cb-tag { text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.64rem; font-weight: 700; color: var(--blood-deep); margin-bottom: 8px; }
        .cb-num { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 1.9rem; line-height: 1; font-variant-numeric: tabular-nums; color: var(--green); }
        .cb-share { font-size: 0.8rem; color: #6a5a48; margin-top: 5px; font-weight: 600; }
        .cb-note { font-size: 0.76rem; color: #5a4a38; margin-top: 12px; line-height: 1.5; }
        .cb-note strong { color: var(--blood-deep); }
        .gov-vs { display: grid; grid-template-columns: 1fr 1fr; margin-top: 6px; border-top: 2px solid #4a3d30; }
        .gov-vs > div { padding: 18px 28px; }
        .gov-vs > div:first-child { border-right: 1px solid #4a3d30; }
        .gvtag { font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--gold-soft); margin-bottom: 8px; font-weight: 700; }
        .gvnum { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 1.5rem; font-variant-numeric: tabular-nums; }
        .gvnum.gov { color: var(--gold-soft); }
        .gvnum.you { color: #fff; }
        .gvnum.neg { color: var(--blood); }
        .municipal-note { padding: 12px 28px; border-top: 1px solid #4a3d30; font-size: 0.74rem; color: #9a8a75; font-style: italic; line-height: 1.45; }
        .municipal-note strong { color: #c8b89e; }
        .share-context { padding: 14px 28px; border-top: 1px solid #4a3d30; font-size: 0.78rem; color: #c8b89e; font-style: italic; line-height: 1.5; }
        .share-context strong { color: var(--gold-soft); }
        .actions { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
        .footnote { margin-top: 32px; font-size: 0.74rem; color: #7a6a55; line-height: 1.6; }
        .footnote strong { color: var(--ink); }
        .stamp { position: absolute; top: 24px; right: 24px; transform: rotate(8deg); border: 2.5px solid var(--blood); color: var(--blood); border-radius: 4px; padding: 4px 12px; font-family: 'Archivo'; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.85; }
        @media (max-width: 880px) { .stamp { display: none; } }
      `}</style>
    </div>
  );
}

function Field({ label, hint, small, children }) {
  return (
    <div style={{ marginBottom: small ? 0 : 18 }}>
      <label style={{ display: 'block', fontSize: small ? '0.7rem' : '0.82rem', fontWeight: small ? 600 : 700, marginBottom: small ? 4 : 6, color: small ? '#6a5a48' : 'var(--ink)' }}>
        {label} {hint && <span style={{ fontWeight: 400, color: '#7a6a55', fontSize: '0.74rem' }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}

function KrInput({ value, onChange }) {
  return (
    <div style={{ position: 'relative' }}>
      <input
        type="number" value={value} onChange={onChange} placeholder="0"
        style={{
          width: '100%', padding: '12px 44px 12px 14px', border: '1.5px solid var(--line)',
          borderRadius: 2, background: 'var(--paper)', fontFamily: 'Archivo', fontSize: '1.05rem',
          fontWeight: 600, color: 'var(--ink)',
        }}
      />
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#9a8a75', fontSize: '0.9rem', fontWeight: 600 }}>kr</span>
    </div>
  );
}

function Bd({ label, val, total, sub }) {
  return (
    <div className="bd-line" style={{
      display: 'flex', justifyContent: 'space-between',
      padding: sub ? '2px 0 2px 14px' : total ? '10px 0 0' : '5px 0',
      fontSize: sub ? '0.78rem' : total ? '1.05rem' : '0.9rem',
      fontWeight: total ? 800 : 400,
      borderTop: total ? '1.5px solid var(--gold)' : 'none',
      marginTop: total ? 8 : 0,
    }}>
      <span style={{ color: total ? 'var(--gold-soft)' : sub ? '#9a8a75' : '#d8cab5' }}>{label}</span>
      <span style={{ color: total ? 'var(--gold-soft)' : 'inherit', fontWeight: total ? 800 : 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(val)}</span>
    </div>
  );
}
