<?php
// Instalar o SQLITE3
// criar o BD na linha de comando:
// sqlite3 teste.db
// isso vai entrar voce no comando sqlite3 em seguida criar a tabela com:
// create table videos (Id integer primary key, FileName, Description, Title);
// se usar .tables na linha de comando mostra as tabelas
// Para rodar esse arquivo basta usar:
// php -S localhost:8000 index.php
// depois abrir a pagina localhost:8000
header('Content-type: text/html; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Methods: GET, POST, DELETE');

$pdo = new PDO('sqlite:./vuttr.db');

if($_SERVER["REQUEST_METHOD"] == "GET") {
    try {
        $query = $pdo->query("select * from Vuttr");
        if (isset($_GET['q'])) {
            $query = $pdo->query("select * from Vuttr WHERE Title LIKE '%". (string)$_GET['q'] ."%'");
        } else if (isset($_GET['tag'])) {
            $query = $pdo->query("select * from Vuttr WHERE Tags LIKE '%". (string)$_GET['tag'] ."%'");
        }
        //$row = $query->fetch(PDO::FETCH_ASSOC);
        $all = $query->fetchAll(PDO::FETCH_ASSOC);
        print_r(json_encode($all));
    } catch (Exception $error) {
        $array  = array('status' => '500', 'mensagem' => 'Infelizmente houve um erro ao obter os dados!');
        echo json_encode($array);
    }
    
}

if($_SERVER["REQUEST_METHOD"] == "POST") {
    // Inserir dados no sqlite
    $sql = "INSERT INTO Vuttr (id, title, link, description, tags) VALUES (?, ?, ?, ?, ?)";
    try {
        $result = $pdo->prepare($sql);

        // $jsonData = file_get_contents('php://input');
        // // Decode the JSON data into a PHP associative array
        // $data = json_decode($jsonData, true);
        // // Assign the decoded data to $_REQUEST
        // $_REQUEST = $data;
        // // Access the data and perform operations
        // $tags = $_REQUEST['tags'];
        // print_r($tags);
        

        // Depois verifica se é possível mover o arquivo para a pasta escolhida
        if ($result->execute([GUID(), $_POST['title'], $_POST['link'], $_POST['description'], $_POST['tags']])) {
            // Upload efetuado com sucesso, exibe uma mensagem e um link para o arquivo
            $array  = array('status' => '200', 'mensagem' => 'Salvo com sucesso');
            echo json_encode($array);
        } else {
            // Não foi possível fazer o upload, provavelmente a pasta está incorreta
            $array  = array('status' => '500', 'mensagem' => 'Erro ao salvar e-mail');
            echo json_encode($array);
        }
    
    } catch (Exception $error) {
        $array = array('status' => '500', 'mensagem' => 'Infelizmente houve um erro ao inserir os dados!');
        echo json_encode($array);
    }
    
}

if($_SERVER["REQUEST_METHOD"] == "DELETE") {
    parse_str($_SERVER['QUERY_STRING'] ?? '', $queries);

    if ($queries['id'] ?? false) {
        $stmt = $pdo->prepare("DELETE FROM Vuttr WHERE id = ?");
        if ($stmt->execute([$queries['id']])) {
            $array  = array('status' => '200', 'mensagem' => 'Deletado com sucesso!');
            echo json_encode($array);
        } else {
            $array  = array('status' => '500', 'mensagem' => 'Infelizmente não foi possível deletar!');
            echo json_encode($array);
        }
    } 
    exit;
}

if($_SERVER["REQUEST_METHOD"] == "DELETE") {
    $query = $pdo->prepare("DELETE FROM Vuttr");
    if ($query->execute()) {
        $array = array('status' => '200', 'mensagem' => 'Deletado todos os dados com sucesso!');
        echo json_encode($array);
    }
    else {
        $array  = array('status' => '500', 'mensagem' => 'Infelizmente não foi possível deletar todos dados!');
        echo json_encode($array);
    }
}

function GUID()
{
    if (function_exists('com_create_guid') === true)
    {
        return trim(com_create_guid(), '{}');
    }

    return sprintf('%04X%04X-%04X-%04X-%04X-%04X%04X%04X', mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(16384, 20479), mt_rand(32768, 49151), mt_rand(0, 65535), mt_rand(0, 65535), mt_rand(0, 65535));
}