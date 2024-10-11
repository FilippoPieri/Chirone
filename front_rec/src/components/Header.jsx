
import '../css/Header.css'; 

function Header() {
  return (
    <header>
      <div className="container">
        <h1>Chirone</h1>
        {/* la barra di navigazione continene una lista di link */}
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