
/* ACTUALIZAR SALDO / INGRESAR DEPOSITOS */

let actualizarSaldo = document.querySelector("#actualizarSaldo") //Valor insertado para que el usuario actualice su saldo
let botonActualizarSaldo = document.getElementById("botonActualizarSaldo") // Boton para iniciar la función que actualiza el saldo del usuario
let historialDepositos = [] //Arreglo para los registros y suma de depositos 
let saldoActual = document.querySelector("#saldoActual") //Elemento para mostrar el saldo actualizado del usuario


        /* Evento para ingresar depósitos */

botonActualizarSaldo.addEventListener("click", () => {
  let historial = {
    Cantidad: parseFloat(actualizarSaldo.value),
    Fecha: new Date().toLocaleString()
  }
  
  isNaN(historial.Cantidad) ? (Swal.fire({
    icon: "error",
    title: "Valor no válido",
    text: "Inserta una cantidad"
  }), (actualizarSaldo.value = ""),false) 
  :(
  (historialDepositos.push(historial)),
  
  (saldoActual.innerHTML = historialDepositos.reduce((suma, deposito) => suma + deposito.Cantidad, 0)),
  (sessionStorage.setItem("Saldo actual",saldoActual.innerHTML)),
  (actualizarSaldo.value = ""),
  Swal.fire({
    title: "Saldo actualizado",
    text: `Tu saldo es: $${historialDepositos.reduce((suma, deposito) => suma + deposito.Cantidad, 0)}`,
    icon: "success"
  })
  )
})


        /*Mostrar historial principal de depósitos */

let botonConsultarDepositos = document.querySelector("#botonConsultarDepositos") //Boton para iniciar función que muestraa historial de depósitos
let contenedorMostrarHistorialDepositos = document.getElementById("contenedorMostrarHistorialDepositos") //Contenedor para mostrar el historial de depósitos

botonConsultarDepositos.addEventListener("click", () => {
  
  contenedorMostrarHistorialDepositos.innerHTML = ""
  historialDepositos.forEach((deposito) => {
    contenedorMostrarHistorialDepositos.innerHTML += `Depósito / Retiro: $${deposito.Cantidad} <br> Fecha: ${deposito.Fecha} <br><br> `
  })
  botonOcultarHistorial.style.display = `block`
})


        /*Ocultar historial principal de depósitos */

let botonOcultarHistorial = document.getElementById("botonOcultarHistorial") // Boton para ocultar historial

botonOcultarHistorial.addEventListener("click", () => {
  contenedorMostrarHistorialDepositos.innerHTML = ""
  botonOcultarHistorial.style.display = `none`
})



/* CONSUMIENDO API DE DIVISAS */

let cantidadPesos = document.getElementById("cantidadPesos") // Cantidad en MXN para convertir a otra divisa
let botonDivisas = document.querySelector("#botonDivisas") //Botón para hacer la conversión de divisas
let divisasSelect = document.querySelector("#divisasSelect") //Divisa seleccionada por usuario
let conversionRealizada = document.getElementById("conversionRealizada") //Parrafo para mostrar el resultado de la conversión


        /* Conversión de pesos mexicanos a dolars ó euros */

botonDivisas.addEventListener("click", () => {

  let cantidad = parseInt(cantidadPesos.value)

  if (!isNaN(cantidad))
  {
    let divisa = divisasSelect.value
    let urlApi = `https://api.frankfurter.app/latest?amount=${cantidad}&from=MXN&to=${divisa}` //URL para usar en el fetch()


    fetch(urlApi) 
    .then((resp) => resp.json())
    .then(data => {
      conversionRealizada.innerHTML = `$${cantidad} <b>MXN =</b> $${data.rates[divisa]} <b>${divisa}</b>`
    })
    .catch((error) => {
      console.error("Data error", error)
    })
  }
  else {
    Swal.fire({
      icon: "error",
      title: "Valor no válido",
      text: "Inserta una cantidad"
      })
  }
})



/* SECCION PRINCIPAL - REALIZAR INVERSIONES */


        /* Inversón 10 por ciento anual */

let boton10Anual = document.getElementById("invertir10")
let inputInversion10 = document.querySelector("#inversion10")
let saldoActualResta10 = document.getElementById("saldoActual")
let arrayInversion10Anual = []
let containerInversion10anual = document.querySelector("#inversion10anual")
let total10anualSpan = document.getElementById("total10anualSpan")

boton10Anual.addEventListener("click", ()=> {
  let cantidad10anual = parseFloat(inputInversion10.value) // Valor numérico de la cantidad del usuario
  let saldoUser = sessionStorage.getItem("Saldo actual") //Obtener valores del storage

  let historial10Anual = { // Objetos para añadir al historial con .push
    Cantidad: cantidad10anual,
    Fecha: new Date().toLocaleString()
  } 
  let cantidadMasRendimiento = historial10Anual.Cantidad + (historial10Anual.Cantidad * ((0.1 / 365) * 90)) // Cálculo para obtener el total de inversión más rendimiento al finalizar el plazo


  if (!isNaN(cantidad10anual) &&  saldoUser >= cantidad10anual) {
    saldoUser -= cantidad10anual
    sessionStorage.setItem("Saldo actual", saldoUser)

    saldoActualResta10.innerHTML = saldoUser 

    arrayInversion10Anual.push(historial10Anual) // Agregar los objetos de cada depósito al array del historial

    total10anualSpan.innerHTML = arrayInversion10Anual.reduce((suma, inversion) => suma + inversion.Cantidad, 0) 

    let historial = {
      Cantidad: parseFloat( - (cantidad10anual)),
      Fecha: new Date().toLocaleString()
    } // Restando retiros al historial de depósitos principal

    historialDepositos.push(historial) // Agregando retiros al historial de depósitos principal

    containerInversion10anual.innerHTML += `<br> <b>Inversión:</b>  $${historial10Anual.Cantidad} MXN <br> <b>Fecha inicial:</b> ${historial10Anual.Fecha} <br> <b>Total al final del plazo:</b> $${cantidadMasRendimiento} MXN <br>`

  } else if (saldoUser < cantidad10anual) {
    Swal.fire({
      icon: "error",
      title: "Saldo insuficiente"
      })
  } else if (isNaN(cantidad10anual)) {
    Swal.fire({
      icon: "error",
      title: "Valor no válido",
      text: "Inserta una cantidad"
      })
  }
  inputInversion10.value = ""
})


        /* Mostrar y ocultar historial 10 anual */

let mostrarHistorial10 = document.getElementById("mostrarHistorial10")
let ocultarHistorial10 = document.querySelector("#ocultarHistorial10")
let historialContainer10 = document.getElementById("historialContainer10")

mostrarHistorial10.addEventListener("click", () => {
  historialContainer10.style.display = "block"

  ocultarHistorial10.addEventListener("click", () => {
    historialContainer10.style.display = "none"
  })
})
//FIN 10 ANUAL


        /* Inversón 12 por ciento anual */

let boton12Anual = document.getElementById("invertir12")
let inputInversion12 = document.querySelector("#inversion12")
let saldoActualResta12 = document.getElementById("saldoActual")
let arrayInversion12Anual = []
let containerInversion12anual = document.querySelector("#inversion12anual")
let total12anualSpan = document.getElementById("total12anualSpan")

boton12Anual.addEventListener("click", ()=> {
  let cantidad12anual = parseFloat(inputInversion12.value) // Valor numérico de la cantidad del usuario
  let saldoUser = sessionStorage.getItem("Saldo actual") //Obtener valores del storage

  let historial12Anual = { // Objetos para añadir al historial con .push
    Cantidad: cantidad12anual,
    Fecha: new Date().toLocaleString()
  } 
  let cantidadMasRendimiento = historial12Anual.Cantidad + (historial12Anual.Cantidad * ((0.12 / 365) * 180)) // Cálculo para obtener el total de inversión más rendimiento al finalizar el plazo


  if (!isNaN(cantidad12anual) && saldoUser >= cantidad12anual) {
    saldoUser -= cantidad12anual
    sessionStorage.setItem("Saldo actual", saldoUser)

    saldoActualResta12.innerHTML = saldoUser 

    arrayInversion12Anual.push(historial12Anual) // Agregar los objetos de cada depósito al array del historial

    total12anualSpan.innerHTML = arrayInversion12Anual.reduce((suma, inversion) => suma + inversion.Cantidad, 0) 

    let historial = {
      Cantidad: parseFloat( - (cantidad12anual)),
      Fecha: new Date().toLocaleString()
    } // Restando retiros al historial de depósitos principal

    historialDepositos.push(historial) // Agregando retiros al historial de depósitos principal

    containerInversion12anual.innerHTML += `<br> <b>Inversión:</b> $${historial12Anual.Cantidad} MXN <br> <b>Fecha inicial:</b> ${historial12Anual.Fecha} <br> <b>Total al final del plazo:</b> $${cantidadMasRendimiento} MXN <br>`

  } else if (saldoUser < cantidad12anual) {
    Swal.fire({
      icon: "error",
      title: "Saldo insuficiente"
      })
  } else if (isNaN(cantidad12anual)) {
    Swal.fire({
      icon: "error",
      title: "Valor no válido",
      text: "Inserta una cantidad"
      })
  }
  inputInversion12.value = ""
})


        /* Mostrar y ocultar historial 12 anual */

let mostrarHistorial12 = document.getElementById("mostrarHistorial12")
let ocultarHistorial12 = document.querySelector("#ocultarHistorial12")
let historialContainer12 = document.getElementById("historialContainer12")

mostrarHistorial12.addEventListener("click", () => {
  historialContainer12.style.display = "block"

  ocultarHistorial12.addEventListener("click", () => {
    historialContainer12.style.display = "none"
  })
})
//FIN 12 ANUAL


        /* Inversón 15 por ciento anual */

let boton15Anual = document.getElementById("invertir15")
let inputInversion15 = document.querySelector("#inversion15")
let saldoActualResta15 = document.getElementById("saldoActual")
let arrayInversion15Anual = []
let containerInversion15anual = document.querySelector("#inversion15anual")
let total15anualSpan = document.getElementById("total15anualSpan")

boton15Anual.addEventListener("click", ()=> {
  let cantidad15anual = parseFloat(inputInversion15.value) // Valor numérico de la cantidad del usuario
  let saldoUser = sessionStorage.getItem("Saldo actual") //Obtener valores del storage

  let historial15Anual = { // Objetos para añadir al historial con .push
    Cantidad: cantidad15anual,
    Fecha: new Date().toLocaleString()
  } 
  let cantidadMasRendimiento = historial15Anual.Cantidad + (historial15Anual.Cantidad * 0.15) // Cálculo para obtener el total de inversión más rendimiento al finalizar el plazo


  if (!isNaN(cantidad15anual) &&  saldoUser >= cantidad15anual) {
    saldoUser -= cantidad15anual
    sessionStorage.setItem("Saldo actual", saldoUser)

    saldoActualResta15.innerHTML = saldoUser 

    arrayInversion15Anual.push(historial15Anual) // Agregar los objetos de cada depósito al array del historial

    total15anualSpan.innerHTML = arrayInversion15Anual.reduce((suma, inversion) => suma + inversion.Cantidad, 0) 

    let historial = {
      Cantidad: parseFloat( - (cantidad15anual)),
      Fecha: new Date().toLocaleString()
    } // Restando retiros al historial de depósitos principal

    historialDepositos.push(historial) // Agregando retiros al historial de depósitos principal

    containerInversion15anual.innerHTML += `<br> <b>Inversión:</b> $${historial15Anual.Cantidad} MXN <br> Fecha inicial: ${historial15Anual.Fecha} <br> Total al final del plazo: $${cantidadMasRendimiento} MXN <br>`

  } else if (saldoUser < cantidad15anual) {
    Swal.fire({
      icon: "error",
      title: "Saldo insuficiente"
      })
  } else if (isNaN(cantidad15anual)) {
    Swal.fire({
      icon: "error",
      title: "Valor no válido",
      text: "Inserta una cantidad"
      })
  }
  inputInversion15.value = ""
})


        /* Mostrar y ocultar historial 15 anual */

let mostrarHistorial15 = document.getElementById("mostrarHistorial15")
let ocultarHistorial15 = document.querySelector("#ocultarHistorial15")
let historialContainer15 = document.getElementById("historialContainer15")

mostrarHistorial15.addEventListener("click", () => {
  historialContainer15.style.display = "block"

  ocultarHistorial15.addEventListener("click", () => {
    historialContainer15.style.display = "none"
  })
})
//FIN 15 ANUAL