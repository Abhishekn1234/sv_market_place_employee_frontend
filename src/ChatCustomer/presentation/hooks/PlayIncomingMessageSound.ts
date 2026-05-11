export function playIncomingMessageSound() {
  try {
    const AudioContext =
      window.AudioContext ||
      (window as any).webkitAudioContext;

    if (!AudioContext) return;

    const audioContext =
      new AudioContext();

    const oscillator =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      740,
      audioContext.currentTime
    );

    oscillator.frequency.exponentialRampToValueAtTime(
      520,
      audioContext.currentTime + 0.12
    );

    gain.gain.setValueAtTime(
      0.001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.18,
      audioContext.currentTime + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.18
    );

    oscillator.connect(gain);

    gain.connect(
      audioContext.destination
    );

    oscillator.start();

    oscillator.stop(
      audioContext.currentTime + 0.2
    );

    oscillator.onended = () => {
      audioContext
        .close()
        .catch(() => undefined);
    };
  } catch {}
}