import { getUserMetadata } from "@/utils/supabase/cached-queries";
import {
  Avatar,
  AvatarFallback,
  AvatarImageNext,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ThemeSwitch } from "@/components/theme-switch";

export async function UserMenu() {
  const userData = await getUserMetadata();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="rounded-full w-8 h-8 cursor-pointer">
          {userData?.avatar_url && (
            <AvatarImageNext
              src={userData?.avatar_url}
              alt={userData?.full_name}
              width={32}
              height={32}
              quality={100}
            />
          )}
          <AvatarFallback>
            <span className="text-xs">
              {userData?.full_name?.charAt(0)?.toUpperCase()}
            </span>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px]" sideOffset={10} align="end">
        <DropdownMenuLabel>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="truncate line-clamp-1 max-w-[155px] block">
                {userData?.full_name}
              </span>
              <span className="truncate text-xs text-[#606060] font-normal">
                {userData?.email}
              </span>
            </div>
            <div className="border py-0.5 px-3 rounded-full text-[11px] font-normal">
              Beta
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <Link prefetch href="/account">
            <DropdownMenuItem>
              Account
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>

          <Link prefetch href="/account/support">
            <DropdownMenuItem>Support</DropdownMenuItem>
          </Link>

          <Link prefetch href="/account/teams">
            <DropdownMenuItem>
              Teams
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <div className="flex flex-row justify-between items-center p-2">
          <p className="text-sm">Theme</p>
          <ThemeSwitch />
        </div>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
