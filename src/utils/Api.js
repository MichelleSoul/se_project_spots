class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

    // TODO: Create another method, getUserInfo (different base url)

  getAppInfo() {
    // TODO: Call getUserInfo in this array
    return Promise.all([this.getInitialCards()])
  }

  getInitialCards() {
   return fetch(`${this._baseUrl}/cards`, {
     headers: this._headers,
   }).then((res) => {
       if (res.ok) {
         return res.json();
       }
       Promise.reject(`Error: ${res.status}`);
     });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        about,
      }),
    }).then((res) => {
       if (res.ok) {
         return res.json();
       }
       Promise.reject(`Error: ${res.status}`);
     });
  }

  editAvatarInfo(avatar) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        avatar
      }),
    }).then((res) => {
       if (res.ok) {
         return res.json();
       }
       Promise.reject(`Error: ${res.status}`);
     });
  }

}

export default Api;