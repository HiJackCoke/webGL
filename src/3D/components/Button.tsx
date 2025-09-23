import { Text, RoundedBox, useCursor } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useMemo, useState } from "react";

type ButtonProps = {
  visible?: boolean;
  label: string;
  position?: [number, number, number];
  width?: number;
  height?: number;
  depth?: number;
  radius?: number;
  renderOrder?: number;
  variant?: "primary" | "danger";
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
};

const Button = ({
  visible = true,
  label,
  position = [0, 0, 0],
  width = 0.8,
  height = 0.28,
  depth = 0.28,
  radius = 0.08,
  renderOrder = 10,
  variant = "primary",
  onClick,
}: ButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  useCursor(hovered);

  const colors = useMemo(() => {
    if (variant === "danger") {
      return {
        base: "#b94a48", // base red
        hover: "#993d3b", // hover red
        active: "#7a2f2d", // active red
      };
    }
    // primary variant (default)
    return {
      base: "#3b7a57", // base green
      hover: "#33664a", // hover green
      active: "#264c37", // active green
    };
  }, [variant]);

  const baseColor = colors.base;
  const hoverColor = colors.hover;
  const activeColor = colors.active;

  const bgColor = active ? activeColor : hovered ? hoverColor : baseColor;

  return (
    <group
      visible={visible}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => {
        setHovered(false);
        setActive(false);
      }}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      scale={active ? 0.98 : 1}
    >
      <RoundedBox
        args={[width, height, depth]}
        radius={radius}
        smoothness={5}
        renderOrder={renderOrder - 1}
      >
        <meshStandardMaterial color={bgColor} transparent />
      </RoundedBox>

      <Text
        position={[0, 0, 0]}
        renderOrder={renderOrder}
        fontSize={height * 0.5}
        color="#ffffff"
        fontWeight="bold"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
        maxWidth={width * 0.9}
        overflowWrap="normal"
        material-toneMapped={false}
        material-depthTest={false}
      >
        {label}
      </Text>
    </group>
  );
};

export default Button;
