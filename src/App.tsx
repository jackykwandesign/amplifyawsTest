import "./App.css";
import { Auth, API } from "aws-amplify";
import awsconfig from "./aws-exports";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import TodoList from "./pages/TodoList";

// >>New - Configuring Auth Module
Auth.configure(awsconfig);
API.configure(awsconfig);
function App() {
	return (
		<Authenticator signUpAttributes={["email"]}>
			{({ signOut, user }) => (
				<div className="App">
					<p>
						Hey {user!.username}, welcome to my channel, with auth!
					</p>

          {/* content */}
          <TodoList />

					<button onClick={signOut}>Sign out</button>
				</div>
			)}
		</Authenticator>
	);
}

export default App;
