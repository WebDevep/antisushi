<?php
	$data=array();
	if (isset($_POST['name'])) $data['name']= $_OIST['name']; else $data['name']= 'неизвестно';
	if (isset($_POST['phone'])) $data['phone']= $_OIST['phone']; else $data['phone']= 'неизвестно';
	if (isset($_POST['session'])) $data['session']= $_OIST['session']; else $data['session']= 'неизвестно';
	if (isset($_POST['mailtp'])) $data['mailtp']= $_OIST['mailtp']; else $data['mailtp']= '';
	if ($data['mailto']) {
		$to = $data['mailto'];
		$subject = 'Заказ обратного звонка';
		$message = '<ul><li>Телефон:'.$data['phone'].'</li><li>Имя'.$data['name'].'</li>Сессия<li>'.$data['session'].'</li></ul>';
		$headers = "From: anti-sushi.ru <info@anti-sushi.ru>\r\nContent-type: text/html; charset=utf-8 \r\n";
		if (mail ($to, $subject, $message, $headers)) echo '1'; else echo '';
	}
	echo '0';
}
?>