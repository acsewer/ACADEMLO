/**DOM */
const cardContiner = document.getElementById("cardContiner");
const templateCard = document.getElementById("card-template").content;
const fragment = document.createDocumentFragment();
const btnCrear = document.getElementById("open-modal");
const crearTask = document.getElementById("modal-overlay");
const buscarField = document.getElementById("buscarId");
const exitModal = document.getElementById("exitModal");

/**Variables */
let token = "";
let user;
let tasks;
let taskSelected;
let crearNuevaTarea = true;

/**FRONTEND */

exitModal.addEventListener("click", () => {
  this.crearNuevaTarea = true;
  crearTask.style.display = "none";
  document.getElementById("crearBtnId").value = "Crear";
});

buscarField.addEventListener("change", (e) => {
  getTasksID(e.target.value);
});

const removeTasks = () => {
  let cards = document.getElementsByClassName("card-wrapper");

  for (let i = 0; i < cards.length; i++) {
    cards[i].remove();
    i = -1;
  }
};
function createTaskBtn() {
  const txtName = document.getElementById("fname").value;
  const txtDescrip = document.getElementById("fdescrp").value;

  if (this.crearNuevaTarea) {
    createTasks(txtName, txtDescrip);
    this.crearNuevaTarea = true;
    document.getElementById("crearBtnId").value = "Crear";
  } else {
    updateTasks(this.taskSelected.id, txtName, txtDescrip);
    this.crearNuevaTarea = true;
    document.getElementById("crearBtnId").value = "Crear";
  }
  crearTask.style.display = "none";
}
function closeModalNewTask() {
  this.crearNuevaTarea = true;
  crearTask.style.display = "none";
  document.getElementById("crearBtnId").value = "Crear";
}

btnCrear.addEventListener("click", () => {
  document.getElementById("fname").value = "";
  document.getElementById("fdescrp").value = "";

  this.crearNuevaTarea = true;
  crearTask.style.display = "flex";
  document.getElementById("crearBtnId").value = "Crear";
});

cardContiner.addEventListener("click", (e) => {
  let id = e.target.dataset.id;
  if (id && e.target.id === "Eliminar") {
    let opcion = confirm(`Seguro desea eliminar la tarea con id ${id}`);
    if (opcion == true) {
      deleteTasks(id);
    }
  } else if (id && e.target.id === "Actualizar") {
    this.taskSelected = this.tasks.filter((e) => e.id == id)[0];
    crearTask.style.display = "flex";

    document.getElementById("fname").value = this.taskSelected.name;
    document.getElementById("fdescrp").value = this.taskSelected.description;
    document.getElementById("crearBtnId").value = "Actualizar";
    this.crearNuevaTarea = false;
  }
});

cardContiner.addEventListener("change", (e) => {
  let id = e.target.dataset.id;
  let state = e.target.value;
  changeStatusTasks(id, state);
});

const createCards = (data) => {
  const arrayEstados = ["barra", " barra barra-st-1", " barra barra-st-2", "barra barra-st-3"];
  const estados = ["", "Iniciado", "Pausa", "Terminado"]
  let indexEstado = 0;
  data.forEach((task) => {
    templateCard.querySelector("h2").textContent = task.name;
    templateCard.querySelector("p").textContent = task.description;
    templateCard.querySelector(".btn-update").dataset.id = task.id;
    templateCard.querySelector(".btn-delete").dataset.id = task.id;
    templateCard.querySelector(".estados").dataset.id = task.id;
 
    if (task.status_id >= 0 && task.status_id <= 3) {
      indexEstado = task.status_id;
    }

    if(!task.status_id){
      indexEstado = 0;
    }
    
    console.log(arrayEstados[indexEstado]);
    templateCard.querySelector("#barra").className = arrayEstados[indexEstado];
    templateCard.querySelector('#estado').innerText = estados[indexEstado];
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
        let usuario = JSON.parse(user)
        console.log(usuario)
        document.getElementById("txtLoginID").innerText = `Bienvenid@, ${usuario.name} (${usuario.email})`
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
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

/**GET */
const getTasksID = async (id = "") => {
  if (id != "") {
    const res = fetch(`https://tasks-crud.academlo.com/api/tasks/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/json",
      },
    });
    res
      .then(async (result) => {
        if (result.status == 200) {
          await result.text().then((tasks) => {
            if (tasks.length) {
              this.tasks = [];
              this.tasks.push(JSON.parse(tasks));

              removeTasks();
              createCards(this.tasks);
            } else {
              console.log(tasks);
            }
          });
        } else {
          getTasks();
          alert(`No se encontro ningun valor asociado al id: ${id} `);
          buscarField.value = "";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    getTasks();
  }
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

/**PUT */
const updateTasks = async (id = 0, name = "", descrp = "") => {
  const res = fetch(`https://tasks-crud.academlo.com/api/tasks/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
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

login();
