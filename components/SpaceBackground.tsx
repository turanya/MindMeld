import React, { useMemo } from 'react';

interface StarProps {
  left: number;
  top: number;
  animationDelay: number;
  scale: number;
}

const SpaceBackground: React.FC = () => {
  // Generate random stars
  const stars = useMemo(() => {
    const starsArray: StarProps[] = [];
    const starCount = 50 + Math.floor(Math.random() * 50); // 50-100 stars
    
    for (let i = 0; i < starCount; i++) {
      starsArray.push({
        left: Math.random() * 100, // percentage of viewport width
        top: Math.random() * 100,  // percentage of viewport height
        animationDelay: Math.random() * 5,
        scale: 0.05 + Math.random() * 1.5
      });
    }
    
    return starsArray;
  }, []);

  return (
    <>
      <div className="space-background">
        {/* Additional stars */}
        {stars.map((star, index) => (
          <div 
            key={index}
            style={{
              position: 'absolute',
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.animationDelay}s`,
              transform: `scale(${star.scale})`
            }}
            className="star"
          />
        ))}
        
        {/* Shooting stars */}
        <div className="shooting-star shooting-star-1"></div>
        <div className="shooting-star shooting-star-2"></div>
        <div className="shooting-star shooting-star-3"></div>
        <div className="shooting-star shooting-star-4"></div>
        
        {/* Purple glow */}
        <div 
          className="purple-glow"
          style={{
            top: '30%',
            left: '20%',
          }}
        ></div>
        
        <div 
          className="purple-glow"
          style={{
            top: '60%',
            left: '70%',
            width: '10em',
            height: '10em',
            opacity: '0.7'
          }}
        ></div>
      </div>
      <div className="space-gradient"></div>
    </>
  );
};

export default SpaceBackground;
