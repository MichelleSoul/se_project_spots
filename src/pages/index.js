import {
  enableValidation,
  resetValidation,
  disableButton,
  settings,
} from "../scripts/validation";
import "./index.css";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "93873c14-dd20-4a3b-b60d-3b44647a81f6",
    "Content-Type": "application/json",
  },
});

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

api
  .getAppInfo()
  .then(([userInfo, cards]) => {
    profileName.textContent = userInfo.name;
    descriptionName.textContent = userInfo.about;
    avatarProfile.src = userInfo.avatar;

    cards.reverse().forEach((card) => {
      renderCard(card);
    });
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-button");
const cardModalBtn = document.querySelector(".profile__add-button");
const avatarProfile = document.querySelector(".profile__avatar");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const descriptionName = document.querySelector(".profile__description ");

const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["modal__form"];
const editSubmitBtn = editModal.querySelector(".modal__submit-btn");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input",
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteBtn = deleteModal.querySelector("#btn_delete");
const deleteCancelBtn = deleteModal.querySelector("#btn_delete_cancel");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  deleteBtn.textContent = "Deleting...";
  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      setTimeout(() => {
        deleteBtn.textContent = "Delete";
      }, 305);
    });
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function handleLike(evt, id) {
  const isLiked = evt.target.classList.contains("card__like-button_liked");
  api
    .handleLike(id, isLiked)
    .then((data) => {
      // console.log(data);
      evt.target.classList.toggle("card__like-button_liked", data.isLiked);
    })
    .catch(console.error);

  // 1. check whether card is currently liked or not
  //   const isLiked = ???
  // 2. call the  changeLikeStatus method, passing it the appropriate arguments
  // 3. handle the response (.then and .catch)
  // 4. in the .then, toggle active class
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardLikeBtn.classList.toggle("card__like-button_liked", data.isLiked);

  cardLikeBtn.addEventListener("click", (evt) => handleLike(evt, data._id));

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });

  cardDeleteButton.addEventListener("click", () => {
    handleDeleteCard(cardElement, data._id);
  });

  return cardElement;
}

function closeOverlay(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function handleEsc(evt) {
  if (evt.key === "Escape") {
    const openModal = document.querySelector(".modal_opened");
    if (openModal) {
      closeModal(openModal);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", handleEsc);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", closeOverlay);
  document.removeEventListener("keydown", handleEsc);
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  editSubmitBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      descriptionName.textContent = data.about;
      closeModal(editModal);
    })
    .finally(() => {
      setTimeout(() => {
        editSubmitBtn.textContent = "Save";
        disableButton(editSubmitBtn, settings);
      }, 305);
    })
    .catch(console.error);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  cardSubmitBtn.textContent = "Saving...";
  const inputValues = { name: cardNameInput.value, link: cardLinkInput.value };

  api
    .addNewCard(inputValues)
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsList.prepend(cardElement);
      evt.target.reset();
      closeModal(cardModal);
    })
    .finally(() => {
      setTimeout(() => {
        cardSubmitBtn.textContent = "Save";
        disableButton(cardSubmitBtn, settings);
      }, 305);
    })
    .catch(console.error);
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  avatarSubmitBtn.textContent = "Saving...";
  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      avatarProfile.src = data.avatar;
      closeModal(avatarModal);
    })
    .finally(() => {
      setTimeout(() => {
        avatarSubmitBtn.textContent = "Save";
        disableButton(avatarSubmitBtn, settings);
        avatarLinkInput.value = "";
      }, 305);
    })
    .catch(console.error);
}

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = descriptionName.textContent;
  resetValidation(
    editFormElement,
    [editModalNameInput, editModalDescriptionInput],
    settings,
  );
  openModal(editModal);
});

const previewCloseBtn = previewModal.querySelector(".modal__close-btn");

const closeButtons = document.querySelectorAll(".modal__close-btn");

closeButtons.forEach((button) => {
  const popup = button.closest(".modal");
  button.addEventListener("click", () => closeModal(popup));
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);

deleteForm.addEventListener("submit", handleDeleteSubmit);

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

enableValidation(settings);
