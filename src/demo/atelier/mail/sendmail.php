<?
if(isset($_POST['phone'])&&$_POST['phone']!=""){ //Проверка отправилось ли наше поле phone и не пустое ли оно
    $to = 'example@mail.com'; //Почта получателя, через запятую можно указать сколько угодно адресов

    $subject = strip_tags($_POST['subject']); //Заголовок сообщения
    $message = '
                <html>
                    <head>
                        <title>'.$subject.'</title>
                    </head>
                    <body>'.
                        addLine($_POST['name'], 'Имя: ').
                        addLine($_POST['phone'], 'Телефон: ').
                        addLine($_POST['email'], 'Почтовый ящик: ').
                        addLine($_POST['message'], 'Сообщение: ').
                    '</body>
                </html>'; //Текст нашего сообщения можно использовать HTML теги
    $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    $headers .= "From: website.com <example@mail.com>\r\n"; //Наименование и почта отправителя
    mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail
}

function addLine($val, $name) {
    $result = '';
    $val = strip_tags($val);

    if($val != '') $result = '<p>'.$name.': '.$val.'</p>';

    return $result;
}
?>