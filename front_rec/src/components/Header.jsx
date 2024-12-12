import '../css/Header.css'; 

function Header() {
  return (
    <header>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '5px' }}>
        <img src="../logo.png" alt="Logo Chirone" style={{ width: '100px', height: '100px' }} /> {/* Ho aggiunto l'altezza per mantenere il logo proporzionato */}
        <h1 style={{ margin: 0, fontSize: '30px' }}>Chirone</h1> {/* Ho rimosso il margine per un migliore allineamento verticale */}
        <nav>
         {/* <ul> {/*  la lista di link che permette la navigazione 
             <li><a href="#">Home</a></li> 
            <li><a href="#">Studenti</a></li>
            <li><a href="#">Voti</a></li>
            <li><a href="#">Assenze</a></li>
            <li><a href="#">Classi</a></li>
            <li><a href="#">Impostazioni</a></li> 
          </ul>*/}
        </nav>
      </div>
    </header>
  );
}

export default Header;