import * as THREE from "three";
import { extend } from "@react-three/fiber";

export class MeshSineMaterial extends THREE.MeshBasicMaterial {
  time: { value: number };
  constructor(parameters: THREE.MeshBasicMaterialParameters = {}) {
    super(parameters);

    this.setValues(parameters);
    this.time = { value: 0 };
  }
  onBeforeCompile(shader: any) {
    (shader.uniforms as any).time = this.time;
    shader.vertexShader = `
      uniform float time;
      ${shader.vertexShader}
    `;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `vec3 transformed = vec3(position.x, position.y + sin(time + uv.x * PI * 4.0) / 4.0, position.z);`
    );
  }
}

extend({ MeshSineMaterial });
