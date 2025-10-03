# BadgerChatGPT

Author: syjanepark
Course: CS571 Spring 2025
Assignment: HW11 – BadgerChatGPT
Tech Stack: React, Vite, Bootstrap, OpenAI GPT-4o mini (via CS571 API)

## Overview
BadgerChatGPT is an interactive generative AI chat app where users can talk to AI personas in real time. The app supports multiple AI personalities (or "personas") and remembers conversations between sessions using localStorage.

Built using modern React and Bootstrap, this project demonstrates prompt engineering, streaming AI response handling, and frontend UX persistence techniques.

## Setup & Run

1. Clone the repo
2. Install dependencies
3. Start the development server
4. Open your browser to http://localhost:5173 (do not open index.html directly!).


### Features

✅ Real-Time Conversation
Messages stream token-by-token using fetch(...completions-stream) with ReadableStream.

Implements assistant replies in real time while maintaining UX feedback (BeatLoader spinner).

✅ AI Personas
Each persona has a unique prompt and initialMessage.

Switching personas resets the conversation and loads a new intro message.

You can add custom personas via PERSONAS.js.

✅ Your Custom Persona: 🦝 Rick the Raccoon
Speaks in riddles and rhymes like a mischievous forest dweller.
{
  name: "Rick the Raccoon",
  description: "A riddle-loving raccoon who answers in rhymes.",
  prompt: "You are Rick the Raccoon, a clever animal who responds only in rhyming riddles.",
  initialMessage: "Hey there, forest friend! What mystery shall we bend?"
}
✅ Persistent Chat History
Messages and selected persona are saved to localStorage.
Reloading the page restores the previous session.


### Known Limitations

Does not handle 429 (rate limit) or 413 (context too long) errors — per assignment instructions.

No server-side history persistence (local only).

