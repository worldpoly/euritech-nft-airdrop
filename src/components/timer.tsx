import { useState, useEffect, useRef } from "react";
import { useTimer } from "react-timer-hook";
// @ts-ignore
import * as TweenMax from "gsap/TweenMax";
// @ts-ignore
import * as EasyPack from "gsap/EasePack";
import "./timer.css";

const stageWidth = window.innerWidth;
const stageHeight = 350; //window.innerHeight;

const numberStageWidth = 800;
const numberStageHeight = 350;
const circleRadius = 2;
const colors = ["61, 207, 236", "255, 244, 174", "255, 211, 218", "151, 211, 226"];

export function Timer({ expiryTimestamp, onExpire }: { expiryTimestamp: Date; onExpire: () => void }) {
  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire,
  });

  const [initialized, setInitialized] = useState<boolean>(false);

  const [dots, setDots] = useState<any[]>([]);

  const [numberOffsetX, setNumberOffsetX] = useState<number>(0);
  const [numberOffsetY, setNumberOffsetY] = useState<number>(0);

  const canvasNumberRef = useRef<HTMLCanvasElement>(null);
  const canvasDotRef = useRef<HTMLCanvasElement>(null);

  const [pixCoordinates, setPixCoordinates] = useState<{ pix: any[]; dots: any[] }>({ pix: [], dots: [] });

  useEffect(() => {
    start();
  });

  useEffect(() => {
    if (dots) {
      loop(dots);
    }
  }, [dots]);

  useEffect(() => {
    formNumber(pixCoordinates.pix, pixCoordinates.dots);
    return () => {
      breakNumber(pixCoordinates.pix, pixCoordinates.dots);
    };
  }, [pixCoordinates]);

  const init = () => {
    // Init stage which will have numbers
    const numberStage = canvasNumberRef.current;
    if (numberStage) {
      // Set the canvas to width and height of the window
      numberStage.width = numberStageWidth;
      numberStage.height = numberStageHeight;

      // Init Stage which will have dots
      const stage = canvasDotRef.current;
      if (stage) {
        stage.width = stageWidth;
        stage.height = stageHeight;
      }

      // Create offset so text appears in middle of screen
      setNumberOffsetX((stageWidth - numberStageWidth) / 2);
      //setNumberOffsetY((stageHeight - numberStageHeight) / 2);

      //setNumberOffsetX(0);
      setNumberOffsetY(0);
    }

    setInitialized(true);
    console.log("initialized");
  };

  function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  function tweenDots(dot: Dot, pos: any, type: any) {
    // Move dots around canvas randomly
    if (dot) {
      if (type === "space") {
        // Tween dot to coordinate to form number
        TweenMax.TweenMax.to(dot, 0.5, {
          x: randomNumber(0, stageWidth),
          y: randomNumber(0, stageHeight),
          alpha: 0.2,
          delay: 0,
          ease: EasyPack.Expo.easeInOut,
          onComplete: function () {
            tweenDots(dot, "", "space");
          },
        });
      } else {
        // Tween dot to coordinate to form number
        TweenMax.TweenMax.to(dot, 0.5, {
          //1.5 + Math.round(Math.random() * 100) / 100
          x: pos.x + numberOffsetX,
          y: pos.y + numberOffsetY,
          delay: 0,
          alpha: 1,
          ease: EasyPack.Expo.easeInOut,
          onComplete: function () {},
        });
      }
    }
  }

  const formNumber = (numberPixelCoordinates: any[], dots: any[]) => {
    for (var i = 0; i < numberPixelCoordinates.length; i++) {
      // Loop out as many coordionates as we need & pass dots in to animate
      tweenDots(dots[i], numberPixelCoordinates[i], "");
    }
  };

  const breakNumber = (numberPixelCoordinates: any[], dots: any[]) => {
    for (var i = 0; i < numberPixelCoordinates.length; i++) {
      tweenDots(dots[i], "", "space");
    }
  };

  const drawNumber = (num: string, dots: any[]) => {
    // Create a number on a seperate canvas
    // Use a seperate canvas thats smaller so we have less data to loop over when using getImagedata()

    const numberStageCtx: CanvasRenderingContext2D = canvasNumberRef.current?.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    if (numberStageCtx) {
      //	Clear stage of previous numbers
      numberStageCtx.clearRect(0, 0, numberStageWidth, numberStageHeight);

      numberStageCtx.fillStyle = "#24282f";
      numberStageCtx.textAlign = "center";
      numberStageCtx.font = "bold 400px Lato";

      const measured: TextMetrics = numberStageCtx.measureText(num);

      numberStageCtx.fillText(num, measured.actualBoundingBoxLeft, measured.actualBoundingBoxAscent);

      const ctx = canvasNumberRef.current?.getContext("2d") as CanvasRenderingContext2D;

      // getImageData(x, y, width, height)
      // note: is an exspenisve function, so make sure canvas is small as possible for what you grab
      // Returns 1 Dimensional array of pixel color value chanels
      // Red, blue, green, alpha chanel of single pixel
      // First chanel is red
      const imageData = ctx.getImageData(0, 0, numberStageWidth, numberStageHeight).data;

      // Clear number coordinated
      // setNumberPixelCoordinates([]);

      // i is equal to total image data(eg: 480,000)
      // run while i is greater or equal to 0
      // every time we run it minus 4 from i. Do this because each pixel has 4 chanels & we are only interested in individual pixels
      const temp = [];
      for (let i = imageData.length; i >= 0; i -= 4) {
        // If not an empty pixel
        if (imageData[i] !== 0) {
          // i represents the position in the array a red pixel was found

          // (i / 4 ) and percentage by width of canvas
          // Need to divide i by 4 because it has 4 values and you need its orginal position
          // Then you need to percentage it by the width(600) because each row contains 600 pixels and you need its relative position in that row
          const x = (i / 4) % numberStageWidth;

          // (i divide by width) then divide by 4
          // Divide by width(600) first so you get the rows of pixels that make up the canvas. Then divide by 4 to get its postion within the row
          const y = Math.floor(Math.floor(i / numberStageWidth) / 4);

          // If position exists and number is divisble by circle plus a pixel gap then add cordinates to array. So circles do not overlap
          if (x && x % (circleRadius * 2 + 3) == 0 && y && y % (circleRadius * 2 + 3) == 0) {
            // Push object to numberPixels array with x and y coordinates
            temp.push({ x: x, y: y });
          }
        }
      }

      setPixCoordinates({ pix: temp, dots });
      // formNumber(temp, dots);
    }
  };

  const loop = (dots_: any[]) => {
    const stageCtx = canvasDotRef.current?.getContext("2d");
    if (stageCtx && dots && dots.length > 0) {
      stageCtx.clearRect(0, 0, stageWidth, stageHeight);

      for (var i = 0; i < dots.length; i++) {
        dots[i].draw(stageCtx);
      }

      requestAnimationFrame(() => {
        loop(dots_);
      });
    }
  };

  class Dot {
    x: number;
    y: number;
    color: string;
    alpha: number;
    draw: (stageCtx: any) => void;

    constructor(x: number, y: number, color: string, alpha: number) {
      const _this = this;

      this.x = x;
      this.y = y;
      this.color = color;
      this.alpha = alpha;

      this.draw = function (stageCtx) {
        if (stageCtx) {
          stageCtx.beginPath();
          stageCtx.arc(_this.x, _this.y, circleRadius, 0, 2 * Math.PI, false);
          stageCtx.fillStyle = "rgba(" + _this.color + ", " + _this.alpha + ")";
          stageCtx.fill();
        }
      };
    }
  }

  useEffect(() => {
    init();

    const dots_ = [];
    for (let i = 0; i < 3500; i++) {
      // Create a dot
      const dot = new Dot(
        randomNumber(0, stageWidth),
        randomNumber(0, stageHeight),
        colors[randomNumber(1, colors.length)],
        0.9
      );

      // Push to into an array of dots
      dots_.push(dot);

      // Animate dots
      tweenDots(dot, "", "space");
    }
    setDots(dots_);

    setInitialized(true);
    return () => {
      // setInitialized(false);
    };
  }, [setDots]);

  useEffect(() => {
    if (initialized) {
      const s = seconds < 10 ? `0${seconds}` : seconds;
      drawNumber(`${minutes}:${s}`, dots);
    }
  }, [seconds, initialized]);

  return (
    <>
      <canvas id="canvas-number" ref={canvasNumberRef}></canvas>
      <canvas id="canvas-dots" ref={canvasDotRef}></canvas>
    </>
  );
}
