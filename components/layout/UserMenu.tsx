"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { useAuth } from "@/providers/AuthProvider";

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

export function UserMenu() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <Dropdown
      label="Account menu"
      trigger={initials(user.fullName)}
      triggerClassName="flex size-10 items-center justify-center rounded-full bg-primary-500 text-label text-white hover:bg-primary-600"
    >
      {() => (
        <>
          <div className="border-b border-line px-3 pb-3 pt-2">
            <p className="truncate text-label text-heading">{user.fullName}</p>
            <p className="truncate text-caption text-muted">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.replace("/login");
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-label text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/15"
          >
            <LogOut className="size-4" aria-hidden />
            Sign out
          </button>
        </>
      )}
    </Dropdown>
  );
}
