class Api {
  constructor(options) {
    // constructor body
  }

  getInitialCards() {
   return fetch("https://around-api.en.tripleten-services.com/v1/cards", {
     headers: {
       authorization: "93873c14-dd20-4a3b-b60d-3b44647a81f6"
     }
   })
     .then(res => {
       if (res.ok) {
         return res.json();
       }
     });
 }

  // other methods for working with the API
}

export default Api;