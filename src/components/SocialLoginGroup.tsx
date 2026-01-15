import { useDispatch } from "react-redux";
import { loginGoogleUser, loginFacebookUser } from "@/store/slice/user.slice";
import type { AppDispatch } from "@/store/store";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { useEffect } from "react";

interface SocialLoginGroupProps {
  onSuccess: () => void;
}

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
    google: any;
  }
}

export function SocialLoginGroup({ onSuccess }: SocialLoginGroupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const FB_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // Load Facebook SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        cookie: true,
        xfbml: false,
        version: "v18.0",
      });
    };

    (function (d, s, id) {
      let js: HTMLScriptElement;
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;

      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/vi_VN/sdk.js";
      fjs.parentNode?.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, [FB_APP_ID]);

  // --- Google login custom button ---
  const handleGoogleLogin = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      itp_support: true, // Hỗ trợ Intelligent Tracking Prevention
      use_fedcm_for_prompt: false, // 🔑 QUAN TRỌNG: Tắt FedCM để quay lại popup cũ
      callback: async (response: any) => {
        const token = response.credential;
        if (token) {
          const result = await dispatch(loginGoogleUser(token));
          if (loginGoogleUser.fulfilled.match(result)) onSuccess();
        }
      },
    });

    // Ép buộc chọn tài khoản (mở lại popup chọn email)
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.log(
          "Prompt không hiển thị, có thể do bị chặn bởi người dùng hoặc FedCM"
        );
      }
    });
  };

  // Facebook login
  const handleFacebookToken = async (token: string) => {
    const result = await dispatch(loginFacebookUser(token));
    if (loginFacebookUser.fulfilled.match(result)) onSuccess();
  };

  const handleFacebookLogin = () => {
    if (!window.FB) return;

    window.FB.login(
      (response: any) => {
        if (!response.authResponse) return;
        handleFacebookToken(response.authResponse.accessToken);
      },
      { scope: "public_profile,email" }
    );
  };

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase transition-all active:scale-[0.98] shadow-lg shadow-black/10"
      >
        <FcGoogle size={18} />
        Tiếp tục với Google
      </button>

      {/* Facebook Button */}
      <button
        type="button"
        onClick={handleFacebookLogin}
        className="w-full h-14 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
      >
        <FaFacebookF size={18} />
        Tiếp tục với Facebook
      </button>
    </div>
  );
}
