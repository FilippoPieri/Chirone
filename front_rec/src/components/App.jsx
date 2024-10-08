
import '../css/App.css';
import '../css/Header.css';
import '../css/Intro.css';
import '../css/Features.css';
import '../css/Footer.css';
import Header from './Header';
import Intro from './Intro';
import Features from './Features';
import Footer from './Footer';

function App() {
  return (
    <div className="App"> {/* applica CSS di App.css su tutti gli elementi contenuti in body*/}
      <Header />
      <main>
        <Intro />
        <Features />
      </main>
      <Footer />
    </div>
  );
}

export default App;

