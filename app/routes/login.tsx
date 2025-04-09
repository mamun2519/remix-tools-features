import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "~/component/firebase.config";

// config google auth provider
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/youtube.readonly");
provider.addScope("https://www.googleapis.com/auth/youtube.upload");
provider.addScope("https://www.googleapis.com/auth/youtube");

const SignInWithGoogle = () => {
  const signInWithGoogleProviderHandler = async () => {
    const result = await signInWithPopup(auth, provider);

    const credential = GoogleAuthProvider.credentialFromResult(result);
    // get the token
    const token = credential?.accessToken;

    // get the user info
    const user = result.user;
    return { user, token };
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
  return (
    <div className="flex justify-center p-5">
      <button
        className="rounded bg-red-500 px-4 py-2 text-white"
        onClick={() => signUpHandler()}
      >
        Continue with google
      </button>
    </div>
  );
};

export default SignInWithGoogle;
