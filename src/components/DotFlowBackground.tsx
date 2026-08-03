import React, { useEffect, useRef } from 'react';

export const DotFlowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Grid details
    const spacing = 35;
    let cols = Math.ceil(width / spacing) + 1;
    let rows = Math.ceil(height / spacing) + 1;

    // Mouse tracking coordinates
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 120,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      cols = Math.ceil(width / spacing) + 1;
      rows = Math.ceil(height / spacing) + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Check if light mode is active on body
      const isLightMode = document.body.classList.contains('light-theme');
      
      // Select base colors based on theme
      const dotColor = isLightMode ? 'rgba(15, 12, 30, 0.15)' : 'rgba(255, 255, 255, 0.1)';

      time += 0.015;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          // Original positions
          const x0 = c * spacing;
          const y0 = r * spacing;

          // Gentle ambient wave motions (sine/cosine waves)
          const waveX = Math.sin(time + y0 * 0.01) * 6;
          const waveY = Math.cos(time + x0 * 0.01) * 6;

          let targetX = x0 + waveX;
          let targetY = y0 + waveY;

          // Calculate distance to mouse for interactive dot flow field
          const dx = mouse.x - targetX;
          const dy = mouse.y - targetY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let color = dotColor;
          let size = 1.2;

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius; // 0 to 1
            
            // Push dots slightly away from cursor
            targetX -= (dx / dist) * force * 12;
            targetY -= (dy / dist) * force * 12;

            // Increase dot size & glow near mouse
            size = 1.2 + force * 2.2;

            // Interpolate colors based on X coordinates (GTA 6 Cyan-to-Pink gradient vibe)
            const colorRatio = targetX / width;
            if (colorRatio < 0.5) {
              color = isLightMode 
                ? `rgba(8, 145, 178, ${0.2 + force * 0.6})`  // Cyan light theme
                : `rgba(0, 240, 255, ${0.25 + force * 0.65})`; // Cyan dark theme
            } else {
              color = isLightMode 
                ? `rgba(219, 39, 119, ${0.2 + force * 0.6})`  // Pink light theme
                : `rgba(255, 42, 133, ${0.25 + force * 0.65})`; // Pink dark theme
            }
          }

          // Draw the dot
          ctx.beginPath();
          ctx.arc(targetX, targetY, size, 0, Math.PI * 2);
          ctx.fillStyle = color;
          
          ctx.shadowBlur = 0;
          
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none', // Allow mouse clicks to pass through
        zIndex: 1, // Stay above background grid, below content cards
      }}
    />
  );
};
