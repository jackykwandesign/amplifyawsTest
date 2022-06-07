import './App.css';
import { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator  } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// >>New - Configuring Auth Module
Auth.configure(awsconfig);
function App() {
  return (
    <Authenticator
    signUpAttributes={["email"]}>
      {({ signOut, user }) => (
        <div className="App">
          <p>
            Hey {user!.username}, welcome to my channel, with auth!
          </p>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
}

export default App
