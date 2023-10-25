//Librerías.
require('dotenv').config();
const { response } = require("express");
const { getDB } = require("../database/database");
const { openAI } = require("openai")
const { fs } = require("fs")

//Llamar api openAI.
const openai = new openAI({
    apiKey: process.env.API_OPENAI
});

const audioFun = async (req, res) => {
    try {

        //Llamar audio.
        const { audio } = req.body;

        //Transcripción de audio.
        const transcription = await openai.audio.transcriptions.create({
            file:fs.createReadStream("aud1.mp3"),
            model:"whisper-1"
        });

        //Mensaje transcribido.
        res.status(201).json({
            of: true,
            mensaje: transcription
        });

        //Error.
    } catch (error) {
        res.status(500).json({
            of: false,
            mensaje: "Error, hablar con un administrador."
        });
    }
}



module.exports = {
    audioFun
}