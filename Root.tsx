import React from "react";
import {Composition} from "remotion";
import {Intro} from "./Intro";
import {Explainer} from "./Explainer";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Explainer"
        component={Explainer}
        durationInFrames={900} // 30 seconds at 30fps
        fps={30}
        width={1080}
        height={1920} // vertical: Shorts / Reels / TikTok
      />
    </>
  );
};
