/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import UserAgentIOS from "rn-ios-user-agent";

import RootNavigator from "./src/screens/RootNavigator";
UserAgentIOS.set("new user agent");
const App = () => {
	return (
		<>
			<SafeAreaProvider>
				<RootNavigator />
			</SafeAreaProvider>
		</>
	);
};

export default App;
