import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect } from "react";
import { Await } from "react-router";
import auth from "~/component/firebase.config";

// config google auth provider
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/youtube.readonly");
provider.addScope("https://www.googleapis.com/auth/youtube.upload");
provider.addScope("https://www.googleapis.com/auth/youtube");

const SignInWithGoogle = () => {
  const user = getAuth();
  console.log(user.currentUser);
  const signInWithGoogleProviderHandler = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      // get the token
      const token = credential?.accessToken;

      // get the user info
      const user = result.user;
      return { user, token };
    } catch (error) {
      console.log("error", error);
    }
  };

  const signUpHandler = async () => {
    try {
      const { user, token } = await signInWithGoogleProviderHandler();
      console.log("user-----------", user);

      console.log("Token------------------", token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // youtubeService.ts
    const fetchYouTubeChannelData = async (accessToken: string) => {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      console.log("data", data);
      return data;
    };

    fetchYouTubeChannelData("slslker");
  }, []);
  return (
    <div className="flex justify-center p-5 px-4">
      <button
        className="rounded bg-red-500 px-4 py-2 text-white"
        onClick={() => signUpHandler()}
      >
        Continue with google
      </button>

      <button
        className="rounded bg-red-200 px-4 py-2 text-black"
        onClick={() => signOut(auth)}
      >
        Logout
      </button>
    </div>
  );
};

export default SignInWithGoogle;
