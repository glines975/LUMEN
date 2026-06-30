import React, { useEffect, useRef, useState } from 'react';

interface WebGLDepthMapProps {
  image: string;
  depthMap: string;
  offsetX: number;     // Normalized mouse offset X (-1 to 1)
  offsetY: number;     // Normalized mouse offset Y (-1 to 1)
  scrollProgress: number; // Normalized scroll progress (0 to 1)
  onLoadStatusChange?: (success: boolean) => void;
}

export default function WebGLDepthMap({
  image,
  depthMap,
  offsetX,
  offsetY,
  scrollProgress,
  onLoadStatusChange
}: WebGLDepthMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);

  // Keep tracking mouse targets for smooth easing interpolation
  const targetOffset = useRef({ x: 0, y: 0 });
  const currentOffset = useRef({ x: 0, y: 0 });

  // References for WebGL resources to clean up properly
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texturesRef = useRef<{ image: WebGLTexture | null; depth: WebGLTexture | null }>({ image: null, depth: null });
  const imageElementsRef = useRef<{ image: HTMLImageElement | null; depth: HTMLImageElement | null }>({ image: null, depth: null });

  // Local state to handle failure
  const [hasError, setHasError] = useState(false);

  // Update targets when offsets change
  useEffect(() => {
    // Add scroll integration to vertical offset to double down on cinematic depth
    // Increased mouse tracking offsets for an amplified, immersive parallax depth effect
    targetOffset.current = {
      x: offsetX * 0.12, // Increased displacement strength for wider tracking range
      y: (offsetY * 0.12) + (scrollProgress * -0.09), // Enhanced scroll-based depth integration
    };
  }, [offsetX, offsetY, scrollProgress]);

  useEffect(() => {
    let active = true;
    setHasError(false);
    if (onLoadStatusChange) onLoadStatusChange(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Initialize WebGL
    const gl = canvas.getContext('webgl', { alpha: false, premultipliedAlpha: false });
    if (!gl) {
      console.error('WebGL not supported');
      setHasError(true);
      if (onLoadStatusChange) onLoadStatusChange(false);
      return;
    }
    glRef.current = gl;

    // 2. Vertex Shader Code
    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        // Convert screen coordinates [-1, 1] to texture coordinates [0, 1]
        v_texCoord = a_position * 0.5 + 0.5;
        // Flip texture Y-axis
        v_texCoord.y = 1.0 - v_texCoord.y;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // 3. Fragment Shader Code (Pixel Displacement Map Shader)
    const fsSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_image;
      uniform sampler2D u_depthMap;
      uniform vec2 u_offset;
      
      void main() {
        // Read depth value from depth map (red channel is sufficient for grayscale)
        float depth = texture2D(u_depthMap, v_texCoord).r;
        
        // Displace coordinate. Closer pixels move more, farther pixels move less.
        vec2 displacedCoord = v_texCoord + u_offset * (depth - 0.5);
        
        // Zoom slightly to hide border clipping artifacts - adjusted to be smaller/less zoomed-in
        vec2 zoomedCoord = (displacedCoord - 0.5) * 0.93 + 0.5;
        
        // Clamp to edge to prevent wrapping pixels
        zoomedCoord = clamp(zoomedCoord, 0.0, 1.0);
        
        gl_FragColor = texture2D(u_image, zoomedCoord);
      }
    `;

    // Compile Shader helper
    const loadShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = loadShader(gl.VERTEX_SHADER, vsSource);
    const fs = loadShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setHasError(true);
      if (onLoadStatusChange) onLoadStatusChange(false);
      return;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      setHasError(true);
      if (onLoadStatusChange) onLoadStatusChange(false);
      return;
    }
    programRef.current = program;

    // Vertex Buffer: Simple screen-filling quad
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Look up shader parameters
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const uOffsetLoc = gl.getUniformLocation(program, 'u_offset');
    const uImageLoc = gl.getUniformLocation(program, 'u_image');
    const uDepthLoc = gl.getUniformLocation(program, 'u_depthMap');

    // Setup Quad Attribute
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Load textures asynchronously
    const texImage = gl.createTexture();
    const texDepth = gl.createTexture();
    texturesRef.current = { image: texImage, depth: texDepth };

    let imageLoaded = false;
    let depthLoaded = false;

    const img = new Image();
    const depthImg = new Image();
    imageElementsRef.current = { image: img, depth: depthImg };

    const setupTexture = (texture: WebGLTexture | null, imageEl: HTMLImageElement | HTMLCanvasElement) => {
      if (!texture || !gl) return;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      // Set parameters for non-power-of-two compatibility
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageEl);
    };

    const createFallbackDepthMap = () => {
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 256;
      fallbackCanvas.height = 256;
      const ctx = fallbackCanvas.getContext('2d');
      if (ctx) {
        // Vertical gradient: white at bottom (closer), black at top (farther)
        const grad = ctx.createLinearGradient(0, 256, 0, 0);
        grad.addColorStop(0, '#ffffff'); // Foreground (White)
        grad.addColorStop(0.3, '#bbbbbb');
        grad.addColorStop(1, '#000000'); // Background (Black)
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 256, 256);
      }
      return fallbackCanvas;
    };

    const createFallbackImage = () => {
      const fallbackCanvas = document.createElement('canvas');
      fallbackCanvas.width = 512;
      fallbackCanvas.height = 512;
      const ctx = fallbackCanvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 300);
        grad.addColorStop(0, '#10172a');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Grid pattern
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 512; i += 32) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 512);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(512, i);
          ctx.stroke();
        }

        // Add glowing center
        ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
        ctx.beginPath();
        ctx.arc(256, 256, 40, 0, Math.PI * 2);
        ctx.fill();
      }
      return fallbackCanvas;
    };

    const handleLoadComplete = () => {
      if (!active || !gl) return;
      if (imageLoaded && depthLoaded) {
        if (onLoadStatusChange) onLoadStatusChange(true);
        startRenderLoop();
      }
    };

    // Setup image loading without unconditional crossOrigin to prevent base64 failures
    if (image && !image.startsWith('data:') && !image.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    } else {
      img.removeAttribute('crossOrigin');
    }
    
    img.onload = () => {
      imageLoaded = true;
      setupTexture(texImage, img);
      handleLoadComplete();
    };
    img.onerror = (err) => {
      console.warn('Original background image failed to load, generating procedural background', err);
      if (active && gl) {
        const fallbackCanvas = createFallbackImage();
        setupTexture(texImage, fallbackCanvas);
        imageLoaded = true;
        handleLoadComplete();
      }
    };

    if (depthMap && !depthMap.startsWith('data:') && !depthMap.startsWith('blob:')) {
      depthImg.crossOrigin = 'anonymous';
    } else {
      depthImg.removeAttribute('crossOrigin');
    }
    
    depthImg.onload = () => {
      depthLoaded = true;
      setupTexture(texDepth, depthImg);
      handleLoadComplete();
    };
    depthImg.onerror = (err) => {
      console.warn('Depth map image failed to load, generating linear gradient fallback depth map', err);
      if (active && gl) {
        const fallbackCanvas = createFallbackDepthMap();
        setupTexture(texDepth, fallbackCanvas);
        depthLoaded = true;
        handleLoadComplete();
      }
    };

    // Trigger load
    if (image && image.trim() !== '') {
      img.src = image;
    } else {
      const fallbackCanvas = createFallbackImage();
      setupTexture(texImage, fallbackCanvas);
      imageLoaded = true;
      handleLoadComplete();
    }

    if (depthMap && depthMap.trim() !== '') {
      depthImg.src = depthMap;
    } else {
      // Immediately generate fallback gradient
      const fallbackCanvas = createFallbackDepthMap();
      setupTexture(texDepth, fallbackCanvas);
      depthLoaded = true;
      handleLoadComplete();
    }

    // Render loop with lerp easing
    const startRenderLoop = () => {
      const render = () => {
        if (!active || !gl || !program || !canvas) return;

        // Easing interpolation for smooth fluid tracking
        currentOffset.current.x += (targetOffset.current.x - currentOffset.current.x) * 0.08;
        currentOffset.current.y += (targetOffset.current.y - currentOffset.current.y) * 0.08;

        // Resize viewport dynamically to container bounds
        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth * dpr;
        const height = canvas.clientHeight * dpr;
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.useProgram(program);

        // Bind Image Texture (Texture Unit 0)
        gl.activeTexture(gl.TEXTURE_0);
        gl.bindTexture(gl.TEXTURE_2D, texImage);
        gl.uniform1i(uImageLoc, 0);

        // Bind Depth Texture (Texture Unit 1)
        gl.activeTexture(gl.TEXTURE_1);
        gl.bindTexture(gl.TEXTURE_2D, texDepth);
        gl.uniform1i(uDepthLoc, 1);

        // Send Offset Uniform
        gl.uniform2f(uOffsetLoc, currentOffset.current.x, currentOffset.current.y);

        // Draw quad
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestRef.current = requestAnimationFrame(render);
      };

      requestRef.current = requestAnimationFrame(render);
    };

    return () => {
      active = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      
      // Clean up resources
      if (gl) {
        if (texturesRef.current.image) gl.deleteTexture(texturesRef.current.image);
        if (texturesRef.current.depth) gl.deleteTexture(texturesRef.current.depth);
        if (buffer) gl.deleteBuffer(buffer);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [image, depthMap]);

  if (hasError) {
    return null; // Graceful fallback back to CSS/DOM layered rendering
  }

  return (
    <canvas 
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-opacity duration-1000 opacity-100"
    />
  );
}
