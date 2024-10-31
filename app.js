// ACCOUNT DATA
const account1 = {
  owner: "Anna Anderson",
  username: "aa",
  movements: [200, 450, -400.5, 3000, -650, -130, 70, 1300],
  pin: 1234,
};

const account2 = {
  owner: "Bijan Bell",
  username: "bb",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 1111,
};

const account3 = {
  owner: "Celeste Carter",
  username: "cc",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3123,
};

// Liste de tous les comptes
const accounts = [account1, account2, account3];

// ELEMENTS
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");

// Variable globale pour stocker le compte connecté
let currentAccount;

// Fonction pour vérifier l'identité de l'utilisateur lors de la connexion
const matchUser = (username, pin) => {
  const matchedAccount = accounts.find((acc) => username === acc.username);
  if (matchedAccount && matchedAccount.pin === pin) {
    return matchedAccount;
  } else {
    throw new Error("Couldn't match user");
  }
};

// Fonction pour vérifier l'identité du destinataire lors d'un transfert
const matchTransfer = (currentAccountUsername, recieverUsername) => {
  const matchedAccount = accounts.find(
    (acc) => recieverUsername === acc.username
  );
  if (currentAccountUsername != recieverUsername && matchedAccount) {
    return matchedAccount;
  } else if (!matchedAccount) {
    throw new Error("This account doesn't exists");
  } else {
    throw new Error("Can't be sender and reciever at the same time");
  }
};

// Fonction d'affichage de messages de succès ou d'erreur
const message = (text, error) => {
  labelWelcome.textContent = text;
  error
    ? (labelWelcome.style.color = "var(--withdrawal)")
    : (labelWelcome.style.color = "var(--deposit)");
};

// Fonction d'affichage du compte connecté
const displayAccount = (acc) => {
  if (acc) {
    inputTransferTo.value = "";
    inputTransferAmount.value = "";
    console.log(acc.movements); // Affiche les transactions dans la console
    displayFortune(currentAccount);
    displayMovments(currentAccount);
    containerApp.style.opacity = "100";
  } else {
    throw new Error("No account to display");
  }
};

// Fonction d'affichage du solde, des entrées et des sorties du compte
const displayFortune = (acc) => {
  // Montant disponible
  let balance = acc.movements.reduce((accum, el) => (accum += el));
  labelBalance.textContent = `CHF ${balance}`;

  // Total des entrées
  let sumIn = acc.movements
    .filter((el) => el > 0)
    .reduce((accum, el) => accum + el, 0);
  labelSumIn.textContent = `CHF ${sumIn}`;

  // Total des sorties
  let sumOut = acc.movements
    .filter((el) => el < 0)
    .reduce((accum, el) => accum + el, 0);
  labelSumOut.textContent = `CHF ${sumOut}`;
};

// Fonction d'affichage des transactions du compte
const displayMovments = (account) => {
  containerMovements.replaceChildren();
  if (account) { 
    account.movements.forEach((movment, index) => {
       let type = (movment<0) ? "withdrawal" : "deposit";     
       let html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
            <div class="movements__value">CHF ${movment}</div>
        </div>
        `;
      containerMovements.insertAdjacentHTML("afterbegin", html);
    });
  } else {
    throw new Error("No transactions in this account");
  }
};

// Fonction de transfert d'argent vers un autre compte
const transfer = (currentAccount, recieverUsername, amount) => {
  const balance = currentAccount.movements.reduce((accum, movment) => (accum += movment),0);
  let reciever = accounts.find((account) => account.username === recieverUsername);

  // Vérification des paramètres entrés pour le transfert
  if (
    matchTransfer(currentAccount.username, recieverUsername) &&
    amount <= balance
  ) {
    // Vérifie si le montant est valide (non nul et positif)
    if (amount && amount > 0) {
      try {
        // On débite le compte courant
        currentAccount.movements.push(-amount);
        // On crédite le compte receveur
        reciever.movements.push(amount);
        // Mise à jour des données et message de succès
        displayAccount(currentAccount);
        message(`Succes : ${amount} CHF envoyé à ${reciever.owner}`);
      } catch (error) {
        throw new Error("Couldn't transfer");
      }
    } else {
      throw new Error("Failed due to amount error, please verify your entry");
    }
  } else {
    throw new Error("Transfer failed, not enough funds");
  }
};

// Événement de connexion de l'utilisateur
btnLogin.addEventListener("click", function (e) {
  try {
    e.preventDefault();
    currentAccount = matchUser(inputLoginUsername.value, +inputLoginPin.value);
    displayAccount(currentAccount);
    message(`Welcome ${currentAccount.owner}`);
  } catch (err) {
    message(err.message, true);
  }
});

// Événement pour transférer de l'argent
btnTransfer.addEventListener("click", function (e) {
  try {
    e.preventDefault();
    transfer(currentAccount, inputTransferTo.value, +inputTransferAmount.value);
  } catch (err) {
    message(err.message, true);
  }
});
