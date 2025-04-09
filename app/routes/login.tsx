import { GoogleAuthProvider } from "firebase/auth";

// config google auth provider
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/youtube.readonly");
provider.addScope("https://www.googleapis.com/auth/youtube.upload");
provider.addScope("https://www.googleapis.com/auth/youtube");

const SignInWithGoogle = () => {
  return (
    <div>
      <button>Continue with google</button>
    </div>
  );
};

export default SignInWithGoogle;
