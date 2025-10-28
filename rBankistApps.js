export const BankistAppRecipe = {
  Inputs: [
    {
      ComponentName: "TextInput",
      directives: {
        type: "text",
        class: "login-input login-input-user",
        placeholder: "Username",
      },
      display: { text: "Username:" },
      key: "loginUsername",
    },
    {
      ComponentName: "TextInput",
      directives: {
        type: "password",
        class: "login-input login-input-pin",
        placeholder: "PIN",
      },
      display: { text: "PIN:" },
      key: "loginPin",
    },
  ],
  Buttons: [
    {
      ComponentName: "CommonButtons",
      directives: {
        type: "button",
        class: "login-btn",
      },
      display: { text: "→" },
      on: { action: "login" },
    },
  ],
};

export const accounts = [
  {
    owner: "Jonas Schmedtmann",
    username: "js",
    pin: 1111,
    movements: [5000, -150, 3000, -1000, 15000],
    movementDates: [
      "2025-10-25T21:31:17.178Z",
      "2025-10-26T07:42:02.383Z",
      "2025-10-27T09:15:04.904Z",
      "2025-10-27T10:17:24.185Z",
      "2025-10-28T14:11:59.604Z",
    ],
  },
  {
    owner: "Jessica Davis",
    username: "jd",
    pin: 2222,
    movements: [2000, -500, 3400, -1200, 6000],
    movementDates: [
      "2025-10-23T13:15:33.035Z",
      "2025-10-24T09:48:16.867Z",
      "2025-10-25T06:04:23.907Z",
      "2025-10-26T14:18:46.235Z",
      "2025-10-27T16:33:06.386Z",
    ],
  },
]