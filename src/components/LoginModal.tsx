import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import { buttonVariants } from "./ui/button";

export default function LoginModal({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="absolute z-999999 bg-slate-50">
        <DialogHeader>
          <div className="relative mx-auto w-30 h-30 mb-2">
            <img
              src="/logo.png"
              alt="Logo Image"
              className="object-contain w-full h-full"
            />
          </div>
          <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
            Log in to Continue
          </DialogTitle>
          <DialogDescription className="text-base text-center py-2">
            <span className="text-zinc-900 text-medium">
              Your configuration is saved and ready to be previewed
            </span>{" "}
            <span className="text-blue-700">
              Please login or create an account to complete your purchase
            </span>
          </DialogDescription>
          <div className="grid grid-cols-2 gap-6 divide-x divide-gray-200 ">
            <LoginLink className={buttonVariants({ variant: "outline" })}>
              Login
            </LoginLink>
            <RegisterLink className={buttonVariants({ variant: "default" })}>
              Sign Up
            </RegisterLink>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
