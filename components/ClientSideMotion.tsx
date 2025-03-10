import { ReactNode, useEffect, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ClientSideMotionProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  animationProps?: HTMLMotionProps<"div">;
}

const ClientSideMotion = ({ children, animationProps, className, ...rest }: ClientSideMotionProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} {...animationProps} {...rest}>
      {children}
    </motion.div>
  );
};

export default ClientSideMotion; 