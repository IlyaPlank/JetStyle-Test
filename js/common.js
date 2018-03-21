$(function() {

	var contactList = [];
	var flag = 0; //Для отслеживания ключа 
	//Конструктор
	function CreateListJSON(nameJ, surnameJ, phoneJ){
		this.name = nameJ;
		this.surname = surnameJ;
		this.phone = phoneJ;
	}

	function addContact(nameA, surnameA, phoneA){
		var con = new CreateListJSON(nameA, surnameA, phoneA);//Создаем экземпляры класса CreateListJSON
		contactList.push(con);
		saveList();
	}

	function contactsCreate(){
		var html = '';
		for(var i in contactList){
			var contact = contactList[i];
			var nameC = contact.name;
			var surnameC = contact.surname;
			var phoneC = contact.phone;
			nameC = nameC.substring(0, 1).toUpperCase() + nameC.substring(1);//Делаем первую букву заглавной
			surnameC = surnameC.substring(0, 1).toUpperCase() + surnameC.substring(1);
			var initials = surnameC.substring(0, 1) + nameC.substring(0, 1).toUpperCase();
			html += "<li data-id='" + flag +"''> <div class='initials'>" + initials + "</div> <div class='between'>" + surnameC + ' ' + nameC + ' ' + "<a href='tel:" + phoneC + "' class='tel'>" + phoneC + "</a> </div> <div class='btn-remove'>×</div> </li>";

			if ($(".btn-sort").css("display") == "none") {
				$(".btn-sort").css("display", "block");
			}
			flag++;
		}
		$(".list__contacts").html(html);
		$(".contact-form")[0].reset();
		flag = 0;
	}
	//Сохраняем изменения в JSON формате
	function saveList(){
		var str = JSON.stringify(contactList);
		localStorage.setItem("contactList", str);
	}
	//Получает массив
	function getList(){
		var str = localStorage.getItem("contactList");
		contactList = JSON.parse(str);
		if (!contactList) {
			contactList = [];
		}
	}

	function startList(){
		var name = $('input[name="name"]').val();
		var surname = $('input[name="surname"]').val();
		var phone = $('input[name="phone"]').val();
		if (!((name === '') || (surname === '') || (phone === ''))) {
			addContact(name, surname, phone);
			contactsCreate();
		}
	}
	//Сортируем элементы
	function sortList(){
		var $elements = $('.list__contacts li');
		var $target = $('.list ul');
		
		$elements.sort(function (a, b) {
			var an = $(a).text(),
			bn = $(b).text();
			
			if (an && bn) {
				return an.toUpperCase().localeCompare(bn.toUpperCase());
			}
			
			return 0;
		});
		
		$elements.detach().appendTo($target);
	}
	//Удаляем элемент из DOM и localStorage
	function removeList() {
		$(this).parent().remove();
		if ($(".list__contacts > li").length > 0) {
		} else {
			$(".btn-sort").css("display", "none");
		}
		var index = $(this).parent().attr("data-id");
		contactList.splice(index, 1);
		saveList();
	}
	//Запрещаем перезагрузку 
	$(".contact-form").submit(function(e){
		e.preventDefault();
	})

	getList();//Проверяем элементы в localStorage 
	contactsCreate();//Если есть, то создаем их 

	//События для кнопок
	$(".btn").click(startList);

	$(".btn-sort").click(sortList);

	$(".list").on("click", ".btn-remove", removeList);

});
