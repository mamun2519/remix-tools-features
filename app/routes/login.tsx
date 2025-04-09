import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import auth from "~/component/firebase.config";

// config google auth provider
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/youtube.readonly");
provider.addScope("https://www.googleapis.com/auth/youtube.upload");
provider.addScope("https://www.googleapis.com/auth/youtube");

const SignInWithGoogle = () => {
  const siginWithGoogleProviderHandler = async () => {
    const result = await signInWithPopup(auth, provider);

    const credential = GoogleAuthProvider.credentialFromResult(result);
  };
  return (
    <div>
      <button>Continue with google</button>
    </div>
  );
};

export default SignInWithGoogle;
