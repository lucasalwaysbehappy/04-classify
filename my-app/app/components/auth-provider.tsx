import { ClerkProvider } from "@clerk/nextjs";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#78716c",
          colorText: "#44403c",
          colorBackground: "#fafaf9",
          colorInputBackground: "#ffffff",
          colorInputText: "#44403c",
        },
        elements: {
          formButtonPrimary: "bg-stone-700 hover:bg-stone-800",
          socialButtonsBlockButton: "bg-white border border-stone-300",
          formFieldInput: "border-stone-300 focus:border-stone-500",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
