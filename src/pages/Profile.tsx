import { MatchHistoryCard } from "@/components/MatchHistoryCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { authService } from "@/services/auth.service";
import { logoutUser } from "@/store/slice/user.slice";
import { type RootState } from "@/store/store";
import { Activity, LogOut } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ITEMS_PER_PAGE = 5;

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<any>(null);
  const [fetching, setFetching] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const { id, username, accessToken, loading } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    if (accessToken) {
      authService
        .getProfile()
        .then(setProfileData)
        // .catch(() => console.error("Lỗi tải lịch sử"))
        .finally(() => setFetching(false));
    }
  }, [accessToken]);

  const totalMatches = profileData?.players || [];
  const totalPages = Math.ceil(totalMatches.length / ITEMS_PER_PAGE);

  const paginatedMatches = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return totalMatches.slice(start, start + ITEMS_PER_PAGE);
  }, [totalMatches, currentPage]);

  const getPaginationRange = (current: number, total: number) => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
      if (
        i === 1 ||
        i === total ||
        (i >= current - delta && i <= current + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const handleLogout = () => {
    dispatch(logoutUser() as any);
    navigate("/login");
  };

  if (!accessToken) return null;

  return (
    <div className="min-h-screen text-white px-4 py-8 pb-10 max-w-md mx-auto">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a1d24] to-[#0f1115] border border-white/5 rounded-[32px] p-6 mb-6 shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="size-16 rounded-2xl bg-[#f2c94c] shadow-[0_0_20px_rgba(242,201,76,0.3)] flex items-center justify-center text-black font-black text-2xl rotate-3 overflow-hidden">
              {profileData?.avatar ? (
                <img
                  src={profileData.avatar}
                  alt={username || "avatar"}
                  className="w-full h-full object-cover -rotate-3 scale-110" // -rotate-3 để bù lại độ nghiêng của div cha
                />
              ) : (
                username?.charAt(0)?.toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black italic uppercase tracking-tighter leading-none">
                {username}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
                  Online
                </span>
                <span className="text-white/30 text-[10px] font-mono">
                  ID: {id}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="size-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 transition-all active:scale-90 disabled:opacity-50"
          >
            <LogOut size={20} />
          </button>
        </div>
        <Activity className="absolute -right-4 -bottom-4 size-32 text-white/[0.02] -rotate-12" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <p className="text-white/40 text-[10px] uppercase font-black mb-1">
            Tổng trận
          </p>
          <p className="text-xl font-black">{totalMatches.length}</p>
        </div>
        <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
          <p className="text-white/40 text-[10px] uppercase font-black mb-1">
            Thắng tỉ lệ
          </p>
          <p className="text-xl font-black text-[#f2c94c]">--%</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white/60">
            Lịch sử đấu
          </h2>
          <span className="text-[10px] text-white/30 uppercase font-bold italic">
            Trang {currentPage}/{totalPages || 1}
          </span>
        </div>

        {fetching ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 bg-white/5 animate-pulse rounded-2xl"
              />
            ))}
          </div>
        ) : paginatedMatches.length > 0 ? (
          <>
            <div className="space-y-3">
              {paginatedMatches.map((p: any) => (
                <MatchHistoryCard
                  key={p.id}
                  p={p}
                  onClick={() => navigate(`/room/${p.roomId}?mode=viewer`)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pt-4">
                <Pagination>
                  <PaginationContent className="gap-2">
                    <PaginationItem>
                      <PaginationPrevious
                        className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white cursor-pointer"
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                      />
                    </PaginationItem>

                    {getPaginationRange(currentPage, totalPages).map(
                      (page, i) => (
                        <PaginationItem key={i}>
                          {page === "..." ? (
                            <PaginationEllipsis className="text-white/20" />
                          ) : (
                            <PaginationLink
                              isActive={currentPage === page}
                              onClick={() => setCurrentPage(Number(page))}
                              className={`cursor-pointer border-white/10 ${
                                currentPage === page
                                  ? "bg-[#f2c94c] text-black hover:bg-[#f2c94c]/90 hover:text-black"
                                  : "bg-white/5 hover:bg-white/10 text-white"
                              }`}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white cursor-pointer"
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-[32px]">
            <p className="text-white/20 text-xs font-bold uppercase italic">
              Chưa có dữ liệu
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
