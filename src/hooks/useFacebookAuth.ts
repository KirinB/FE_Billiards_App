import { useState, useEffect } from "react";

interface FBUser {
  id: string;
  name: string;
  email?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

export const useFacebookAuth = () => {
  const [user, setUser] = useState<FBUser | null>(null);
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Lấy thông tin chi tiết user sau khi có token
  const fetchProfile = () => {
    window.FB.api(
      "/me",
      { fields: "name,email,picture.type(large)" },
      (response: FBUser) => {
        setUser(response);
        setLoading(false);
      }
    );
  };

  // 2. Kiểm tra trạng thái đăng nhập (getLoginStatus)
  const checkLoginStatus = () => {
    window.FB.getLoginStatus((response: any) => {
      if (response.status === "connected") {
        fetchProfile();
      } else {
        setUser(null);
        setLoading(false);
      }
    });
  };

  // 3. Hàm Đăng nhập thủ công khi bấm nút
  const login = () => {
    if (!window.FB) return;

    setLoading(true);
    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          fetchProfile();
        } else {
          setLoading(false);
          console.log("User cancelled login");
        }
      },
      { scope: "public_profile,email" }
    );
  };

  // 4. Hàm Đăng xuất
  const logout = () => {
    window.FB.logout(() => {
      setUser(null);
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.FB) {
        setIsSDKReady(true);
        checkLoginStatus();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return { user, login, logout, loading, isSDKReady };
};
