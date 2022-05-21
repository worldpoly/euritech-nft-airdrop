import React, { RefObject, useEffect, useRef } from "react";
const {
  calculateSizingOptions,
  createLogoViewer,
  loadModelFromJson,
  createModelRenderer,
  setAttribute,
  setGradientDefinitions,
  setMaskDefinitions,
} = require("@metamask/logo/util");

const foxJson = require("@metamask/logo/fox.json");

type OptionType = {
  width: number;
  height: number;
  followMouse: boolean;
  followMotion: boolean;
  ref: RefObject<SVGSVGElement>;
};

function createLogo(options: OptionType) {
  const cameraDistance = 400;
  const { height, width } = calculateSizingOptions(options);
  const meshJson = foxJson;

  const container = options.ref.current;
  if (container != null) {
    setAttribute(container, "width", `${width}px`);
    setAttribute(container, "height", `${height}px`);

    setGradientDefinitions(container, meshJson.gradients);
    setMaskDefinitions({ container, masks: meshJson.masks, height, width });

    const modelObj = loadModelFromJson(meshJson);
    const renderFox = createModelRenderer(container, cameraDistance, modelObj);
    const renderScene = (lookCurrent: any, slowDrift: any) => {
      const rect = container.getBoundingClientRect();
      renderFox(rect, lookCurrent, slowDrift);
    };

    return createLogoViewer(container, renderScene, Object.assign({ cameraDistance }, options));
  }
  return null;
}

export function MetamaskLogo() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (ref && ref.current != null) {
      const logo = createLogo({
        width: 0.2,
        height: 0.2,
        followMouse: true,
        followMotion: true,
        ref,
      });
    }
  }, [ref]);

  return (
    <div id="logo-container">
      <svg ref={ref}></svg>
    </div>
  );
}
