import { Player } from "@lottiefiles/react-lottie-player";
import { useEffect, useRef } from "react";
import heartAnimation from "../public/heart-animation.json";
 
export const FavoriteIconAnim: React.FC<{
 on: boolean;
}> = ({ on }) => {
 const playerRef = useRef<Player>(null);
 
 useEffect(() => {
   if (!playerRef.current) {
     return;
   }
   if (on) {
     playerRef.current.play();
   } else {
     playerRef.current.stop();
   }
 }, [on]);
 
 return (
  <div className="relative w-50 h-50">
   <Player ref={playerRef} speed={1.8} keepLastFrame src={heartAnimation} style={{ width: '150px', height: '150px' }}/>
   </div>
 );
};

export default FavoriteIconAnim;