import './css/font.css'
import './css/size.css'
import './css/color.css'
import SignIn from './page/SignIn/signIn';
import SignUp from './page/SignUp/signUp';
import Header from './components/header';

function App() {
  return (
    <div className="App">
        {/* <SignIn /> */}
        <SignUp />
        {/* <Header /> */}
    </div>
  );
}

export default App;
