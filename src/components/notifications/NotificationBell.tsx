"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function NotificationBell() {
  const { user } = useUser();
  const userId = user?.id || "";
  const [open, setOpen] = useState(false);

  const notifications = useQuery(api.notifications.getUserNotifications, { userId });
  const unreadCount = useQuery(api.notifications.getUnreadCount, { userId });
  const markAsRead = useMutation(api.notifications.markAllAsRead);

  const handleOpen = async () => {
    setOpen(!open);
    if (!open && unreadCount > 0) {
      await markAsRead({ userId });
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5 text-gray-700" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-2 shadow-lg rounded-xl bg-white">
        <DropdownMenuLabel className="font-semibold text-gray-700">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications?.length ? (
          notifications.map((n) => (
            <DropdownMenuItem
              key={n._id}
              className="flex flex-col items-start space-y-1 py-2"
            >
              <p className="text-sm font-medium text-gray-800">{n.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="p-3 text-center text-sm text-gray-500">
            No new notifications
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
