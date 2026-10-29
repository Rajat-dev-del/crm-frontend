"use client";

import { Bell, BellOff } from "lucide-react";
import { Dropdown } from "@/components/ui/Dropdown";
import { iconButtonClass } from "@/components/ui/IconButton";

export function NotificationMenu() {
  return (
    <Dropdown label="Notifications" trigger={<Bell aria-hidden />} triggerClassName={iconButtonClass} panelClassName="w-80">
      {() => (
        <>
          <p className="border-b border-line px-3 pb-3 pt-2 text-label text-heading">Notifications</p>
          <div className="flex flex-col items-center gap-2 px-3 py-8 text-center">
            <BellOff className="size-6 text-muted" aria-hidden />
            <p className="text-caption text-muted">You&apos;re all caught up.</p>
          </div>
        </>
      )}
    </Dropdown>
  );
}
