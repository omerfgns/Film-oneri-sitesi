import React from 'react';
import styled, { keyframes } from 'styled-components';

const float = keyframes`
  0% {
    transform: translateY(0) translateX(0);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
  100% {
    transform: translateY(0) translateX(0);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const twinkle = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(
    135deg,
    #0f2027 0%,
    #203a43 50%,
    #2c5364 100%
  );
  overflow: hidden;
  z-index: -1;
`;

const GradientOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at center,
    transparent 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
`;

const Star = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${twinkle} ${props => props.duration}s ease-in-out infinite;
  box-shadow: 0 0 ${props => props.size * 2}px ${props => props.size}px rgba(255, 255, 255, 0.3);

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    box-shadow: 0 0 ${props => props.size}px rgba(255, 255, 255, 0.5);
  }
`;

const FloatingObject = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: linear-gradient(
    45deg,
    ${props => props.color1},
    ${props => props.color2}
  );
  border-radius: ${props => props.shape === 'circle' ? '50%' : '20%'};
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  opacity: 0.1;
  animation: ${float} ${props => props.duration}s ease-in-out infinite,
             ${rotate} ${props => props.duration * 2}s linear infinite;
  filter: blur(2px);
`;

const Background = () => {
  // Yıldızları oluştur
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 3 + 2
  }));

  // Yüzen objeleri oluştur
  const floatingObjects = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,
    top: Math.random() * 100,
    left: Math.random() * 100,
    duration: Math.random() * 10 + 10,
    color1: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
    color2: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
    shape: Math.random() > 0.5 ? 'circle' : 'square'
  }));

  return (
    <BackgroundContainer>
      <GradientOverlay />
      {stars.map(star => (
        <Star
          key={star.id}
          size={star.size}
          top={star.top}
          left={star.left}
          duration={star.duration}
        />
      ))}
      {floatingObjects.map(obj => (
        <FloatingObject
          key={obj.id}
          size={obj.size}
          top={obj.top}
          left={obj.left}
          duration={obj.duration}
          color1={obj.color1}
          color2={obj.color2}
          shape={obj.shape}
        />
      ))}
    </BackgroundContainer>
  );
};

export default Background; 