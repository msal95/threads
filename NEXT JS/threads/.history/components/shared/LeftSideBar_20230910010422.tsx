import React from "react";

import { sidebarLinks } from "@/constants";
import Link from "next/link";

export default function LeftSideBar() {
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks?.map((link) => (
          <div>
            <Link href={link.route}>{link.label}</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
