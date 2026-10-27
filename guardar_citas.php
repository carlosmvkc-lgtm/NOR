<?php
$db = __DIR__ . '/citas.db';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        exit('Envía el formulario primero.');
    }

    $pdo = new PDO('sqlite:' . $db);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare(
        "INSERT INTO citas
        (nombre, email, telefono, producto, fecha, hora, mensaje)
        VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    $stmt->execute([
        $_POST['nombre'] ?? '',
        $_POST['email'] ?? '',
        $_POST['telefono'] ?? '',
        $_POST['producto'] ?? '',
        $_POST['fecha'] ?? '',
        $_POST['hora'] ?? '',
        $_POST['mensaje'] ?? ''
    ]);

    echo '¡Cita guardada correctamente!';
} catch (Throwable $e) {
    echo 'Error: ' . htmlspecialchars($e->getMessage());
}
?>