
export function say(text: string) {
  if (!('speechSynthesis' in window)) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Sanitize text for math symbols in Spanish
  let sanitized = text
    .replace(/\s*[xX*]\s*/g, ' por ')
    .replace(/\s*:\s*/g, ' dividido por ')
    .replace(/\s*-\s*/g, ' menos ')
    .replace(/\s*\+\s*/g, ' más ')
    .replace(/\s*=\s*/g, ' es igual a ');
  
  const utterance = new SpeechSynthesisUtterance(sanitized);
  utterance.lang = 'es-AR'; // Argentine Spanish if possible, or es-ES
  if (!window.speechSynthesis.getVoices().find(v => v.lang === 'es-AR')) {
    utterance.lang = 'es-ES';
  }
  utterance.rate = 1.0;
  utterance.pitch = 1.1;
  
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}
