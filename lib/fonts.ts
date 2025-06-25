import localFont from "next/font/local";

// Nohemi font for headings
export const nohemi = localFont({
  src: [
    {
      path: "../app/fonts/nohemi/Nohemi-Medium-BF6438cc5883899.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/nohemi/Nohemi-SemiBold-BF6438cc588a48a.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../app/fonts/nohemi/Nohemi-Bold-BF6438cc587b5b5.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../app/fonts/nohemi/Nohemi-ExtraBold-BF6438cc5881baf.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../app/fonts/nohemi/Nohemi-Black-BF6438cc58744d4.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-nohemi",
  display: "swap",
});

// Space Grotesk font for body text
export const spaceGrotesk = localFont({
  src: [
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../app/fonts/space-grotesk/SpaceGrotesk-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-space-grotesk",
  display: "swap",
});
 