import { RootState } from "@react-three/fiber";

export const getResponseMesh = (frameState: RootState, gap = 0.05) => {
  const { aspect, width, height, distance } = frameState.viewport;

  if (aspect < 1) {
    const fixeHeight = (((height / distance) * 10) / aspect) * 1.5;
    const scale = fixeHeight * 0.4;

    const y = scale * (0.5 + gap);

    return { scale, position: [0, y, 0] as [number, number, number] };
  } else {
    const fixedWidth = (width / distance) * 10;
    const scale = fixedWidth * 0.4;

    const x = -scale * (0.5 + gap);

    return { scale, position: [x, 0, 0] as [number, number, number] };
  }
};
