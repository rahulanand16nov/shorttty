const form = document.getElementById("linkform");
const result = document.getElementById("result");

    form.addEventListener('submit',(e)=>{
        e.preventDefault();
        let link = document.getElementById("link");
        fetch('/createURL', {
            method: 'POST',
            headers: {'Accept': 'application/json','Content-Type': 'application/json'},
            body: JSON.stringify({ogURL: link.value,})
        })
  .then(response => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then(data => {
      while (result.hasChildNodes()) {
        result.removeChild(result.lastChild);
      }
      result.insertAdjacentHTML('afterbegin', `
      <center>
      <div class="container__item container__item--bottom">
        <div class="result">
          <p><a target="_blank" class="short-url" rel="noopener" href="/${data[0].shortID}">
            ${location.origin}/${data[0].shortID}
          </a></p>
        </div>
    </div>
    </center>
      `)
    })
    .catch(console.error)
});