import * as THREE from 'three';
import { TOTAL_PAGES } from '../data/bookData';

class TextureCache {
  private textures: Map<number, THREE.Texture> = new Map();
  private loader = new THREE.TextureLoader();
  private listeners: Set<() => void> = new Set();
  public loadedCount = 0;
  private deskTexture: THREE.CanvasTexture | null = null;
  private paperEdgeTexture: THREE.CanvasTexture | null = null;
  private spineTexture: THREE.CanvasTexture | null = null;

  public preloadAll(onProgress?: (progress: number) => void) {
    // Eagerly load the first 4 pages, then lazily queue the rest
    const loadOrder = [1, 2, 3, 4];
    for (let i = 5; i <= TOTAL_PAGES; i++) {
      loadOrder.push(i);
    }

    let loaded = 0;
    loadOrder.forEach((page) => {
      this.loader.load(
        `/pages/page-${String(page).padStart(2, '0')}.jpg`,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.generateMipmaps = true;
          tex.minFilter = THREE.LinearMipmapLinearFilter;
          tex.magFilter = THREE.LinearFilter;
          this.textures.set(page, tex);
          loaded++;
          this.loadedCount = loaded;
          if (onProgress) {
            onProgress(loaded / TOTAL_PAGES);
          }
          this.notify();
        },
        undefined,
        () => {
          // Fallback procedural page texture if an image fails
          const fallback = this.createFallbackTexture(page);
          this.textures.set(page, fallback);
          loaded++;
          this.loadedCount = loaded;
          if (onProgress) onProgress(loaded / TOTAL_PAGES);
          this.notify();
        }
      );
    });
  }

  public getTexture(pageNumber: number): THREE.Texture {
    const existing = this.textures.get(pageNumber);
    if (existing) return existing;

    // Load on demand
    const tex = this.loader.load(`/pages/page-${String(pageNumber).padStart(2, '0')}.jpg`, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      this.notify();
    });
    this.textures.set(pageNumber, tex);
    return tex;
  }

  public subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Generates rich dark oak / mahogany study desk texture
  public getDeskTexture(): THREE.CanvasTexture {
    if (this.deskTexture) return this.deskTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Base warm deep wood tones
    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, '#1c1510');
    grad.addColorStop(0.5, '#261b14');
    grad.addColorStop(1, '#150f0c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Wood grain lines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let i = 0; i < 220; i++) {
      const y = Math.random() * 1024;
      const h = Math.random() * 4 + 1;
      ctx.fillRect(0, y, 1024, h);
    }

    ctx.fillStyle = 'rgba(217, 174, 104, 0.03)';
    for (let i = 0; i < 100; i++) {
      const y = Math.random() * 1024;
      const h = Math.random() * 2 + 0.5;
      ctx.fillRect(0, y, 1024, h);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 3);
    this.deskTexture = tex;
    return tex;
  }

  // Generates realistic fine paper edge texture (horizontal cream layered lines)
  public getPaperEdgeTexture(): THREE.CanvasTexture {
    if (this.paperEdgeTexture) return this.paperEdgeTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Base antique cream
    ctx.fillStyle = '#eae2cf';
    ctx.fillRect(0, 0, 256, 256);

    // Individual book page edge striations
    for (let y = 0; y < 256; y += 2) {
      const shade = Math.random() * 0.15;
      ctx.fillStyle = `rgba(80, 60, 40, ${shade})`;
      ctx.fillRect(0, y, 256, 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 4);
    this.paperEdgeTexture = tex;
    return tex;
  }

  // Generates book spine texture with title and author in gold foil
  public getSpineTexture(): THREE.CanvasTexture {
    if (this.spineTexture) return this.spineTexture;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Dark navy textured background matching book cover
    const grad = ctx.createLinearGradient(0, 0, 0, 128);
    grad.addColorStop(0, '#091322');
    grad.addColorStop(0.5, '#122036');
    grad.addColorStop(1, '#091322');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 128);

    // Golden embossed border line
    ctx.strokeStyle = '#d9ae68';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 8, 488, 112);

    // Golden spine typography
    ctx.fillStyle = '#f3ce8a';
    ctx.font = 'bold 22px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.letterSpacing = '4px';
    ctx.fillText('THE FAKE OF LOYAL', 256, 48);

    ctx.fillStyle = '#d9ae68';
    ctx.font = '14px system-ui, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('SANJAY', 256, 82);

    const tex = new THREE.CanvasTexture(canvas);
    this.spineTexture = tex;
    return tex;
  }

  private createFallbackTexture(pageNumber: number): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 567;
    canvas.height = 804;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#faf6ed';
    ctx.fillRect(0, 0, 567, 804);

    ctx.fillStyle = '#1c2838';
    ctx.font = '24px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Page ${pageNumber}`, 283, 400);

    return new THREE.CanvasTexture(canvas);
  }
}

export const textureCache = new TextureCache();
