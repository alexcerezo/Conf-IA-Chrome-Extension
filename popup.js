// popup.js
chrome.runtime.sendMessage({action: "copyText"}, function(response) {
  if (response) {
    document.getElementById('texto').textContent = response.texto;

    chrome.runtime.sendMessage({action: "getCompletion", texto: response.texto}, function(completionResponse) {
      console.log(completionResponse);
      const completionText = completionResponse.message.choices[0].message.content;
      document.querySelector("#output").innerHTML = completionText;

      // Convierte la respuesta a minúsculas y verifica si contiene "falso" o "falsa"
      if (completionText.toLowerCase().includes('falso') || completionText.toLowerCase().includes('falsa')) {
        // Cambia las variables CSS si la respuesta contiene "falso" o "falsa"
        document.documentElement.style.setProperty('--start-color', 'rgb(36, 0, 0)');
        document.documentElement.style.setProperty('--end-color', 'rgb(97, 14, 14)');
      }

      if (completionText.toLowerCase().includes('verdadero') || completionText.toLowerCase().includes('verdadera') || completionText.toLowerCase().includes('verdad')) {
        // Cambia las variables CSS si la respuesta contiene "falso" o "falsa"
        document.documentElement.style.setProperty('--start-color', 'rgb(2, 36, 0)');
        document.documentElement.style.setProperty('--end-color', 'rgb(28, 97, 14)');
      }

    });
  } else {
    console.error('No se recibió ninguna respuesta de background.js');
  }
});

document.querySelector('h1 a').addEventListener('click', function(e) {
  e.preventDefault();
  chrome.tabs.create({url: this.href});
});