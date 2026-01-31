"use client";

import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function UserNav() {
  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
            },
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white text-sm rounded-lg transition-colors">
            登录
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}
