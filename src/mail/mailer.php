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
    $subject = 'Работа пришла!!!';                      // тема письма , вместо многоточия вставьте ваш домен
    $mess = '';
    $mess .= '<hr>';

    if(isset($_POST['name'])) {
        $name = substr(htmlspecialchars(trim($_POST['name'])), 0, 100);
        $mess .= '<b>Имя: </b>' . $name . '<br>';
    }
    if(isset($_POST['email'])) {
        $phone = substr(htmlspecialchars(trim($_POST['email'])), 0, 100);
        $mess .= '<b>Почта: </b>' . $phone . '<br>';
    }
    if(isset($_POST['message'])) {
        $message = substr(htmlspecialchars(trim($_POST['message'])), 0, 100);
        $mess .= '<b>Сообщение: </b>' . $message . '<br>';
    }
    
	$mess .= '<b>Заявка пришла со страницы:</b> ' . $_SERVER["HTTP_REFERER"] .'<br>'; // строчка, в которой передается UTM метки если есть
    $mess .= '<hr>';
    // подключаем файл класса для отправки почты
    require 'class.phpmailer.php';

    $mail = new PHPMailer();
    $mail->AddAddress('333333y@gmail.com');      	                // кому - адрес, Имя (например, 'email@ rek9.ru','Денис Герасимов')
    $mail->IsHTML(true);                        				// выставляем формат письма HTML 
    $mail->CharSet = "UTF-8";                   				// кодировка
	$mail->From = "info@lookmyportfolio.com.ua";					        	// email, с которого отправиться письмо
	$mail->FromName = "Портфолио";					    // откого письмо
    $mail->Body = $mess;
    $mail->Subject = $subject;

    // отправляем наше письмо		
	
	if ($mail->Send()) header('Location: ../');                 // в поле Location можно настроить переадресацию
	else { die ('Mailer Error: ' . $mail->ErrorInfo); }
?>