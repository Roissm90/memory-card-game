import wave
import math
import struct

def generate_tone(filename, frequency=440, duration_ms=300, volume=0.5, sample_rate=44100):
    n_samples = int(sample_rate * duration_ms / 1000)
    amplitude = 32767 * volume

    wav_file = wave.open(filename, "w")
    wav_file.setparams((1, 2, sample_rate, n_samples, "NONE", "not compressed"))

    for i in range(n_samples):
        t = float(i) / sample_rate
        sample = amplitude * math.sin(2 * math.pi * frequency * t)
        wav_file.writeframes(struct.pack('h', int(sample)))

    wav_file.close()
    print(f"Archivo creado: {filename}")

# Crear sonido de fallo (tono más bajo, volumen suave)
generate_tone("sounds/fail.wav", frequency=300, duration_ms=400, volume=0.3)

# Crear sonido de acierto (tono más alto, duración corta)
generate_tone("sounds/match.wav", frequency=600, duration_ms=200, volume=0.5)
