
/*Evento para actualizar saldo */
let actualizarSaldo = document.querySelector("#actualizarSaldo") //Valor insertado para que el usuario actualice su saldo
let botonActualizarSaldo = document.getElementById("botonActualizarSaldo") // Boton para iniciar la función que actualiza el saldo del usuario
let historialDepositos = [] //Arreglo para los registros y suma de depositos 
let saldoActual = document.querySelector("#saldoActual") //Elemento para mostrar el saldo actualizado del usuario


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
  (actualizarSaldo.value = ""),
  // (localStorage.setItem("cantidadSumadaHistorial",JSON.stringify(historialDepositos))),
  Swal.fire({
    title: "Saldo actualizado",
    text: `Tu saldo es: $${historialDepositos.reduce((suma, deposito) => suma + deposito.Cantidad, 0)}`,
    icon: "success"
  })
  )
})




/*Evento para mostrar historial */

let botonConsultarDepositos = document.querySelector("#botonConsultarDepositos") //Boton para iniciar función que muestraa historial de depósitos
let contenedorMostrarHistorialDepositos = document.getElementById("contenedorMostrarHistorialDepositos") //Contenedor para mostrar el historial de depósitos

botonConsultarDepositos.addEventListener("click", () => {
  
  contenedorMostrarHistorialDepositos.innerHTML = ""
  historialDepositos.forEach((deposito) => {
    contenedorMostrarHistorialDepositos.innerHTML += `Cantidad depositada: $${deposito.Cantidad} <br> Fecha: ${deposito.Fecha} <br><br> `
  })
  botonOcultarHistorial.style.display = `block`
})




/*Evento para ocultar historial */

let botonOcultarHistorial = document.getElementById("botonOcultarHistorial") // Boton para ocultar historial

botonOcultarHistorial.addEventListener("click", () => {
  contenedorMostrarHistorialDepositos.innerHTML = ""
  botonOcultarHistorial.style.display = `none`
})




/* Consumiendo API de divisas */

let cantidadPesos = document.getElementById("cantidadPesos") // Cantidad en MXN para convertir a otra divisa
let botonDivisas = document.querySelector("#botonDivisas") //Botón para hacer la conversión de divisas
let divisasSelect = document.querySelector("#divisasSelect") //Divisa seleccionada por usuario
let conversionRealizada = document.getElementById("conversionRealizada") //Parrafo para mostrar el resultado de la conversión


botonDivisas.addEventListener("click", () => {

  let cantidad = parseInt(cantidadPesos.value)

  if (!isNaN(cantidad))
  {
    let divisa = divisasSelect.value
    let urlApi = `https://api.frankfurter.app/latest?amount=${cantidad}&from=MXN&to=${divisa}` //URL para usar en el fetch()


    fetch(urlApi) 
    .then((resp) => resp.json())
    .then(data => {
      conversionRealizada.textContent = `${cantidad} MXN = ${data.rates[divisa]} ${divisa}`
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