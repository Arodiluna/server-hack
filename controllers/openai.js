//Librerías.
require('dotenv').config();
const { response } = require("express");
const { getDB } = require("../database/database");
const openAI = require("openai");
const fs = require("fs");
const axios = require('axios');
const record = require('node-record-lpcm16');
const express = require('express');
const fetch = require('node-fetch');
const { chatGPTRequest } = require('./chatgpt');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


//Llamar api openAI.
const openai = new openAI({
    apiKey: process.env.API_OPENAI
});


 // Asegúrate de importar la función de chatGPT que definimos

const audioFun = async (req, res) => {
  try {
    // Llamar audio
    const { audio } = req.body;

    // Realizar transcripción de audio con Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream("aud3.mp3"),
      model: "whisper-1"
    });

    // Transcripción de audio
    const transcribedText = transcription.text;

    // Realizar una solicitud a ChatGPT utilizando la transcripción de audio como prompt
    const apiKey = process.env.API_OPENAI; // Reemplaza con tu clave de API de OpenAI
    const chatGPTResponse = await chatGPTRequest(apiKey, transcribedText);

    // Responder con la transcripción de ChatGPT
    res.status(201).json({
      success: true,
      solicitud: transcribedText ,
      mensaje: chatGPTResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error, hablar con un administrador."
    });
  }
}


/* 
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
*/

module.exports = {
    audioFun
}