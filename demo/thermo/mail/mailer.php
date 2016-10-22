<?php
/*
* Денис Герасимов http://rek9.ru/
* Данный скрипт обрабатывает форм и отправляет ее на email
* В письме вы увидите utm метки, если использовали их в рекламной кампании
* Измените в данном скрипте:
* 1. Тему письма (13 строчку)
* 2. Введите ваш email, на который отправлять обработанную форму (36 строчка)
* 3. Email, с которого отправлять письмо (39 строчка)
* 4. Имя, с которого отправляется письмо (40 строчка)
* 5. URL, на который будет переадресация, при успешной отправке формы (45 строчка)
*/
    $subject = '';                      // тема письма , вместо многоточия вставьте ваш домен
    $mess = '';
    $mess .= '<hr>';

    if(isset($_POST['name'])) {
        $name = substr(htmlspecialchars(trim($_POST['name'])), 0, 100);
        $mess .= '<b>Имя клиента: </b>' . $name . '<br>';
    }
    if(isset($_POST['phone'])) {
        $phone = substr(htmlspecialchars(trim($_POST['phone'])), 0, 100);
        $mess .= '<b>Телефон клиента: </b>' . $phone . '<br>';
    }
    if(isset($_POST['message'])) {
        $customerMessage = substr(htmlspecialchars(trim($_POST['message'])), 0, 300);
        $mess .= '<b>Телефон клиента: </b>' . $customerMessage . '<br>';
    }
    if(isset($_POST['time-from']) && isset($_POST['time-to'])) {
        $timeFrom = substr(htmlspecialchars(trim($_POST['time-from'])), 0, 5);
        $timeTo = substr(htmlspecialchars(trim($_POST['time-to'])), 0, 5);
        $mess .= '<b>Удобное время для клиента: </b> с: ' . $timeFrom . ' до: ' . $timeTo . '<br>';
    }
    if(isset($_POST['subject'])) {
        $subject = substr(htmlspecialchars(trim($_POST['subject'])), 0, 200);
    }
    
	$mess .= '<b>Заявка пришла со страницы:</b> ' . $_SERVER["HTTP_REFERER"] .'<br>'; // строчка, в которой передается UTM метки если есть
    $mess .= '<hr>';
    // подключаем файл класса для отправки почты
    require 'class.phpmailer.php';

    $mail = new PHPMailer();
    $mail->AddAddress('termo-panely@yandex.ru, info@termo-panely.ru');      	                // кому - адрес, Имя (например, 'email@ rek9.ru','Денис Герасимов') termo-panely@yandex.ru, info@termo-panely.ru
    $mail->IsHTML(true);                        				// выставляем формат письма HTML 
    $mail->CharSet = "UTF-8";                   				// кодировка
	$mail->From = "info@termo-panely.ru";					        	// email, с которого отправиться письмо
	$mail->FromName = "Фасадные термопанели";					    // откого письмо
    $mail->Body = $mess;
    $mail->Subject = $subject;

    // отправляем наше письмо
	
	if ($mail->Send()) header('Location: ../');                 // в поле Location можно настроить переадресацию
	else { die ('Mailer Error: ' . $mail->ErrorInfo); }
?>