import { motion } from "framer-motion";
import { Mouse, Hand } from "lucide-react"; // 아이콘 (lucide-react)

const ScrollHint = () => {
  return (
    <div
      className="z-[9999] top-[5%] translate-x-[-50%] fixed left-[50%] flex flex-col items-center gap-2 px-4 py-3 rounded-2xl"
      style={{
        background: "rgba(255, 255, 255, 0.15)", // 반투명 흰 배경
        backdropFilter: "blur(8px)", // 유리 느낌
      }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        color="rgba(255,255,255,0.8)"
      >
        <Mouse
          size={40}
          strokeWidth={1.5}
          className="text-white/70 fill-white/20"
        />
      </motion.div>
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        color="rgba(255,255,255,0.8)"
      >
        <Hand
          size={32}
          strokeWidth={1.5}
          className="text-white/70 fill-white/20"
        />
      </motion.div>
      <p className="text-sm text-white/80 mt-2">Scroll to explore</p>
    </div>
  );
};

export default ScrollHint;
