/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import auth from "~/component/firebase.config";

// config google auth provider
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/youtube.readonly");
provider.addScope("https://www.googleapis.com/auth/youtube.upload");
provider.addScope("https://www.googleapis.com/auth/youtube");

const SignInWithGoogle = () => {
  const [userYoutubeAccessToken, setUserYoutubeAccessToken] = useState<
    string | null
  >();

  const [channelData, setChannelData] = useState<any>(null);
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

      if (token) {
        setUserYoutubeAccessToken(token);
      }
      console.log("Token------------------", token);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userYoutubeAccessToken) return;

    const fetchYouTubeChannelData = async () => {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
        {
          headers: {
            Authorization: `Bearer ${userYoutubeAccessToken}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      console.log(data);
      setChannelData(data?.items?.[0]); // Get first channel
    };

    fetchYouTubeChannelData();
  }, [userYoutubeAccessToken]);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      <div className="flex gap-4">
        <button
          className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          onClick={signUpHandler}
        >
          Continue with Google
        </button>
        <button
          className="rounded bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>

      {channelData && (
        <div className="mt-6 w-full max-w-md rounded-lg border p-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <img
              src={channelData.snippet.thumbnails.default.url}
              alt="Channel Thumbnail"
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold">{channelData.snippet.title}</h2>
              <p className="text-gray-500">
                @{channelData.snippet.customUrl?.replace("@", "")}
              </p>
              <p className="text-sm text-gray-400">
                Published:{" "}
                {new Date(channelData.snippet.publishedAt).toDateString()}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold">
                {channelData.statistics.subscriberCount}
              </p>
              <p className="text-sm text-gray-600">Subscribers</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {channelData.statistics.viewCount}
              </p>
              <p className="text-sm text-gray-600">Views</p>
            </div>
            <div>
              <p className="text-lg font-semibold">
                {channelData.statistics.videoCount}
              </p>
              <p className="text-sm text-gray-600">Videos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignInWithGoogle;

const useGoogleSingUp = (): {
  userYoutubeAccessToken: string | null | undefined;
  channelData: any;
  signUpHandler: () => Promise<void>;
} => {
  const [userYoutubeAccessToken, setUserYoutubeAccessToken] = useState<
    string | null
  >();

  const [channelData, setChannelData] = useState<any>(null);

  ///* google sign provider function
  const signInWithGoogleProviderHandler = async () => {
    try {
      // signup with google
      const result = await signInWithPopup(auth, provider);

      const credential = GoogleAuthProvider.credentialFromResult(result);
      // access the user token
      const token = credential?.accessToken;

      //access the user info
      const user = result.user;

      // retune user and token form the function
      return { user, token };
    } catch (error) {
      console.log("error", error);
    }
  };

  //* signup in google
  const signUpHandler = async () => {
    try {
      const { token } = await signInWithGoogleProviderHandler();

      if (token) {
        setUserYoutubeAccessToken(token);
      }
      console.log("Token------------------", token);
    } catch (error) {
      console.log(error);
    }
  };

  // get the user youtube channel info using token
  useEffect(() => {
    if (!userYoutubeAccessToken) return;

    const fetchYouTubeChannelData = async () => {
      const response = await fetch(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true",
        {
          headers: {
            Authorization: `Bearer ${userYoutubeAccessToken}`,
            Accept: "application/json",
          },
        },
      );
      const data = await response.json();
      console.log(data);
      setChannelData(data?.items?.[0]); // Get first channel
    };

    fetchYouTubeChannelData();
  }, [userYoutubeAccessToken]);

  return { userYoutubeAccessToken, channelData, signUpHandler };
};
