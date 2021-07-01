import React, { useEffect, useState, useRef } from "react";
import {
	Text,
	View,
	StyleSheet,
	SafeAreaView,
	Alert,
	Platform,
	TouchableOpacity,
} from "react-native";

import * as Facebook from "expo-facebook";
import { WithLocalSvg } from "react-native-svg";
import { WebView } from "react-native-webview";
import DeviceInfo from "react-native-device-info";

const BackArrow = require("../../assets/images/NavigationBackDk.svg");
const ForwardArrow = require("../../assets/images/NavigationForwardDk.svg");
const SocialAttacheIcon = require("../../assets/images/CompanySocialAttacheClr.svg");
const FacebookIcon = require("../../assets/images/CompanyFacebookDk.svg");
const InstagramIcon = require("../../assets/images/CompanyInstagramDk.svg");
const LinkedInIcon = require("../../assets/images/CompanyLinkedInDk.svg");

const SocialAttachUrl = "https://socialattache.com/";
const FacebookUrl = "https://www.facebook.com/";
const TiktokUrl = "https://www.tiktok.com/";

//const TEST_LOGIN = 'http://192.168.1.30/login.php';
const SocialAttacheScreen = ({ navigation, route }) => {
	const webView = useRef();
	const cookieRef = useRef({ value: "" });
	//const weburl = 'http://192.168.1.30/webview.php'
	//const weburl = 'https://tiktok.com/'
	//const weburl = 'https://www.facebook.com/'

	const [weburl, setWebUrl] = useState(SocialAttachUrl);

	// handle message from webpage
	const onBridgeMessage = (event) => {
		const { data } = event.nativeEvent;
		const jsonData = JSON.parse(data);
		console.log(jsonData);
		if (jsonData.type == "message") {
			Alert.alert("PocWeb", jsonData.value);
		} else if (jsonData.type == "cookie") {
			cookieRef.current.value = jsonData.value;
			//Alert.alert('Cookie from the webview', jsonData.value);
		}
	};

	// get cookie
	const getCookie = () => {
		const javascriptCodeToSend = `
      window.ReactNativeWebView.postMessage(JSON.stringify({type: 'cookie', value: document.cookie}));
      true;
    `;
		webView.current.injectJavaScript(javascriptCodeToSend);
	};
	// button handler to show cookie
	const onPressedShowCookie = () => {
		getCookie();
	};

	const requestAjaxCallWithCookie = async (cookie) => {
		const response = await fetch("http://192.168.1.30/login.php", {
			headers: {
				cookie: cookie,
			},
		});
		const jsonData = await response.json();
		console.log(jsonData);
		Alert.alert("Ajax response", JSON.stringify(jsonData));
	};

	const sendMessage = (data) => {
		const message = JSON.stringify(data);
		// you can add any javascript code to inject in the webpage.
		const javascriptCodeToSend = `
      window.postMessage(${message}, "*");
      true;
    `;
		webView.current.injectJavaScript(javascriptCodeToSend);
	};

	const onPressedSocialAttache = () => {
		setWebUrl(SocialAttachUrl);
	};

	const onPressedFacebook = () => {
		//setWebUrl(FacebookUrl);
		setWebUrl("https://facebook.com");

		// LoginManager.logInWithPermissions(["email", "public_profile"]).then(
		// 	(result) => {
		// 		if (result.isCancelled) {
		// 			if (webView.canGoBack()) {
		// 				webView.goBack();
		// 			}
		// 		} else {
		// 			AccessToken.getCurrentAccessToken().then((data) => {
		// 				const infoRequest = new GraphRequest(
		// 					"/me",
		// 					{
		// 						accessToken: data.accessToken.toString(),
		// 						parameters: {
		// 							fields: {
		// 								string: "email, name",
		// 							},
		// 						},
		// 					},
		// 					setWebUrl("https://m.facebook.com")
		// 				);
		// 				// Start the graph request.
		// 				new GraphRequestManager().addRequest(infoRequest).start();
		// 			});
		// 		}
		// 	}

		// 	);
	};

	const onNavigationStateChange = (navState) => {
		var url = navState.url;
		console.log("NavState", url);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={styles.headerView}>
				<View style={styles.headerLeftView}>
					<TouchableOpacity style={styles.headerButton}>
						<WithLocalSvg width={24} height={24} asset={BackArrow} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.headerButton}>
						<WithLocalSvg width={24} height={24} asset={ForwardArrow} />
					</TouchableOpacity>
				</View>
				<View style={styles.headerLeftView}>
					<TouchableOpacity
						style={styles.headerButton}
						onPress={onPressedSocialAttache}
					>
						<WithLocalSvg width={24} height={24} asset={SocialAttacheIcon} />
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.headerButton}
						onPress={onPressedFacebook}
					>
						<WithLocalSvg width={24} height={24} asset={FacebookIcon} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.headerButton}>
						<WithLocalSvg width={24} height={24} asset={InstagramIcon} />
					</TouchableOpacity>
					<TouchableOpacity style={styles.headerButton}>
						<WithLocalSvg width={24} height={24} asset={LinkedInIcon} />
					</TouchableOpacity>
				</View>
			</View>
			<WebView
				ref={webView}
				onLoad={() => getCookie()}
				// originWhitelist={["*"]}
				source={{
					uri: weburl,
					// headers: {
					// 	Cookie:
					// 		// "_fbp=fb.1.1624487749385.1415309693; PHPSESSID=v86k8lsm0mfr1jqthf9u4v0ou5; ReferralURL=https%3A%2F%2Fsocialattache.com%2F; CurrencyCode=USD; CountryCode=US",
					// },
				}}
				// userAgent={
				// 	Platform.OS == "ios"
				// 		? "Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1"
				// 		: "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36"
				// }

				// userAgent="firefox"
				// userAgent={DeviceInfo.getUserAgent() + " - MYAPPNAME - android "}
				allowsInlineMediaPlayback="true"
				onMessage={onBridgeMessage}
				javaScriptEnabled={true}
				sharedCookiesEnabled={true}
				thirdPartyCookiesEnabled={true}
				mixedContentMode="compatibility"
				onNavigationStateChange={onNavigationStateChange}
			/>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	textView: {
		color: "white",
	},
	headerView: {
		height: 50,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 8,
	},
	headerLeftView: {
		flexDirection: "row",
		alignItems: "center",
	},
	headerButton: {
		marginHorizontal: 8,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		position: "absolute",
		justifyContent: "space-between",
		bottom: 16,
		left: 16,
		right: 16,
	},
	button: {
		width: 100,
		height: 44,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "#006efe",
	},
});

export default SocialAttacheScreen;
