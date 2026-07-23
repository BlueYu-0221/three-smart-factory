# Three.js Smart Factory 3D Scene

A digital twin 3D visualization of a smart factory built with vanilla Three.js.

## Live Preview

👉 [Live Demo](https://blueyu-0221.github.io/three-smart-factory/)

## Tech Stack
- Three.js (latest)
- Vite build tool
- Vanilla JavaScript, no other 3D framework dependencies

## Features

### Scene Elements
- ✅ Green grassland + sky background + fog effect
- ✅ Black asphalt road system (with white dashed lines, horizontal main road + vertical side roads)
- ✅ Factory concrete floor
- ✅ Main factory building (beige walls, blue roof, windows, doors)
- ✅ Two cylindrical storage tanks (dark gray tank body, blue pipes, climbing ladders)
- ✅ Blue water pool (with shader-based water ripple animation)
- ✅ Three truck models (black cab, gray cargo bed)
- ✅ Numerous trees (scattered along roads and around the factory, randomized sizes)
- ✅ Silver flagpole + Chinese national flag (with shader-based waving animation)
- ✅ 3D floating labels: Building C, Equipment A, Equipment B

### Interactions
- ✅ OrbitControls: mouse rotation, zoom, and pan support
- ✅ Bottom navigation buttons: Home, Equipment A, Equipment B
- ✅ Smooth camera fly-to animation on button click (easeOutCubic easing)
- ✅ Water ripple shader animation (dual sine-wave superposition + brightness variation)
- ✅ Flag waving shader animation (fixed at the pole side, greater wave amplitude on the free side)
- ✅ PCFSoftShadowMap soft shadow effects
- ✅ Responsive window resizing

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Mode
```bash
npm run dev
```
Then open http://localhost:5173 in your browser.

### Production Build
```bash
npm run build
```
Build output goes to the `dist` directory.

### Preview Production Build
```bash
npm run preview
```

## Project Structure
```
threejs-factory/
├── src/
│   └── main.js          # Main entry point, contains all scene code
├── index.html           # HTML entry, contains UI styles
├── package.json         # Project configuration
└── dist/                # Build output directory
```

## Controls
- **Left mouse drag**: Rotate the view
- **Mouse wheel**: Zoom in/out
- **Right mouse drag**: Pan the view
- **Bottom buttons**: Click to switch to preset views (Home / Equipment A / Equipment B)
