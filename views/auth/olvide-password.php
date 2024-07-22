<h1 class="nombre-pagina">Olvide PassWord</h1>
<p class="descripcion-pagina">Reestablece Tu PassWord escribiendo tu email a continuacion</p>

<?php 
    include_once __DIR__ . "/../templates/alertas.php"
?>

<form class="formulario" action="/olvide" method="POST">
    <div class="campo">
        <label for="email">Email</label>
        <input 
            type="email"
            id="email"
            name="email"
            placeholder="Tu Email"
        >
    </div>

    <input type="submit" class="boton" value="Enviar Instruciones">

</form>

<div class="acciones">
    <a href="/">¿Ya Tienes Una Cuenta? Inicia Sesion</a>
    
    <a href="/crear-cuenta">¿Aun no tienes una cuenta? Crear Una</a>
</div>




