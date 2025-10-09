"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";

export function Intro() {
  const [scope, animate] = useAnimate();
  const [height, setHeight] = useState(0);
  const EasingDefinition = {
    linear: "linear",
    easeIn: "easeIn",
    easeOut: "easeOut",
    easeInOut: "easeInOut",
    circIn: "circIn",
    circOut: "circOut",
    circInOut: "circInOut",
    backIn: "backIn",
    backOut: "backOut",
    backInOut: "backInOut",
    anticipate: "anticipate",
  } as const;
  const handleAnimation = async () => {
    await animate(
      "#ALPHAB",
      { opacity: 1, x: 0, y: -100, scale: 0.8 },
      { duration: 0.25, ease: EasingDefinition.anticipate, delay: 0 }
    );
    await animate(
      "#ALPHAB",
      { opacity: 0, scale: 10, letterSpacing: "1em" },
      { duration: 0.25, ease: EasingDefinition.anticipate, delay: 1 }
    );
  };

  useEffect(() => {
    // const x = document.defaultView?.innerHeight || 0;
    // setHeight(x / 5);
    setHeight(1);
    handleAnimation();
  }, []);

  return (
    <div ref={scope}>
      <motion.div
        id="#CONTAINER"
        className="alphab-background relative z-10 flex flex-col items-center justify-center h-[100vh] px-4 sm:px-6"
        initial={{ height: "100vh" }}
        animate={{
          height,
          transition: { duration: 0.25, delay: 1.5, ease: EasingDefinition.anticipate },
        }}
      >
        <motion.div
          id="ALPHAB"
          className="font-extrabold text-[20vw] alphab-stroke shadow-neutral-950"
          initial={{ opacity: 0, x: 0, y: 0, scale: 10 }}
        >
          ALPHAB
        </motion.div>
      </motion.div>
    </div>
  );
}
