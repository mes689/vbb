import React, { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'scaleIn' | 'slideInUp';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function ScrollAnimation({ 
  children, 
  animation = 'fadeInUp', 
  delay = 0, 
  duration = 600,
  className = '' 
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    const baseClass = 'transition-all ease-out';
    const durationClass = `duration-${duration}`;
    
    if (!isVisible) {
      switch (animation) {
        case 'fadeInUp':
          return `${baseClass} ${durationClass} opacity-0 translate-y-8`;
        case 'fadeInLeft':
          return `${baseClass} ${durationClass} opacity-0 -translate-x-8`;
        case 'fadeInRight':
          return `${baseClass} ${durationClass} opacity-0 translate-x-8`;
        case 'fadeIn':
          return `${baseClass} ${durationClass} opacity-0`;
        case 'scaleIn':
          return `${baseClass} ${durationClass} opacity-0 scale-95`;
        case 'slideInUp':
          return `${baseClass} ${durationClass} opacity-0 translate-y-12`;
        default:
          return `${baseClass} ${durationClass} opacity-0 translate-y-8`;
      }
    } else {
      return `${baseClass} ${durationClass} opacity-100 translate-y-0 translate-x-0 scale-100`;
    }
  };

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
}

// Stagger animation for multiple items
interface StaggerAnimationProps {
  children: React.ReactNode[];
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'scaleIn';
  staggerDelay?: number;
  className?: string;
}

export function StaggerAnimation({ 
  children, 
  animation = 'fadeInUp', 
  staggerDelay = 100,
  className = '' 
}: StaggerAnimationProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollAnimation
          key={index}
          animation={animation}
          delay={index * staggerDelay}
        >
          {child}
        </ScrollAnimation>
      ))}
    </div>
  );
}