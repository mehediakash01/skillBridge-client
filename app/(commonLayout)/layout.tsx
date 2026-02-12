import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import React, { ReactNode } from "react";

export default function CommonLayout  ({ children }: { children: ReactNode })  {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};
