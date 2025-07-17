import { ThreeElements } from "@react-three/fiber";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshSineMaterial: any;
      bentPlaneGeometry: any;
    }
  }
}
