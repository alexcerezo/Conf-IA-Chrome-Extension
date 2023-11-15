chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Mensaje recibido:', request);
  if (request.action === "copyText") {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        function: functionToGetSelectedText
      }, (results) => {
        if (results && results[0]) {
          console.log('Texto copiado:', results[0].result);
          sendResponse({texto: results[0].result});
        } else {
          console.error('No se pudo ejecutar el script');
        }
      });
    });
  }
  return true;  // Devuelve true para indicar que responderás de forma asíncrona
});

function functionToGetSelectedText() {
  return window.getSelection().toString();
}

// background.js
const API_KEY = "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";

async function getCompletion(texto) {
  const respuesta = await fetch(`https://api.openai.com/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      "messages": [
        { "role": "system",
          "content": "You are a information verifier."
        },
        {
          "role": "user",
          "content": "Verifica la siguiente afirmación: " + texto + ". Indica si es verdadera o falsa y adjunta una fuente de respaldo. No añadas ninguna explicación.",
        }
      ]
    }),
  });

  return respuesta.json();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "getCompletion") {
    getCompletion(request.texto).then(data => {
      sendResponse({ message: data });
    });
  }

  return true;  // Devuelve true para indicar que responderás de forma asíncrona
});