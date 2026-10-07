// Tüm sesler Web Audio API ile üretilir — dosya gerekmez!

const ctx = () => new (window.AudioContext || window.webkitAudioContext)()

function beep(freq, dur, type = 'sine', vol = 0.15, when = 0) {
  const ac = ctx()
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type; osc.frequency.value = freq
  gain.gain.setValueAtTime(vol, ac.currentTime + when)
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + when + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(ac.currentTime + when); osc.stop(ac.currentTime + when + dur)
}

export const sounds = {
  // Sepete ekle: neşeli "ding"
  ding() { beep(880, .15); beep(1320, .25, 'sine', .15, .1) },
  // Ödeme: kaşe/para sesi (hızlı arpej)
  cash() { [660, 880, 1100, 1320].forEach((f, i) => beep(f, .12, 'triangle', .12, i * .07)) },
  // Kutu açma: bant yırtılma (gürültü benzeri)
  tape() {
    const ac = ctx()
    const buffer = ac.createBuffer(1, ac.sampleRate * .4, ac.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    const src = ac.createBufferSource(); src.buffer = buffer
    const filter = ac.createBiquadFilter(); filter.type = 'highpass'; filter.frequency.value = 1500
    src.connect(filter).connect(ac.destination); src.start()
  },
  // İndirim: "vay" hissi (yukarı kayan)
  wow() { beep(440, .2, 'sawtooth', .08); beep(660, .2, 'sawtooth', .08, .15); beep(990, .3, 'sawtooth', .08, .3) },
  // Hata: "uh oh"
  uhoh() { beep(220, .2, 'square', .08); beep(180, .3, 'square', .08, .2) },
  // Çark dönüşü tık sesi
  tick() { beep(1200, .03, 'square', .05) },
}
