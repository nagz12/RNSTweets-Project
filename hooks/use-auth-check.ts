import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthCheck() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has valid session by calling a protected endpoint
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          setIsAuthed(true);
        } else {
          setIsAuthed(false);
          router.push("/login");
        }
      } catch (err) {
        setIsAuthed(false);
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  return isAuthed;
}
