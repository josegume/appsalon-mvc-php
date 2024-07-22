<?php 
    foreach($alertas as $key => $mesajes):
        foreach($mesajes as $mensaje):
?>
    <div class="alerta <?php echo "$key"; ?>">
            <?php echo $mensaje; ?>
    </div>
<?php

        endforeach;

    endforeach;


?>