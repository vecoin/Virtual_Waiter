(function () {
    const OPENAI_API_KEY = "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";  // Replace with your actual OpenAI API key
    const ASSISTANT_ID = "asst_GoUA2iVIVKi2xUCEvf9Lrjko";  // Virtual Weiter assistant ID
    const CHATBOT_NAME = "Virtual Waiter";
    const AVATAR_URL = "https://vecoin.github.io/jshosting/logo_v3_blickbot.jpg";

    // Create chat UI elements
    let chatBubble = document.createElement("div");
    chatBubble.id = "chatbot-bubble";
    chatBubble.innerHTML = "💬";
    document.body.appendChild(chatBubble);

    let chatContainer = document.createElement("div");
    chatContainer.id = "chatbot-container";
    chatContainer.style.display = "none";
    document.body.appendChild(chatContainer);

    let chatHeader = document.createElement("div");
    chatHeader.id = "chatbot-header";
    chatHeader.innerHTML = `
        <img src="${AVATAR_URL}" id="chatbot-avatar">
        <span>${CHATBOT_NAME}</span>
        <button id="close-chatbot">✖</button>
    `;
    chatContainer.appendChild(chatHeader);

    let chatArea = document.createElement("div");
    chatArea.id = "chatbot-area";
    chatContainer.appendChild(chatArea);

    let inputWrapper = document.createElement("div");
    inputWrapper.id = "chatbot-input-wrapper";

    let inputField = document.createElement("input");
    inputField.id = "chatbot-input";
    inputField.type = "text";
    inputField.placeholder = "Type a message...";

    inputWrapper.appendChild(inputField);
    chatContainer.appendChild(inputWrapper);

    // Apply styles
    let style = document.createElement("style");
    style.innerHTML = `
        #chatbot-bubble {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: blue;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        #chatbot-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 320px;
            height: 450px;
            background: white;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        #chatbot-header {
            display: flex;
            align-items: center;
            padding: 10px;
            background: #0078ff;
            color: white;
            font-weight: bold;
            font-size: 16px;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            justify-content: space-between;
        }
        #chatbot-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
        }
        #close-chatbot {
            background: transparent;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }
        #chatbot-area {
            flex-grow: 1;
            overflow-y: auto;
            padding: 10px;
            background: #f9f9f9;
            display: flex;
            flex-direction: column;
            height: 100%;
            max-height: 350px;
        }
        .chat-message {
            padding: 8px;
            margin: 5px;
            border-radius: 5px;
            max-width: 80%;
            word-wrap: break-word;
        }
        .chat-message.user {
            background: #0078ff;
            color: white;
            align-self: flex-end;
        }
        .chat-message.bot {
            background: #e1ecff;
            color: black;
            align-self: flex-start;
        }
        #chatbot-input-wrapper {
            background: white;
            padding: 10px;
            display: flex;
            position: sticky;
            bottom: 0;
            width: 100%;
            box-sizing: border-box;
            border-top: 1px solid #ddd;
        }
        #chatbot-input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            outline: none;
        }
    `;
    document.head.appendChild(style);

    // Toggle chatbot visibility
    chatBubble.addEventListener("click", function () {
        chatContainer.style.display = "flex";
        inputField.focus();
    });

    document.getElementById('close-chatbot').addEventListener("click", function () {
        chatContainer.style.display = "none";
    });

    // Handle user input
    inputField.addEventListener("keypress", async function (event) {
        if (event.key === "Enter") {
            let message = inputField.value.trim();
            if (!message) return;
            inputField.value = "";

            addMessage("user", message);
            scrollToBottom();

            let botResponse = await queryVirtualWeiter(message);
            addMessage("bot", botResponse);
            scrollToBottom();
        }
    });

    // Function to add messages to chat area
    function addMessage(sender, message) {
        let messageDiv = document.createElement("div");
        messageDiv.className = "chat-message " + sender;
        messageDiv.textContent = message;
        chatArea.appendChild(messageDiv);
        scrollToBottom();
    }

    // Scroll to latest message
    function scrollToBottom() {
        setTimeout(() => {
            chatArea.scrollTop = chatArea.scrollHeight;
        }, 100);
    }

    // Function to send message to OpenAI Assistant
    // Function to send message to OpenAI Assistant
    async function queryVirtualWeiter(question) {
        try {
            // Add "Waiter Writing" message to indicate processing
            let waitingMessage = document.createElement("div");
            waitingMessage.className = "chat-message bot";
            waitingMessage.textContent = "Waiter Writing...";
            chatArea.appendChild(waitingMessage);
            scrollToBottom();

            // 1️⃣ Create a thread
            let threadResponse = await fetch("https://api.openai.com/v1/threads", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",  // ✅ REQUIRED HEADER
                    "Content-Type": "application/json"
                }
            });

            let threadData = await threadResponse.json();
            if (threadData.error) {
                console.error("❌ OpenAI API Error:", threadData.error);
                waitingMessage.textContent = `Error: ${threadData.error.message}`;
                return;
            }

            let threadId = threadData.id;

            // 2️⃣ Send message to the thread
            let messageResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",  // ✅ REQUIRED HEADER
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    role: "user",
                    content: question
                })
            });

            let messageData = await messageResponse.json();
            if (messageData.error) {
                console.error("❌ Message Error:", messageData.error);
                waitingMessage.textContent = `Error: ${messageData.error.message}`;
                return;
            }

            // 3️⃣ Start the assistant run
            let runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2",  // ✅ REQUIRED HEADER
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ assistant_id: ASSISTANT_ID })
            });

            let runData = await runResponse.json();
            if (runData.error) {
                console.error("❌ Run Error:", runData.error);
                waitingMessage.textContent = `Error: ${runData.error.message}`;
                return;
            }

            let runId = runData.id;
            let status = runData.status;

            // 4️⃣ Wait for the run to complete
            while (status !== "completed") {
                await new Promise(resolve => setTimeout(resolve, 2000));

                let checkRun = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                    headers: {
                        "Authorization": `Bearer ${OPENAI_API_KEY}`,
                        "OpenAI-Beta": "assistants=v2"
                    }
                });

                let runStatus = await checkRun.json();
                status = runStatus.status;

                if (runStatus.error) {
                    console.error("❌ Error during assistant run:", runStatus.error);
                    waitingMessage.textContent = `Error: ${runStatus.error.message}`;
                    return;
                }
            }

            // 5️⃣ Retrieve the assistant's response
            let messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2"
                }
            });

            let messagesData = await messagesResponse.json();
            if (messagesData.error) {
                console.error("❌ No response received:", messagesData.error);
                waitingMessage.textContent = `Error: ${messagesData.error.message}`;
                return;
            }

            let assistantResponse = messagesData.data[0].content[0].text.value;

            // Update "Waiter Writing..." message with the actual response
            waitingMessage.textContent = assistantResponse;
            scrollToBottom();
        } catch (error) {
            console.error("❌ API Connection Error:", error);
            waitingMessage.textContent = "Error: Unable to connect.";
        }
    }





})();


