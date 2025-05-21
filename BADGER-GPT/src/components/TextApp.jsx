import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';

import TextAppMessageList from './TextAppMessageList';
import Constants from '../constants/Constants';

const MESSAGES_KEY = "cs571-badgerchat-messages";

function TextApp( {persona}) {
    

    // Set to true to block the user from sending another message
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const inputRef = useRef();

    useEffect(() => {
        const saved = localStorage.getItem(MESSAGES_KEY);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else if (persona) {
          const initial = [
            { role: Constants.Roles.Developer, content: persona.prompt },
            { role: Constants.Roles.Assistant, content: persona.initialMessage }
          ];
          setMessages(initial);
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(initial));
        }
      }, [persona]);


    /**
     * Called when the TextApp initially mounts.
     */
    async function handleWelcome() {
        if (messages.length === 0) {
            addMessage(Constants.Roles.Developer, persona.prompt);
            addMessage(Constants.Roles.Assistant, persona.initialMessage);
        }
    }
    
    async function handleSendAsStream(e) {
        e?.preventDefault();
        const input = inputRef.current.value?.trim();

        if (!input) return;

        inputRef.current.value = "";
        addMessage(Constants.Roles.User, input);
        setIsLoading(true);

        console.log("sending:", JSON.stringify([
          ...messages,
          { role: Constants.Roles.User, content: input }
        ]));

        try {
            const resp = await fetch("https://cs571api.cs.wisc.edu/rest/s25/hw11/completions-stream", {
              method: "POST",
              headers: {
                "X-CS571-ID": "-", // removed my id due to security issue
                "Content-Type": "application/json"
              },
              body: JSON.stringify([
                ...messages,
                { role: Constants.Roles.User, content: input }
              ])
            });
      
            const reader = resp.body.getReader();
            const decoder = new TextDecoder("utf-8");
      
            let buffer = "";
            let complete = "";
            let idx;
            setMessages(prev => {
            const next = [...prev, { role: Constants.Roles.Assistant, content: "" }];
            idx = next.length - 1;
            return next;
            });
      
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              const chunk = decoder.decode(value, { stream: true });
              const lines = chunk.split("\n").filter(l => l.trim());
      
              for (const line of lines) {
                try {
                  const parsed = JSON.parse(buffer + line);
                  buffer = "";
                  complete += parsed.delta;
                  setMessages(prev => {
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], content: complete };
                    return updated;
                  });
                } catch (e) {
                  buffer += line;
                }
              }
            }
          } catch (err) {
            console.error("Streaming failed:", err);
            addMessage(Constants.Roles.Assistant, "Something went wrong!");
          } finally {
            setIsLoading(false);
          }
        }
      

            
    /**
     * Adds a message to the ongoing TextAppMessageList
     * 
     * @param {string} role The role of the message; either "user", "assistant", or "developer"
     * @param {*} content The content of the message
     */
    function addMessage(role, content) {
        setMessages(prev => {
          const updated = [...prev, { role, content }];
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
          return updated;
        });
      }

    return (
        <div className="app">
            <TextAppMessageList messages={messages}/>
            {isLoading ? <BeatLoader color="#36d7b7"/> : <></>}
            <div className="input-area">
                <Form className="inline-form" onSubmit={handleSendAsStream}>
                    <Form.Control
                        ref={inputRef}
                        style={{ marginRight: "0.5rem", display: "flex" }}
                        placeholder="Type a message..."
                        aria-label='Type and submit to send a message.'
                        name = "userInput"
                        id = "userInput"
                    />
                    <Button type='submit' disabled={isLoading}>Send</Button>
                </Form>
            </div>
        </div>
    );
}

export default TextApp;
