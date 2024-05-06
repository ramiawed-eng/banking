"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();
  return (
    <section className="w-full max-w-[264px]">
      <Sheet>
        <SheetTrigger>
          <Image
            width={30}
            height={30}
            src="/icons/hamburger.svg"
            alt="menu logo"
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent side="left" className="border-none bg-white">
          <nav className="flex flex-col gap-1 px-4">
            <Link href="/" className="flex cursor-pointer items-center gap-2">
              <Image src="/icons/logo.svg" width={34} height={34} alt="logo" />
              <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                Awed
              </h1>
            </Link>

            <div className="mobilenav-sheet">
              <SheetClose asChild>
                <nav className="flex h-full flex-col gap-6 pt-16 text-white">
                  {sidebarLinks.map((link) => {
                    const isActive =
                      pathname === link.route ||
                      pathname.startsWith(`${link.route}/`);
                    return (
                      <SheetClose key={link.route} asChild>
                        <Link
                          href={link.route}
                          key={link.route}
                          className={cn("mobilenav-sheet_close w-full", {
                            "bg-bank-gradient": isActive,
                          })}
                        >
                          <Image
                            src={link.imgURL}
                            width={20}
                            height={20}
                            alt={link.label}
                            className={cn({
                              "brightness-[3] invert-0": isActive,
                            })}
                          />
                          <p
                            className={cn(
                              "text-16 font-semibold text-black-2 flex-1",
                              {
                                "!text-white": isActive,
                              }
                            )}
                          >
                            {link.label}
                          </p>
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>
              </SheetClose>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </section>
  );
}
