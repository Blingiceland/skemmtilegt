'use client';
import { useState, useMemo } from 'react';

// ===== FORSENDUR =====
const VSK_ALM = 0.24;
const VSK_LAGT = 0.11;
const TRYGGINGAGJALD = 0.0635;
const UTSVAR = 0.1494;
const STADGR_THREP1 = 0.3149;
const TEKJUSKATTUR_HLUTI = STADGR_THREP1 - UTSVAR; // 0.1655
const STADGR_ERLENT = 0.20; // afdráttarskattur erlendra listamanna
const AFENGISGJ_HLUTFALL = 0.16; // varfærin áætlun

const fmt = (n) => Math.round(n).toLocaleString('is-IS') + ' kr';
const num = (v) => { const x = parseFloat(v); return isNaN(x) ? 0 : x; };

const PRESET_2026 = {
  ticketSales: '120000000', camping: '28000000', alcoholSales: '52000000',
  foodSales: '24000000', merchSales: '8500000', sponsorship: '16000000',
  foreignArtists: '62000000', domesticWages: '34000000',
  setup: '18000000', teardown: '7000000', soundLights: '26000000',
  security: '11000000', infra: '13000000', siteRent: '9000000',
  marketing: '14000000', insurance: '6000000',
  offsiteLodging: '75000000', offsiteOther: '180000000', grant: '',
};
const EMPTY = {
  ticketSales: '', camping: '', alcoholSales: '', foodSales: '',
  merchSales: '', sponsorship: '', foreignArtists: '', domesticWages: '',
  setup: '', teardown: '', soundLights: '', security: '', infra: '',
  siteRent: '', marketing: '', insurance: '',
  offsiteLodging: '', offsiteOther: '', grant: '',
};

export default function Hatid() {
  const [s, setS] = useState({ ...EMPTY });
  const set = (k) => (e) => setS((p) => ({ ...p, [k]: e.target.value }));

  const r = useMemo(() => {
    const ticket = num(s.ticketSales);
    const camping = num(s.camping);
    const alcohol = num(s.alcoholSales);
    const food = num(s.foodSales);
    const merch = num(s.merchSales);
    const sponsor = num(s.sponsorship);

    const foreignA = num(s.foreignArtists);
    const wages = num(s.domesticWages);
    const setup = num(s.setup);
    const teardown = num(s.teardown);
    const soundLights = num(s.soundLights);
    const security = num(s.security);
    const infra = num(s.infra);
    const siteRent = num(s.siteRent);
    const marketing = num(s.marketing);
    const insurance = num(s.insurance);
    const grant = num(s.grant);

    const offsiteLodging = num(s.offsiteLodging);
    const offsiteOther = num(s.offsiteOther);

    // ===== ÚTSKATTUR (output VAT) =====
    const outVatCamping = camping - camping / (1 + VSK_LAGT);
    const outVatAlc = alcohol - alcohol / (1 + VSK_LAGT);
    const outVatFood = food - food / (1 + VSK_LAGT);
    const outVatMerch = merch - merch / (1 + VSK_ALM);
    const outVatSponsor = sponsor - sponsor / (1 + VSK_ALM);
    const outputVAT = outVatCamping + outVatAlc + outVatFood + outVatMerch + outVatSponsor;

    // ===== INNSKATTUR (input VAT, brúttó áður en hlutdeild er reiknuð) =====
    const items24 = [setup, teardown, soundLights, security, infra, siteRent, marketing];
    const inputVAT24 = items24.reduce((a, b) => a + (b - b / (1 + VSK_ALM)), 0);
    const alcCogsGross = alcohol * 0.35;
    const alcInputVat = alcCogsGross - alcCogsGross / (1 + VSK_LAGT);
    const foodCogsGross = food * 0.60;
    const foodInputVat = foodCogsGross - foodCogsGross / (1 + VSK_LAGT);
    const totalInputVAT = inputVAT24 + alcInputVat + foodInputVat;

    // ===== HLUTFALLSLEG INNSKATTSHLUTDEILD =====
    // VSK-skyld velta vs. heildarvelta (incl. VSK-frjáls miðasala)
    const vatableRevenue = camping + alcohol + food + merch + sponsor;
    const totalRevenue = vatableRevenue + ticket;
    const recoveryRatio = totalRevenue > 0 ? vatableRevenue / totalRevenue : 1;
    const recoverableInputVAT = totalInputVAT * recoveryRatio;
    const lostInputVAT = totalInputVAT - recoverableInputVAT;
    const netVAT = Math.max(0, outputVAT - recoverableInputVAT);

    // ===== ÁFENGISGJALD =====
    const excTotal = alcohol * AFENGISGJ_HLUTFALL;

    // ===== LAUNATENGD GJÖLD =====
    const payroll = wages * TRYGGINGAGJALD;
    const incomeTaxState = wages * TEKJUSKATTUR_HLUTI;
    const municipal = wages * UTSVAR;

    // ===== ERLENDIR LISTAMENN — 20% AFDRÁTTUR =====
    const foreignWithholding = foreignA * STADGR_ERLENT;

    // ===== SAMTALA Á SVÆÐINU =====
    const stateDirect = netVAT + excTotal + payroll + incomeTaxState + foreignWithholding;
    const municipalDirect = municipal;
    const govDirect = stateDirect + municipalDirect;

    // ===== FERÐAMANNAFÓTSPOR (utan svæðis) =====
    const spilloverVatLodging = offsiteLodging - offsiteLodging / (1 + VSK_LAGT);
    const spilloverVatOther = offsiteOther - offsiteOther / (1 + VSK_ALM);
    const spilloverTotal = spilloverVatLodging + spilloverVatOther;
    const govWithSpillover = govDirect + spilloverTotal;

    // ===== HLUTUR HÁTÍÐAR =====
    const otherCostsGross = setup + teardown + soundLights + security + infra + siteRent + marketing + insurance;
    const totalOrgPaid = wages + payroll + foreignA + otherCostsGross + netVAT + excTotal;
    const organizerShare = totalRevenue - totalOrgPaid;

    const mult = grant > 0 ? govWithSpillover / grant : 0;

    return {
      totalRevenue, vatableRevenue, ticketShareExempt: totalRevenue > 0 ? ticket / totalRevenue : 0,
      outputVAT, totalInputVAT, recoverableInputVAT, lostInputVAT, recoveryRatio, netVAT,
      excTotal, payroll, incomeTaxState, municipal, foreignWithholding,
      stateDirect, municipalDirect, govDirect,
      spilloverVatLodging, spilloverVatOther, spilloverTotal, govWithSpillover,
      organizerShare, grant, mult,
    };
  }, [s]);

  const load = (preset) => setS({ ...preset });
  const neg = r.organizerShare < 0;

  return (
    <div className="hwrap">
      <header className="hhead">
        <div className="stamp no-print">Drög · 2026</div>
        <div className="kicker">Alþjóðleg tónlistarhátíð</div>
        <h1>Þegar <em>miðinn</em> er VSK-frjáls<br />borgar haldarinn brúsann.</h1>
        <p className="dek">
          Erlendir listamenn skila 20% staðgreiðslu. Tjaldgisting 11% VSK. Miðasalan VSK-frjáls — sem þýðir
          að haldari fær aðeins hluta af innskattinum til baka. Reiknivélin sýnir nákvæmlega hvaða krónur
          renna hvert.
        </p>
      </header>

      <div className="rule" />

      <div className="grid">
        {/* ===== INPUT ===== */}
        <div className="panel">
          <h2>Tölur hátíðar</h2>
          <p className="sub">Sláðu inn heildartölur fyrir alla hátíðina.</p>

          <div className="scenario-chips no-print">
            <div className="chip" onClick={() => load(PRESET_2026)}>🎪 Mín hátíð 2026 (dæmi)</div>
            <div className="chip" onClick={() => load(EMPTY)}>↺ Hreinsa</div>
          </div>

          <div className="group-title">Tekjur</div>
          <Field label="Miðasala" hint="(VSK-frjáls — engin útskattsskil, engin innskattshlutdeild)">
            <KrInput value={s.ticketSales} onChange={set('ticketSales')} />
          </Field>
          <div className="row2">
            <Field label="Gisting á svæði" hint="(tjöld, glamping, húsbílar — 11% VSK)" small>
              <KrInput value={s.camping} onChange={set('camping')} />
            </Field>
            <Field label="Áfengissala" hint="(11% VSK + áfengisgj.)" small>
              <KrInput value={s.alcoholSales} onChange={set('alcoholSales')} />
            </Field>
          </div>
          <div className="row2">
            <Field label="Matur & drykkir" hint="(11% VSK)" small>
              <KrInput value={s.foodSales} onChange={set('foodSales')} />
            </Field>
            <Field label="Merchandise" hint="(24% VSK)" small>
              <KrInput value={s.merchSales} onChange={set('merchSales')} />
            </Field>
          </div>
          <Field label="Styrkir / kostun" hint="(24% VSK)">
            <KrInput value={s.sponsorship} onChange={set('sponsorship')} />
          </Field>

          <div className="group-title">Listamenn & starfsfólk</div>
          <Field label="Erlendir listamenn" hint="(brúttó þóknun → 20% staðgreiðsla, engin önnur launatengd gjöld)">
            <KrInput value={s.foreignArtists} onChange={set('foreignArtists')} />
          </Field>
          <Field label="Íslenskir listamenn & starfsfólk" hint="(brúttó laun → fullt launalínumódel)">
            <KrInput value={s.domesticWages} onChange={set('domesticWages')} />
          </Field>

          <div className="group-title">Aðkeypt þjónusta (24% VSK)</div>
          <div className="row2">
            <Field label="Uppsetning" small>
              <KrInput value={s.setup} onChange={set('setup')} />
            </Field>
            <Field label="Niðurtekt" small>
              <KrInput value={s.teardown} onChange={set('teardown')} />
            </Field>
          </div>
          <div className="row2">
            <Field label="Hljóð / ljós / svið" small>
              <KrInput value={s.soundLights} onChange={set('soundLights')} />
            </Field>
            <Field label="Öryggisgæsla" small>
              <KrInput value={s.security} onChange={set('security')} />
            </Field>
          </div>
          <div className="row2">
            <Field label="Innviðir" hint="(salerni, vatn, rafmagn, hreinsun)" small>
              <KrInput value={s.infra} onChange={set('infra')} />
            </Field>
            <Field label="Leiga á svæði" small>
              <KrInput value={s.siteRent} onChange={set('siteRent')} />
            </Field>
          </div>
          <div className="row2">
            <Field label="Markaðskostn." small>
              <KrInput value={s.marketing} onChange={set('marketing')} />
            </Field>
            <Field label="Tryggingar" hint="(VSK-frjálsar)" small>
              <KrInput value={s.insurance} onChange={set('insurance')} />
            </Field>
          </div>
          <div className="subtotal">
            <span>Samtals aðkeypt þjónusta</span>
            <span>{fmt(num(s.setup) + num(s.teardown) + num(s.soundLights) + num(s.security) + num(s.infra) + num(s.siteRent) + num(s.marketing) + num(s.insurance))}</span>
          </div>

          <div className="group-title">Ferðamannafótspor (utan svæðis)</div>
          <Field label="Gisting erlendra gesta utan hátíðar" hint="(hótel, gistihús — 11% VSK)">
            <KrInput value={s.offsiteLodging} onChange={set('offsiteLodging')} />
          </Field>
          <Field label="Önnur eyðsla erlendra gesta" hint="(veitingar, leigubílar, verslun, ferðir — ≈24% VSK)">
            <KrInput value={s.offsiteOther} onChange={set('offsiteOther')} />
          </Field>

          <div className="group-title">Opinber stuðningur <span className="optional">(valfrjálst)</span></div>
          <Field label="Opinber styrkur til hátíðar" hint="Margfaldari reiknast á heildar-skattspor (m.t.t. ferðamannafótspors).">
            <KrInput value={s.grant} onChange={set('grant')} />
          </Field>
        </div>

        {/* ===== RESULT ===== */}
        <div className="result-panel">
          <div className="hero-number">
            <div className="htag">Skattspor hátíðar — heildarsamtala</div>
            <div className="hval">{fmt(r.govWithSpillover)}</div>
            <div className="hsuffix">
              {fmt(r.govDirect)} á svæði + {fmt(r.spilloverTotal)} í ferðamannafótspori
            </div>
          </div>

          {r.grant > 0 && (
            <div className="multiplier-band">
              <div className="mbig">{r.mult.toFixed(1)}×</div>
              <div className="mtext">
                <strong>skattkrónur á hverja styrkkrónu</strong>
                <span>{fmt(r.grant)} styrkur → {fmt(r.govWithSpillover)} í skatttekjur</span>
              </div>
            </div>
          )}

          {r.lostInputVAT > 0 && (
            <div className="vat-loss-band">
              <div className="vlt">VSK-frelsi miðasölu kostar haldarann</div>
              <div className="vlv">{fmt(r.lostInputVAT)}</div>
              <div className="vln">
                Innskattshlutdeild er aðeins <strong>{Math.round(r.recoveryRatio * 100)}%</strong> því
                miðasalan ({Math.round(r.ticketShareExempt * 100)}% af veltu) er VSK-frjáls. Þessi innskattur
                breytist í ósýnilegan kostnað fyrir hátíðina — og <strong>í tekjur fyrir ríkið</strong>.
              </div>
            </div>
          )}

          <div className="breakdown">
            <div className="bd-section">
              <div className="bd-head">Ríkissjóður fær — á svæði</div>
              <Bd label="Virðisaukaskattur (nettó)" val={r.netVAT} />
              <Bd label="Áfengisgjald" val={r.excTotal} />
              <Bd label="Tryggingagjald (6,35%)" val={r.payroll} />
              <Bd label="Staðgreiðsla — innlent (ríkishluti)" val={r.incomeTaxState} />
              <Bd label="Afdráttur — erlendir listamenn (20%)" val={r.foreignWithholding} highlight />
              <Bd label="Til ríkisins (á svæði)" val={r.stateDirect} total />
            </div>
            <div className="bd-section">
              <div className="bd-head">Sveitarfélagið fær</div>
              <Bd label="Útsvar — innlent (14,94%)" val={r.municipalDirect} />
            </div>
            <div className="bd-section">
              <div className="bd-head">VSK sundurliðun</div>
              <Bd label="Útskattur (af sölu)" val={r.outputVAT} />
              <Bd label="Innskattur (brúttó af aðföngum)" val={r.totalInputVAT} />
              <Bd label={`• endurheimt (${Math.round(r.recoveryRatio * 100)}%)`} val={r.recoverableInputVAT} sub />
              <Bd label="• tapað vegna VSK-frelsis miðasölu" val={r.lostInputVAT} sub />
            </div>
          </div>

          <div className="spillover-band">
            <div className="sb-tag">Ferðamannafótspor — VSK utan svæðis</div>
            <div className="sb-num">{fmt(r.spilloverTotal)}</div>
            <div className="sb-rows">
              <div><span>Gisting (11%)</span><span>{fmt(r.spilloverVatLodging)}</span></div>
              <div><span>Önnur eyðsla (24%)</span><span>{fmt(r.spilloverVatOther)}</span></div>
            </div>
            <div className="sb-note">
              Hátíðin er útflutningsvara: erlendir gestir bera krónur inn í íslenska hagkerfið sem
              ekki væru hér án hennar. Þessi VSK er ósýnilegur í bókhaldi hátíðarinnar — en hann er raunverulegur.
            </div>
          </div>

          <div className="gov-vs">
            <div>
              <div className="gvtag">Ríkið + sveitarfélög taka samtals</div>
              <div className="gvnum gov">{fmt(r.govWithSpillover)}</div>
            </div>
            <div>
              <div className="gvtag">Hlutur hátíðar</div>
              <div className={'gvnum you' + (neg ? ' neg' : '')}>{fmt(r.organizerShare)}</div>
            </div>
          </div>

          {neg && (
            <div className="share-context">
              Hátíðin er rekin með <strong>{fmt(Math.abs(r.organizerShare))} tapi</strong> — á sama tíma og
              hún framkallar <strong>{fmt(r.govWithSpillover)}</strong> í skatttekjur fyrir hið opinbera.
              Án endurgreiðslukerfis er hátíðin í raun einkarekstrarstyrkur til ríkissjóðs.
            </div>
          )}
        </div>
      </div>

      <div className="footnote">
        <strong>Forsendur:</strong> VSK 11% á gistingu, matvæli og veitingasölu áfengis · VSK 24% á aðra
        þjónustu og merchandise · Tónleikamiðar VSK-frjálsir · Tryggingar VSK-frjálsar · Afdráttarskattur
        erlendra listamanna 20% (engin önnur launatengd gjöld) · Tryggingagjald 6,35% · Útsvar 14,94% ·
        Staðgreiðsla 31,49% (ríkishluti 16,55%) · Áfengisgjald: varfærin áætlun (16% af sölu) · Innskattur
        af aðföngum reiknast hlutfallslega eftir veltu (sjá VSK-lög nr. 50/1988, 16. gr.).
        <br /><br />
        <em>Þetta er nákvæmlega punkturinn sem rökstuðningurinn snýst um: hátíðin framleiðir margfeldis-
        skatttekjur (á svæði + ferðamannafótspor), en VSK-frelsi miðasölu gerir hana dýrari í rekstri en
        hún væri ef miðar væru í lágþrepi.</em>
      </div>

      <style jsx>{`
        .hwrap { max-width: 1180px; margin: 80px auto 0; padding: 48px 24px 80px; border-top: 1px dashed var(--line); }
        .hhead { text-align: center; margin-bottom: 8px; position: relative; }
        .kicker { text-transform: uppercase; letter-spacing: 0.32em; font-size: 0.72rem; font-weight: 700; color: var(--blood); margin-bottom: 18px; }
        h1 { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: clamp(2.4rem, 5.5vw, 4.4rem); line-height: 0.98; letter-spacing: -0.02em; margin-bottom: 6px; }
        h1 em { font-style: italic; color: var(--blood); }
        .dek { font-family: 'Archivo', sans-serif; font-style: italic; font-size: clamp(1rem, 2vw, 1.3rem); font-weight: 500; max-width: 680px; margin: 18px auto 0; color: #4a3d30; }
        .rule { width: 100%; height: 2px; background: var(--ink); margin: 34px 0; position: relative; }
        .rule::after { content: '◆'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--paper); padding: 0 14px; color: var(--blood); font-size: 0.8rem; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: start; }
        @media (max-width: 880px) { .grid { grid-template-columns: 1fr; } }
        .panel { background: var(--paper-deep); border: 2px solid var(--ink); border-radius: 3px; padding: 28px; box-shadow: 6px 6px 0 var(--shadow); }
        h2 { font-family: 'Archivo', sans-serif; font-size: 1.5rem; font-weight: 900; margin-bottom: 4px; }
        .sub { font-size: 0.82rem; color: #6a5a48; margin-bottom: 22px; }
        .group-title { font-family: 'Archivo'; font-weight: 800; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--blood-deep); margin: 26px 0 12px; padding-bottom: 6px; border-bottom: 1.5px dashed var(--line); }
        .subtotal { display: flex; justify-content: space-between; align-items: baseline; margin-top: 14px; padding: 10px 14px; background: var(--paper); border-left: 3px solid var(--gold); border-radius: 2px; font-family: 'Archivo'; }
        .subtotal > span:first-child { font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #5a4a38; }
        .subtotal > span:last-child { font-weight: 900; font-size: 1.05rem; color: var(--ink); font-variant-numeric: tabular-nums; }
        .optional { font-weight: 400; text-transform: none; letter-spacing: 0; color: #7a6a55; }
        .scenario-chips { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 24px; }
        .chip { font-family: 'Archivo'; font-weight: 600; font-size: 0.78rem; padding: 8px 16px; border: 1.5px solid var(--line); border-radius: 20px; cursor: pointer; background: var(--paper); transition: all 0.15s; }
        .chip:hover { border-color: var(--blood); color: var(--blood); }
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .result-panel { background: var(--ink); color: var(--paper); border: 2px solid var(--ink); border-radius: 3px; box-shadow: 6px 6px 0 var(--shadow); position: sticky; top: 24px; overflow: hidden; }
        @media (max-width: 880px) { .result-panel { position: relative; top: 0; } }
        .hero-number { padding: 32px 28px 28px; text-align: center; background: linear-gradient(160deg, #221a14 0%, #1a1410 100%); border-bottom: 2px solid var(--gold); }
        .htag { text-transform: uppercase; letter-spacing: 0.2em; font-size: 0.68rem; color: var(--gold-soft); font-weight: 700; margin-bottom: 12px; }
        .hval { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: clamp(2.4rem, 6vw, 3.6rem); line-height: 1; color: var(--paper); font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
        .hsuffix { font-size: 0.85rem; color: var(--gold-soft); margin-top: 8px; font-style: italic; font-family: 'Archivo', sans-serif; }
        .multiplier-band { background: var(--green); color: #fff; padding: 18px 28px; display: flex; align-items: center; gap: 16px; border-bottom: 2px solid var(--ink); }
        .mbig { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 2.6rem; line-height: 1; font-variant-numeric: tabular-nums; }
        .mtext { font-size: 0.86rem; line-height: 1.35; }
        .mtext strong { display: block; font-size: 0.96rem; }
        .vat-loss-band { background: var(--blood-deep); color: #fff; padding: 20px 28px; border-bottom: 2px solid var(--ink); }
        .vlt { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.18em; opacity: 0.85; margin-bottom: 8px; font-weight: 700; }
        .vlv { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 1.9rem; line-height: 1; font-variant-numeric: tabular-nums; }
        .vln { font-size: 0.82rem; line-height: 1.5; margin-top: 12px; opacity: 0.92; }
        .vln strong { color: var(--gold-soft); font-weight: 800; }
        .breakdown { padding: 24px 28px; }
        .bd-section { margin-bottom: 22px; }
        .bd-section:last-child { margin-bottom: 0; }
        .bd-head { text-transform: uppercase; letter-spacing: 0.16em; font-size: 0.66rem; font-weight: 700; color: var(--gold-soft); margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #4a3d30; }
        .spillover-band { background: var(--paper); color: var(--ink); padding: 20px 28px; border-top: 2px solid var(--gold); }
        .sb-tag { text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.64rem; font-weight: 700; color: var(--blood-deep); margin-bottom: 8px; }
        .sb-num { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 1.9rem; line-height: 1; font-variant-numeric: tabular-nums; color: var(--green); }
        .sb-rows { margin-top: 10px; font-size: 0.82rem; color: #5a4a38; }
        .sb-rows div { display: flex; justify-content: space-between; padding: 3px 0; }
        .sb-note { font-size: 0.76rem; color: #5a4a38; margin-top: 12px; line-height: 1.5; font-style: italic; }
        .gov-vs { display: grid; grid-template-columns: 1fr 1fr; border-top: 2px solid #4a3d30; }
        .gov-vs > div { padding: 18px 28px; }
        .gov-vs > div:first-child { border-right: 1px solid #4a3d30; }
        .gvtag { font-size: 0.66rem; text-transform: uppercase; letter-spacing: 0.14em; color: var(--gold-soft); margin-bottom: 8px; font-weight: 700; }
        .gvnum { font-family: 'Archivo', sans-serif; font-weight: 900; font-size: 1.5rem; font-variant-numeric: tabular-nums; }
        .gvnum.gov { color: var(--gold-soft); }
        .gvnum.you { color: #fff; }
        .gvnum.neg { color: var(--blood); }
        .share-context { padding: 14px 28px; border-top: 1px solid #4a3d30; font-size: 0.78rem; color: #c8b89e; font-style: italic; line-height: 1.5; }
        .share-context strong { color: var(--gold-soft); }
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

function Bd({ label, val, total, sub, highlight }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: sub ? '2px 0 2px 14px' : total ? '10px 0 0' : '5px 0',
      fontSize: sub ? '0.78rem' : total ? '1.05rem' : '0.9rem',
      fontWeight: total ? 800 : highlight ? 700 : 400,
      borderTop: total ? '1.5px solid var(--gold)' : 'none',
      marginTop: total ? 8 : 0,
    }}>
      <span style={{ color: total ? 'var(--gold-soft)' : highlight ? 'var(--gold-soft)' : sub ? '#9a8a75' : '#d8cab5' }}>{label}</span>
      <span style={{ color: total ? 'var(--gold-soft)' : highlight ? 'var(--gold-soft)' : 'inherit', fontWeight: total || highlight ? 800 : 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(val)}</span>
    </div>
  );
}
