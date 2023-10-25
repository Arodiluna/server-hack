//Audio a Texto


require('dotenv').config();
const { response } = require("express");
const { getDB } = require("../database/database");
const OpenAI=require("openai")
const fs=require("fs")
const openai=new OpenAI({
    apiKey: process.env.API_OPENAI
})

const audioFun = async (req, res) => {
    try {
        const { audio } = req.body;
        const transcription=await openai.audio.transcriptions.create({
            file:fs.createReadStream("aud1.mp3"),
            model:"whisper-1"
        })
        res.status(201).json({
            of: true,
            mensaje: transcription
        });
    } catch (error) {
        res.status(500).json({
            of: false,
            mensaje: "Hablar con un administrador, no se insertaron los datos en registro."
        });
    }
}



module.exports = {
    audioFun
}