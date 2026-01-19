"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const AuthModalController = forwardRef((props, ref) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  // expose methods to parent
  useImperativeHandle(ref, () => ({
    openLogin() {
      setRegisterOpen(false);
      setLoginOpen(true);
    },
  }));

  return (
    <>
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onRegisterClick={() => {
          setLoginOpen(false);
          setRegisterOpen(true);
        }}
      />

      <RegisterModal
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onLoginClick={() => {
          setRegisterOpen(false);
          setLoginOpen(true);
        }}
      />
    </>
  );
});

export default AuthModalController;
