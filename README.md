# Badvisor Viewer — Three.js Prototype

This build is the current Three.js/R3F viewer prototype, updated after review against the supplied legacy Badvisor documentation.

## What was fixed in this revision

- Fixed MTL file detection for OBJ + MTL imports.
- Added VRM loader registration with `@pixiv/three-vrm`.
- Improved primary-file selection when multiple asset dependencies are selected.
- Fixed the case-sensitive `ThreeDText` import so Linux/CI builds resolve it correctly.
- Replaced the Essentials fake box with the same runtime 3D-text creation flow used by Elements.
- Switched 3D text to the bundled local Helvetiker font instead of a remote font dependency.
- Fixed the screen-recording timer updating bitrate instead of elapsed recording time.
- Fixed FloatingCard width calculation and initial viewport clamping.
- Added viewport-responsive sidebar sizing for desktop, tablet and mobile.
- Added `vw`/`vh`-based responsive sizing rules and mobile footer behavior.
- Wired Scene Settings background, transparency, environment intensity, fog and wireframe to the Three.js runtime.
- Cleaned invalid Tailwind utility names and small accessibility attribute issues.
- Added Element drag payloads so the editor has a proper drag source for the next viewport drop implementation.

## Important validation note

A full `vite build` could not be completed in the review environment because dependency installation was unavailable/incomplete. The source was checked for local import-path errors and the reviewed bug patterns were removed. Run `npm install` and then:

```bash
npm run lint
npm run build
```

before merging into the development branch.

## Direction from the legacy Badvisor documentation

The old documentation is being used as the product behavior reference. The Three.js implementation should preserve the existing scene-data contract and editor concepts while replacing Babylon-specific runtime APIs. In particular, the long-term architecture should retain the scene groups for assets, nodes, materials, textures, lights, cameras, effects, sounds, animation groups, actions, variables, overlays, control nodes and collections.
