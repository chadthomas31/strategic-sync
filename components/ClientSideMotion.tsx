import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useEffect, useState } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  animationProps: any;
}

export default function ClientSideMotion({ children, className = '', animationProps }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // During SSR and initial client render, return a static div
  if (!isMounted) {
    return (
      <div className={className} style={{ opacity: 0 }}>
        {children}
      </div>
    );
  }

  // Once mounted on client, return the animated component
  return (
    <motion.div
      className={className}
      {...animationProps}
    >
      {children}
    </motion.div>
  );
} 