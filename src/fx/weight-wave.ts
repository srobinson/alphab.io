const RADIUS = 150;
const SPRING = 0.12;
const REST = 300;
const PEAK = 800;

function wrapChars(text: string, spans: HTMLSpanElement[]): DocumentFragment {
  const normalized = text.replace(/\s+/g, ' ');
  const frag = document.createDocumentFragment();
  for (const ch of normalized) {
    const span = document.createElement('span');
    span.textContent = ch;
    span.dataset.ww = '';
    span.style.fontWeight = String(REST);
    if (ch === ' ') span.style.whiteSpace = 'pre';
    frag.appendChild(span);
    spans.push(span);
  }
  return frag;
}

function processNode(node: Node, spans: HTMLSpanElement[]): Node {
  if (node.nodeType === Node.TEXT_NODE) {
    return wrapChars(node.textContent ?? '', spans);
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const clone = document.createElement(el.tagName);
    for (const attr of el.attributes) clone.setAttribute(attr.name, attr.value);
    el.childNodes.forEach((child) => clone.appendChild(processNode(child, spans)));
    return clone;
  }

  return node.cloneNode(true);
}

export function init() {
  if (!matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;

  const paragraphs = document.querySelectorAll<HTMLParagraphElement>('p');
  const spans: HTMLSpanElement[] = [];

  paragraphs.forEach((p) => {
    const frag = document.createDocumentFragment();
    p.childNodes.forEach((child) => frag.appendChild(processNode(child, spans)));
    p.innerHTML = '';
    p.appendChild(frag);
  });

  let mx = -9999;
  let my = -9999;
  const targets = new Float32Array(spans.length).fill(REST);

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mx = -9999;
    my = -9999;
  });

  function tick() {
    const rects = spans.map((s) => s.getBoundingClientRect());

    for (let i = 0; i < spans.length; i++) {
      const r = rects[i];
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.hypot(mx - cx, my - cy);
      const t = Math.max(0, 1 - dist / RADIUS);
      targets[i] = REST + (PEAK - REST) * t;
    }

    for (let i = 0; i < spans.length; i++) {
      const current = parseFloat(spans[i].style.fontWeight) || REST;
      const next = current + (targets[i] - current) * SPRING;
      spans[i].style.fontWeight = String(Math.round(next));
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
