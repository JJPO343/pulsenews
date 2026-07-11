/**
 * Servidor Serverless para Vercel
 * Transforma un texto de resumen de noticias en un archivo de audio de alta definición utilizando la voz sintética de Gemini.
 */

export default async function handler(req, res) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Falta configurar la llave GEMINI_API_KEY." });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Método no permitido. Utilizar POST." });
    }

    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "No se proporcionó texto para la conversión de voz." });
    }

    try {
        // Solicitud al modelo especial de Audio/TTS de Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: `Di de forma profesional, fluida y con buen ritmo de locutor: ${text}` }]
                }],
                generationConfig: {
                    responseModalities: ["AUDIO"],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                // Seleccionamos "Kore", una voz neutra, profesional y con excelente entonación en español
                                voiceName: "Kore" 
                            }
                        }
                    }
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Error en TTS Gemini: ${errText}`);
        }

        const data = await response.json();
        
        // El modelo devuelve un archivo de audio PCM de 16 bits sin cabecera (mimetype audio/L16)
        const inlineData = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        
        if (!inlineData || !inlineData.data) {
            throw new Error("No se devolvieron datos de audio.");
        }

        // Convertimos el audio crudo Base64 de Gemini en un buffer
        const rawPcmBuffer = Buffer.from(inlineData.data, 'base64');
        
        // Para que cualquier navegador de celular lo reproduzca sin problemas, le agregamos una cabecera WAV estándar
        const sampleRate = 24000; // Frecuencia por defecto de Gemini TTS
        const wavHeader = createWavHeader(rawPcmBuffer.length, sampleRate);
        const playableWavBuffer = Buffer.concat([wavHeader, rawPcmBuffer]);

        // Devolvemos el archivo final de música/audio al navegador
        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Content-Length', playableWavBuffer.length);
        return res.status(200).send(playableWavBuffer);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

/**
 * Función auxiliar para generar un encabezado WAV válido para que el audio se reproduzca en iOS y Android
 */
function createWavHeader(pcmLength, sampleRate) {
    const header = Buffer.alloc(44);
    
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + pcmLength, 4); // Tamaño del archivo completo menos 8 bytes
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Tamaño del bloque fmt (16 para PCM)
    header.writeUInt16LE(1, 20);  // Formato de audio (1 para PCM lineal)
    header.writeUInt16LE(1, 22);  // Canales (1 para Mono)
    header.writeUInt32LE(sampleRate, 24); // Frecuencia de muestreo
    header.writeUInt32LE(sampleRate * 2, 28); // Tasa de bytes (sampleRate * canales * bytesPorMuestra)
    header.writeUInt16LE(2, 32);  // Alineación de bloques (canales * bytesPorMuestra)
    header.writeUInt16LE(16, 34); // Bits por muestra (16 bits)
    header.write('data', 36);
    header.writeUInt32LE(pcmLength, 40); // Tamaño de la sección de datos puros
    
    return header;
}
