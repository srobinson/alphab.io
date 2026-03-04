import './style.css';

const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

function typewrite(el: HTMLElement, html: string): Promise<void> {
  return new Promise(resolve => {
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    const parts: string[] = [];
    for (let i = 0; i < html.length;) {
      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        parts.push(html.slice(i, end + 1));
        i = end + 1;
      } else {
        parts.push(html[i++]);
      }
    }

    let pos = 0;
    let buf = '';

    const delay = () => {
      const r = Math.random();
      return r < 0.55 ? 3 + Math.random() * 2
           : r < 0.85 ? 8 + Math.random() * 8
           : r < 0.95 ? 15 + Math.random() * 10
           : 25 + Math.random() * 15;
    };

    const step = () => {
      if (pos >= parts.length) {
        el.innerHTML = buf;
        el.appendChild(cursor);
        resolve();
        return;
      }

      const p = parts[pos++];
      buf += p;
      el.innerHTML = buf;
      el.appendChild(cursor);

      if (p[0] === '<') { step(); return; }

      let d = delay();
      if (p === '.' || p === '!') d += 25;
      else if (p === '—') d += 15;

      setTimeout(step, d);
    };

    step();
  });
}

async function init() {
  const bio = document.querySelector('.bio') as HTMLElement;
  const links = document.querySelectorAll<HTMLElement>('.link, .link-primary');

  const bioHTML = bio.innerHTML.trim().replace(/\s+/g, ' ');
  bio.innerHTML = '';

  await wait(800);
  bio.classList.add('visible');
  await typewrite(bio, bioHTML);

  await wait(300);
  for (const link of links) {
    link.classList.add('revealed');
    const icon = link.querySelector('svg') as HTMLElement | null;
    if (icon) {
      icon.style.transform = 'scale(1.3)';
      requestAnimationFrame(() => {
        setTimeout(() => { icon.style.transform = ''; }, 200);
      });
    }
    await wait(150);
  }
}

init();
