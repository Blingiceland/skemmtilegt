'use client';

export default function Kynning() {
  return (
    <section className="essay">
      <div className="inner">
        <div className="kicker">Hvers vegna þetta verkefni</div>
        <h2>Menning er <em>skattstofn</em>, ekki skraut.</h2>
        <p className="lede">
          Reiknivélin hér að ofan er ekki hugsjón. Hún er bókhald. Hver einasti tónleikastaður á Íslandi framleiðir
          skatttekjur í gegnum fimm aðskilda stofna samtímis — virðisaukaskatt, áfengisgjald, tryggingagjald,
          staðgreiðslu og útsvar. Samt er talað um menningu eins og útgjaldalið, í sömu andrá og lengri opnunartíma sundlauga.
        </p>

        <h3>Vandinn</h3>
        <p>
          Menning er færð á rangan stað í bókhaldi ríkisins. Hún er bókuð sem styrkur — gjaldaliður sem hægt er að
          skera niður þegar þrengir að. En lifandi viðburður er ekki útgjaldaliður. Hann er framleiðslueining sem
          dælir sköttum inn í ríkissjóð á sama augnabliki og hann fer fram.
        </p>
        <p>
          Þegar einn meðalstór tónleikastaður tekur inn 9,17 milljónir króna í skatt á einu ári — og er á sama tíma
          rekinn með milljónatugum í tapi — þá er það ekki ríkið sem niðurgreiðir tónleikahaldarann. Það er
          tónleikahaldarinn sem niðurgreiðir ríkið. Þegar grasrótarstaðir loka hverfur sviðið sem næsta kynslóð
          listamanna lærir á — og skattstofninn hverfur með.
        </p>

        <h3>Tillagan</h3>
        <p>
          Ekki styrkur. Endurgreiðsla. Sama rökfræði og kvikmyndaendurgreiðslan sem ríkið rekur nú þegar:
          haldari sýnir raunbókhald, ríkið skilar 25% af þeim sköttum sem það sjálft innheimti af viðburðinum.
          Engin nefnd. Engin matskennd umsókn. Reikningur inn, hlutfall til baka.
        </p>
        <p>
          Á hverja krónu sem ríkið endurgreiðir heldur það eftir þremur. Það er 300% ávöxtun — sem verður
          aðeins til ef viðburðurinn er haldinn. Þetta er fjárfesting með reiknanlegri ávöxtun, ekki útgjöld.
        </p>

        <h3>Hvers vegna ég</h3>
        <p>
          Ég er bæði viðburðahaldari og skattalögfræðingur. Ég veit nákvæmlega hvernig hver einasta króna fer í
          gegnum kerfið — bæði megin við borðið. Það eru fáir á Íslandi sem hafa þetta sjónarhorn, og enn færri
          sem hafa raunbókhald úr menningarrekstri til að byggja á.
        </p>
        <p>
          Þess vegna er reiknivélin ekki módel. Hún er kvarðuð á rauntölum úr endurskoðuðu bókhaldi. Þess vegna
          eru forsendurnar staðfestar VSK-flokkar, áfengisgjald á cl, raunhlutföll tryggingagjalds og staðgreiðslu
          — ekki ágiskanir. Þetta er sú vinna sem ég get unnið fyrir hið opinbera: að umbreyta menningarpólitík úr
          tilfinningu yfir í reikning sem stenst skoðun fjármálaráðuneytisins.
        </p>

        <h3>Allir græða</h3>
        <ul className="winners">
          <li>
            <strong>Listamenn</strong> fá fleiri svið og hærri laun, því haldari þolir að borga rétt fyrir vinnu
            þegar reksturinn er ekki á barmi þrots.
          </li>
          <li>
            <strong>Viðburðahaldarar</strong> losna úr þeirri stöðu að niðurgreiða ríkið af eigin vasa. Reksturinn
            verður loksins sjálfbær.
          </li>
          <li>
            <strong>Ríkið</strong> heldur eftir 75% af þeim sköttum sem það hefði annars misst alfarið ef
            viðburðurinn hefði ekki verið haldinn — og fær skattstofninn áfram næsta ár.
          </li>
          <li>
            <strong>Almenningur</strong> fær lifandi menningu í sínu nærumhverfi: sviðin sem ala upp næstu
            kynslóð, staðina sem skapa miðbæjarlíf, kvöldin sem fá fólk út úr húsi.
          </li>
        </ul>

        <p className="close">
          Gert rétt er þetta arðberandi fjárfesting fyrir alla aðila. Ekki kostnaður. Reikningurinn er hér að ofan
          — prófaðu hann á hvaða viðburði sem er.
        </p>

        <div className="signoff">
          Jón Bjarni Steinsson<br />
          <span>viðburðahaldari og skattalögfræðingur</span>
        </div>
      </div>

      <style jsx>{`
        .essay {
          padding: 100px 24px 140px;
          border-top: 1px dashed var(--line);
          background: var(--paper);
        }
        .inner { max-width: 720px; margin: 0 auto; }
        .kicker {
          text-transform: uppercase; letter-spacing: 0.28em; font-size: 0.72rem;
          font-weight: 700; color: var(--blood); margin-bottom: 18px;
        }
        h2 {
          font-family: 'Archivo', sans-serif; font-weight: 900;
          font-size: clamp(2rem, 4.5vw, 3.2rem); line-height: 1.05;
          letter-spacing: -0.02em; margin-bottom: 32px;
        }
        h2 :global(em) { font-style: italic; color: var(--blood); }
        h3 {
          font-family: 'Archivo', sans-serif; font-weight: 800;
          font-size: 1.25rem; margin: 44px 0 14px;
          color: var(--ink); letter-spacing: -0.01em;
        }
        p {
          font-family: 'Archivo', sans-serif; font-size: 1.05rem;
          line-height: 1.65; color: #2a2017; margin-bottom: 16px;
        }
        .lede {
          font-size: 1.18rem; line-height: 1.6; color: #2a2017;
          margin-bottom: 8px; font-weight: 500;
          padding-left: 18px; border-left: 3px solid var(--gold);
        }
        .winners {
          list-style: none; padding: 0; margin: 8px 0 16px;
        }
        .winners li {
          font-family: 'Archivo', sans-serif; font-size: 1.02rem;
          line-height: 1.55; color: #2a2017;
          padding: 14px 0; border-bottom: 1px solid var(--line);
        }
        .winners li:last-child { border-bottom: none; }
        .winners strong {
          display: inline-block; min-width: 0;
          color: var(--blood-deep); font-weight: 800;
          margin-right: 6px;
        }
        .close {
          margin-top: 36px; padding: 22px 26px;
          background: var(--ink); color: var(--paper);
          font-size: 1.08rem; line-height: 1.5; font-weight: 500;
          border-left: 4px solid var(--gold);
          box-shadow: 6px 6px 0 var(--shadow);
        }
        .signoff {
          margin-top: 48px; padding-top: 24px;
          border-top: 1px solid var(--line);
          font-family: 'Archivo', sans-serif; font-weight: 700;
          font-size: 1rem; color: var(--ink);
        }
        .signoff span {
          display: block; font-weight: 400; font-size: 0.88rem;
          color: #7a6a55; margin-top: 2px;
        }
      `}</style>
    </section>
  );
}
