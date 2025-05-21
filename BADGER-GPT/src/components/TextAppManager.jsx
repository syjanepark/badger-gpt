import { useState } from "react";
import TextApp from "./TextApp";

import { Container, Dropdown, Nav, NavItem, NavLink } from "react-bootstrap";

export default function TextAppManager() {

    const [chatKey, setChatKey] = useState(0);

    const PERSONAS = [
        {
            name: "Bucky",
            prompt: "You are a helpful assistant named Bucky after the UW-Madison Mascot. Your goal is to help the user with whatever queries they have.",
            initialMessage: "Hello, my name is Bucky. How can I help you?"
        },
        {
            name: "Pirate Pete",
            prompt: "You are a helpful pirate assisting your mateys with their questions. Respond like a pirate would. Your goal is to help the user with whatever queries they have.",
            initialMessage: "Hello, my name is Pete the Pirate. How can I help you?"
        },
         {
            name: "James Charles",
            prompt: "You are James Charles, a beauty YouTuber known for energetic, upbeat, and bubbly speech. Greet users with 'Hi sisters!' and use lots of excitement, positivity, makeup references, and slang like 'sister slay', 'love that for you', 'sister snapped', etc. Keep it lively and super energetic!",
            initialMessage: "Hi sisters! 💖✨ It's James! How can I help you today? 🎨💅"
         }
    ];

    const [personaName, setPersonaName] = useState(() => {
        return localStorage.getItem("cs571-badgerchat-persona") || PERSONAS[0].name;
      });
    const persona = PERSONAS.find(p => p.name === personaName);

    function handleNewChat() {
        localStorage.removeItem("cs571-badgerchat-messages");
        setChatKey(k => k + 1); 
      }

    function handleSwitchPersona(selectedPersona) {
        setPersonaName(selectedPersona);
        localStorage.setItem("cs571-badgerchat-persona", selectedPersona);
        setChatKey(k => k + 1); 
        localStorage.removeItem("cs571-badgerchat-messages"); // reset history for new persona
      }

    return <Container style={{ marginTop: "0.25rem" }}>
        <Nav justify variant="tabs">
            <Nav.Item>
                <Nav.Link onClick={handleNewChat}>New Chat</Nav.Link>
            </Nav.Item>
            <Dropdown as={NavItem} onSelect={handleSwitchPersona}>
                <Dropdown.Toggle as={NavLink}>Personas</Dropdown.Toggle>
                <Dropdown.Menu >
                    {
                        PERSONAS.map(p => <Dropdown.Item key={p.name} eventKey={p.name} active={personaName === p.name}>{p.name}</Dropdown.Item>)
                    }
                </Dropdown.Menu>
            </Dropdown>
        </Nav>
        <TextApp key = {chatKey} persona={persona}/>
    </Container>
}