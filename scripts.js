/**DOM */
const cardContiner = document.getElementById("cardContiner");
const templateCard = document.getElementById("card-template").content;
const fragment = document.createDocumentFragment();
const btnCrear = document.getElementById("open-modal");
const crearTask = document.getElementById("modal-overlay");
/**Variables */
let token = "";
let user;
let tasks;
let taskSelected;

/**FRONTEND */

const removeTasks = () => {
  let cards = document.getElementsByClassName("card-wrapper");
  console.log(cards.length);
  for (let i = 0; i < cards.length; i++) {
    console.log(cards[i]);
    cards[i].remove();
    i = -1;
  }
};
function createTaskBtn() {
  const txtName = document.getElementById("fname").value;
  const txtDescrip = document.getElementById("fdescrp").value;
  createTasks(txtName, txtDescrip);
  crearTask.style.display = "none";
}
function closeModalNewTask() {
  crearTask.style.display = "none";
}

btnCrear.addEventListener("click", () => {
  crearTask.style.display = "flex";
});

cardContiner.addEventListener("click", (e) => {
  let id = e.target.dataset.id;
  if (id && e.target.innerText === "Eliminar") {
    deleteTasks(id);
  } else if (id && e.target.innerText === "Actualizar") {
    this.taskSelected =  this.tasks.filter
  }
});
const createCards = (data) => {
  data.forEach((task) => {
    templateCard.querySelector("h2").textContent = task.name;
    templateCard.querySelector("p").textContent = task.description;
    templateCard.querySelector(".btn-update").dataset.id = task.id;
    templateCard.querySelector(".btn-delete").dataset.id = task.id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });

  cardContiner.appendChild(fragment);
};

/**BACKEND */

/**POST
 * Get token
 */
const login = async () => {
  const res = fetch("https://tasks-crud.academlo.com/api/auth/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: "erik@academlo.com",
      password: "secret",
    }),
  });

  res
    .then(async (result) => {
      await result.text().then((tok) => {
        this.token = tok;
        console.log(this.token);
        getAuthenticatedUser();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**GET
 * Authenticated Usuario */
const getAuthenticatedUser = async () => {
  const res = fetch("https://tasks-crud.academlo.com/api/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    },
  });

  res
    .then(async (result) => {
      await result.text().then((user) => {
        console.log(user);
        getTasks();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**CRUD */

/**GET */
const getTasks = async () => {
  const res = fetch("https://tasks-crud.academlo.com/api/tasks", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    },
  });

  res
    .then(async (result) => {
      await result.text().then((tasks) => {
        this.tasks = JSON.parse(tasks);
        removeTasks();
        createCards(this.tasks);
        console.log(this.tasks);
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**POST */
const createTasks = async (name, descrp) => {
  const res = fetch("https://tasks-crud.academlo.com/api/tasks", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    },
    body: new URLSearchParams({
      name: name,
      description: descrp,
    }),
  });
  res
    .then(async (result) => {
      await result.text().then((newTask) => {
        console.log(newTask);
        getTasks();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**POST */
const changeStatusTasks = async (id = 0, status = 0) => {
  const res = fetch(
    `https://tasks-crud.academlo.com/api/tasks/${id}/status/${status}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
      },
    }
  );
  res
    .then(async (result) => {
      await result.text().then((newTask) => {
        console.log(newTask);
        getTasks();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**DELETE */
const deleteTasks = async (id = 0) => {
  const res = fetch(`https://tasks-crud.academlo.com/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
    },
  });
  res
    .then(async (result) => {
      await result.text().then(() => {
        getTasks();
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

login();
