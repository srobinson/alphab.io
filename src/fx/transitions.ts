export function init() {
  document.body.style.transition = 'opacity 0.3s ease-out';

  document.addEventListener('click', (e) => {
    const anchor = (e.target as Element).closest('a[href]') as HTMLAnchorElement | null;
    if (!anchor) return;

    const url = anchor.href;
    e.preventDefault();

    document.body.style.opacity = '0';
    setTimeout(() => { location.href = url; }, 300);
  });
}
