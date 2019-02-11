# antisushi
anti-sushi.ru

* Добавлена отмена всех модалок по нажатию клавищи ESC

Обатный звонок

1. Данные отправляются аяксом на серверный скрипт /aseets/json.php
2. Данные отправляются в виде json-строки. Пример:
[{"name":"mailto","value":"webdevep28@gmail.com"},{"name":"target","value":"Mainpage-header callback-form"},{"name":"subject","value":"Заказ обратного звонка с сайта Антисуши"},{"name":"name","value":"Игорь Александров"},{"name":"phone","value":"+7(123) 456-78-94"},{"name":"agreement","value":""}]
3. На стороне сервера (я передал данные php-скрипту, но можно использовать любой обработчик выходного массива json, пеердаваемого методом POST) обработка в файле /assets/sctipt/ajax.php:
"<?php
        if (!isset($_POST['json_data'])) { echo '0'; exit(); };
        $json_data= json_decode($_POST['json_data']);
        $data=array();
        foreach ($json_data as $k => $) {
                switch($k) {
                        case 'mailto': $data['mailto']= $v; break;
                        case 'target': $data['target']= $v; break;
                        case 'subject': $data['subject']= $v; break;
                        case 'name': $data['name']= $v; break;
                        case 'phone': $data['phone']= $v; break;
                }
        }
        if ($data['mailto']) {
                $to = $data['mailto']
                $subject = $data['subject'];
                $message = '<ul><li>Телефон:'.$data['phone'].'</li><li>Имя'.$data['name'].'</li>Тточка захвата<li>'.$data['target'].'</li></ul>';
                $headers = ""From: anti-sushi.ru <info@anti-sushi.ru>\r\nContent-type: text/html; charset=utf-8 \r\n"";
                if (mail ($to, $subject, $message, $headers)) echo '1'; else echo '';
        }
        echo '0';
}
?>"

Фильтры

Грузятся в зависимости от текущего URL:
"Функция addFilter (title, id) - создаёт объект фильтра с указанным ID.
Все ID я взял со старого сайта.
Используются тут: <input type=""hidden"" value=""N"" name=""'+id+'"" id=""'+id+'"">"

