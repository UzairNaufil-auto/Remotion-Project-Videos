import {loadFont as loadAnton} from "@remotion/google-fonts/Anton";
import {loadFont as loadBodoni} from "@remotion/google-fonts/BodoniModa";

const anton = loadAnton("normal", {weights: ["400"], subsets: ["latin"]});
const bodoni = loadBodoni("italic", {weights: ["600"], subsets: ["latin"]});

export const ANTON = anton.fontFamily;
export const BODONI = bodoni.fontFamily;
