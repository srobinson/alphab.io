export function init() {
  let ctx: AudioContext | null = null;

  function tick() {
    if (!ctx) ctx = new AudioContext();
    const now = ctx.currentTime;

    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.004, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 3500;
    bp.Q.value = 1.5;

    const dry = ctx.createGain();
    dry.gain.value = 0.06;

    const delay = ctx.createDelay();
    delay.delayTime.value = 0.08;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.3;
    const delayGain = ctx.createGain();
    delayGain.gain.value = 0.04;

    delay.connect(feedback).connect(delay);
    delay.connect(delayGain);

    src.connect(bp);
    bp.connect(dry).connect(ctx.destination);
    bp.connect(delay);
    delayGain.connect(ctx.destination);

    dry.gain.setValueAtTime(0.06, now);
    dry.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    delayGain.gain.setValueAtTime(0.04, now);
    delayGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    src.start(now);
    src.stop(now + 0.004);

    setTimeout(() => {
      src.disconnect();
      bp.disconnect();
      dry.disconnect();
      delay.disconnect();
      feedback.disconnect();
      delayGain.disconnect();
    }, 500);
  }

  document.addEventListener('mouseover', (e) => {
    const anchor = (e.target as Element).closest('a');
    if (!anchor || anchor.dataset.toneArmed) return;
    anchor.dataset.toneArmed = '1';
    tick();
    anchor.addEventListener('mouseleave', () => delete anchor.dataset.toneArmed, { once: true });
  });
}
