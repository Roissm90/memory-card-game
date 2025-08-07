import wave
import math
import struct

def generate_tone(filename, frequency=440, duration_ms=300, volume=0.5, sample_rate=44100):
    n_samples = int(sample_rate * duration_ms / 1000)
    amplitude = int(32767 * volume)

    wav_file = wave.open(filename, "w")
    wav_file.setparams((1, 2, sample_rate, n_samples, "NONE", "not compressed"))

    for i in range(n_samples):
        t = float(i) / sample_rate
        # Suavizamos con un pequeño fade in y fade out para que no sea tan brusco
        fade_in = min(1, i / (sample_rate * 0.05))  # 50ms fade in
        fade_out = min(1, (n_samples - i) / (sample_rate * 0.05))  # 50ms fade out
        envelope = fade_in * fade_out
        sample = amplitude * envelope * math.sin(2 * math.pi * frequency * t)
        wav_file.writeframes(struct.pack('h', int(sample)))

    wav_file.close()
    print(f"Archivo creado: {filename}")

# Sonido de fallo, tono suave descendente (tipo “beep” calmado)
generate_tone("sounds/fail.wav", frequency=400, duration_ms=500, volume=0.3)

# Sonido de acierto, tipo campanitas con varias frecuencias ascendentes
def generate_match_bell(filename):
    sample_rate = 44100
    duration_ms = 600
    n_samples = int(sample_rate * duration_ms / 1000)
    amplitude = int(32767 * 0.5)
    
    base_freq = 660  # frecuencia base tipo campana (aprox Mi5)
    overtone_ratio = 2.0  # segundo armónico (una octava arriba)
    
    wav_file = wave.open(filename, "w")
    wav_file.setparams((1, 2, sample_rate, n_samples, "NONE", "not compressed"))
    
    for i in range(n_samples):
        t = float(i) / sample_rate
        
        # Envolvente rápida: ataque rápido y decaimiento exponencial
        attack = min(1, i / (sample_rate * 0.01))       # 10ms ataque rápido
        decay = math.exp(-3 * t)                        # decaimiento exponencial
        envelope = attack * decay
        
        # Onda sumando fundamental + armónico para sonido campana
        fundamental = math.sin(2 * math.pi * base_freq * t)
        overtone = 0.5 * math.sin(2 * math.pi * base_freq * overtone_ratio * t)
        
        sample = amplitude * envelope * (fundamental + overtone)
        
        # Normalizamos para que no sobrepase el rango
        sample = max(min(sample, 32767), -32768)
        
        wav_file.writeframes(struct.pack('h', int(sample)))
    
    wav_file.close()
    print(f"Archivo creado: {filename}")

# Generar el sonido de match tipo campana
generate_match_bell("sounds/match.wav")
