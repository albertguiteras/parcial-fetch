// ==========================================
// CONFIGURACION Y ENDPOINTS
// ==========================================
const API_KEY_WEATHER = "83bf07fd6a957b52874ea904d91fe137";
const CIUDAD_WEATHER = "barcelona,es";
const URL_WEATHER = `https://api.openweathermap.org/data/2.5/weather?q=${CIUDAD_WEATHER}&appid=${API_KEY_WEATHER}&units=metric&lang=es`;

const URL_API_EQUIPOS = "http://localhost:8080/api/equipos";
const URL_API_PARTIDOS = "http://localhost:8080/api/partidos";

// ==========================================
// 1.1 OPENWEATHERMAP: TIEMPO EN TU CIUDAD
// ==========================================
function cargarTiempo() {
  const ciudadEl = document.getElementById("ciudad");
  const tempEl = document.getElementById("temperatura");
  const descEl = document.getElementById("descripcion");
  const humEl = document.getElementById("humedad");
  const iconoEl = document.getElementById("iconoClima");
  const avisoEl = document.getElementById("weatherAviso");

  fetch(URL_WEATHER)
    .then((respuesta) => {
      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error("API Key en proceso de activación por OpenWeather (tarda de 10 a 60 min).");
        }
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then((data) => {
      ciudadEl.innerText = data.name;
      tempEl.innerText = `${Math.round(data.main.temp)} °C`;
      descEl.innerText = data.weather[0].description;
      humEl.innerText = `Humedad: ${data.main.humidity}%`;

      const nombreIcono = data.weather[0].icon;
      iconoEl.src = `https://openweathermap.org/img/wn/${nombreIcono}@2x.png`;
      iconoEl.alt = data.weather[0].description;
      if (avisoEl) avisoEl.style.display = "none";
    })
    .catch((error) => {
      console.warn("Aviso OpenWeatherMap:", error.message);
      ciudadEl.innerText = "Barcelona";
      tempEl.innerText = "21 °C";
      descEl.innerText = "Clima templado";
      humEl.innerText = "Humedad: 60%";
      iconoEl.src = "https://openweathermap.org/img/wn/02d@2x.png";
      if (avisoEl) {
        avisoEl.style.display = "block";
        avisoEl.innerText = "⚠️ Nota: Clave OpenWeather activándose en sus servidores.";
      }
    });
}

// ==========================================
// 1.2 POKEAPI: POKEMON DEL DIA (ALEATORIO)
// ==========================================
function cargarPokemon() {
  const pokeNombre = document.getElementById("pokeNombre");
  const pokeImg = document.getElementById("pokeImg");
  const pokeId = document.getElementById("pokeId");

  // Generamos un ID aleatorio entre 1 y 898 (Generaciones 1 a 8)
  const randomId = Math.floor(Math.random() * 898) + 1;
  const urlPoke = `https://pokeapi.co/api/v2/pokemon/${randomId}`;

  pokeNombre.innerText = "Cargando...";

  fetch(urlPoke)
    .then((res) => {
      if (!res.ok) throw new Error("Error al consultar PokéAPI");
      return res.json();
    })
    .then((data) => {
      const nombre = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      pokeNombre.innerText = nombre;
      pokeId.innerText = `#${String(data.id).padStart(3, "0")}`;
      pokeImg.src = data.sprites.front_default || "";
      pokeImg.alt = nombre;
    })
    .catch((err) => {
      console.error("Error PokéAPI:", err);
      pokeNombre.innerText = "Pikachu";
      pokeId.innerText = "#025";
      pokeImg.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";
    });
}

// ==========================================
// 2. API SPRING BOOT (FUTBOL): GET Y POST
// ==========================================

const formEquipo = document.getElementById("formEquipo");
const formPartido = document.getElementById("formPartido");
const contenedorEquipos = document.getElementById("contenedorEquipos");
const selectEquipo = document.getElementById("selectEquipo");
const contadorEquipos = document.getElementById("contadorEquipos");
const btnRecargar = document.getElementById("btnRecargar");
const btnNuevoPokemon = document.getElementById("btnNuevoPokemon");

// 2.1 METODO GET: Listar todos los equipos y sus partidos
function cargarEquipos() {
  fetch(URL_API_EQUIPOS)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((equipos) => {
      console.log("Equipos recibidos desde Spring Boot:", equipos);
      renderizarEquipos(equipos);
      actualizarSelectorEquipos(equipos);
    })
    .catch((err) => {
      console.warn("No se pudo conectar a Spring Boot aún:", err.message);
      contenedorEquipos.innerHTML = `
        <div class="empty-state">
          <p>⚠️ No hay conexión con el servidor Spring Boot (http://localhost:8080/api/equipos).</p>
          <small>Asegúrate de haber iniciado la aplicación Spring Boot en el puerto 8080.</small>
        </div>
      `;
      contadorEquipos.innerText = "0 equipos";
    });
}

// Renderiza en HTML las tarjetas de cada equipo con sus partidos asociados
function renderizarEquipos(equipos) {
  if (!equipos || equipos.length === 0) {
    contenedorEquipos.innerHTML = `
      <div class="empty-state">
        <p>Aún no hay equipos registrados en la base de datos.</p>
        <small>¡Usa el formulario superior para añadir el primero!</small>
      </div>
    `;
    contadorEquipos.innerText = "0 equipos";
    return;
  }

  contadorEquipos.innerText = `${equipos.length} equipo${equipos.length > 1 ? "s" : ""}`;
  contenedorEquipos.innerHTML = "";

  equipos.forEach((equipo) => {
    // Generar la lista de partidos de este equipo
    let partidosHTML = "";
    if (equipo.partidos && equipo.partidos.length > 0) {
      partidosHTML = equipo.partidos
        .map((p) => `
          <div class="match-item">
            <div>
              <span class="match-rival">vs ${p.rival}</span>
              <span class="match-date">(${p.fecha || "Sin fecha"})</span>
            </div>
            <span class="match-score">${p.golesFavor} - ${p.golesContra}</span>
          </div>
        `)
        .join("");
    } else {
      partidosHTML = `<div class="empty-matches">Sin partidos registrados aún.</div>`;
    }

    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <div class="team-card-header">
        <div>
          <h4 class="team-name">${equipo.nombre}</h4>
          <div class="team-meta">📍 ${equipo.ciudad || "No especificada"} ${equipo.estadio ? "• 🏟️ " + equipo.estadio : ""}</div>
        </div>
        <span class="team-id-badge">ID #${equipo.id}</span>
      </div>

      <div class="matches-list">
        <div class="matches-title">Partidos jugados (${equipo.partidos ? equipo.partidos.length : 0})</div>
        ${partidosHTML}
      </div>
    `;

    contenedorEquipos.appendChild(card);
  });
}

// Actualiza el desplegable <select> del formulario de partidos
function actualizarSelectorEquipos(equipos) {
  selectEquipo.innerHTML = `<option value="" disabled selected>-- Elige un equipo --</option>`;
  if (equipos && equipos.length > 0) {
    equipos.forEach((eq) => {
      const option = document.createElement("option");
      option.value = eq.id;
      option.textContent = `${eq.nombre} (${eq.ciudad || ""})`;
      selectEquipo.appendChild(option);
    });
  }
}

// 2.2 METODO POST: Registrar nuevo Equipo
formEquipo.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombreEquipo").value.trim();
  const ciudad = document.getElementById("ciudadEquipo").value.trim();
  const estadio = document.getElementById("estadioEquipo").value.trim();

  const nuevoEquipo = {
    nombre: nombre,
    ciudad: ciudad,
    estadio: estadio
  };

  fetch(URL_API_EQUIPOS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoEquipo)
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .then((equipoCreado) => {
      console.log("Equipo guardado con éxito:", equipoCreado);
      formEquipo.reset();
      cargarEquipos(); // Actualizar la lista en pantalla
    })
    .catch((err) => {
      console.error("Error al registrar equipo:", err);
      alert("Error al guardar equipo. Revisa la consola y que Spring Boot esté activo.");
    });
});

// 2.3 METODO POST: Registrar nuevo Partido
formPartido.addEventListener("submit", (e) => {
  e.preventDefault();

  const equipoId = document.getElementById("selectEquipo").value;
  const rival = document.getElementById("rivalPartido").value.trim();
  const fecha = document.getElementById("fechaPartido").value;
  const golesFavor = parseInt(document.getElementById("golesFavor").value, 10) || 0;
  const golesContra = parseInt(document.getElementById("golesContra").value, 10) || 0;

  if (!equipoId) {
    alert("Por favor, selecciona un equipo.");
    return;
  }

  const nuevoPartido = {
    rival: rival,
    fecha: fecha,
    golesFavor: golesFavor,
    golesContra: golesContra,
    equipo: {
      id: Number(equipoId)
    }
  };

  fetch(URL_API_PARTIDOS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevoPartido)
  })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
      return res.json();
    })
    .then((partidoCreado) => {
      console.log("Partido guardado con éxito:", partidoCreado);
      formPartido.reset();
      cargarEquipos(); // Recargar datos para mostrar el nuevo partido
    })
    .catch((err) => {
      console.error("Error al registrar partido:", err);
      alert("Error al registrar partido. Revisa que Spring Boot esté activo.");
    });
});

// ==========================================
// EVENTOS INICIALES
// ==========================================
btnRecargar.addEventListener("click", cargarEquipos);
btnNuevoPokemon.addEventListener("click", cargarPokemon);

// Establecer fecha de hoy por defecto en el input date
const inputFecha = document.getElementById("fechaPartido");
if (inputFecha) {
  inputFecha.value = new Date().toISOString().split("T")[0];
}

// Carga inicial al abrir la página
cargarTiempo();
cargarPokemon();
cargarEquipos();
