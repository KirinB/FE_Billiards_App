import { useDispatch } from "react-redux";
import { loginGoogleUser, loginFacebookUser } from "@/store/slice/user.slice";
import type { AppDispatch } from "@/store/store";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

interface SocialLoginGroupProps {
  onSuccess: () => void;
}

// Đảm bảo TypeScript nhận diện được FB và google trên window
declare global {
  interface Window {
    FB: any;
    google: any;
  }
}

export function SocialLoginGroup({ onSuccess }: SocialLoginGroupProps) {
  const dispatch = useDispatch<AppDispatch>();
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  // --- Facebook Login Logic ---
  const handleFacebookLogin = () => {
    if (!window.FB) return;

    // Callback truyền vào FB.login KHÔNG ĐƯỢC để async
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          const fbAccessToken = response.authResponse.accessToken;

          // Tạo một hàm async riêng bên trong hoặc gọi thunk
          const processLogin = async () => {
            try {
              const result = await dispatch(loginFacebookUser(fbAccessToken));
              if (loginFacebookUser.fulfilled.match(result)) {
                onSuccess();
              }
            } catch (error) {
              console.error("Facebook Login Error:", error);
            }
          };

          processLogin(); // Chạy hàm async
        }
      },
      { scope: "public_profile,email" }
    );
  };
  // --- Google Login Logic (Giữ nguyên logic cũ của bạn) ---
  // --- Google Login Logic ---
  const handleGoogleLogin = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      itp_support: true,
      use_fedcm_for_prompt: false,
      callback: (response: any) => {
        const token = response.credential;
        if (token) {
          // Tách logic async ra riêng
          const processGoogleLogin = async () => {
            try {
              const result = await dispatch(loginGoogleUser(token));
              if (loginGoogleUser.fulfilled.match(result)) {
                onSuccess();
              }
            } catch (err) {
              console.error("Google Dispatch Error:", err);
            }
          };
          processGoogleLogin();
        }
      },
    });

    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) {
        console.log("Prompt không hiển thị do bị chặn hoặc FedCM");
      }
    });
  };

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="flex-shrink mx-4 text-[10px] uppercase font-bold text-white/20 tracking-[0.2em] whitespace-nowrap">
          Hoặc tiếp tục với
        </span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <div className="space-y-4">
        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase transition-all active:scale-[0.98] shadow-lg shadow-black/10"
        >
          <FcGoogle size={18} />
          Đăng nhập với Google
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleFacebookLogin()}
          className="w-full h-14 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
        >
          <FaFacebookF size={18} />
          Tiếp tục với Facebook
        </button>
      </div>
    </div>
  );
}
