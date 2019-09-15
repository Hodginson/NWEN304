$(document).ready(function(e) {

  $('#add-todo').button({ icons: { primary: "ui-icon-circle-plus" } });
  $('#new-todo').dialog({ modal : true, autoOpen : false });
  $('#add-todo').button({
    icons: { primary: "ui-icon-circle-plus" }}).click(
      function() {
        $('#new-todo').dialog('open');
      });

      $('#new-todo').dialog({
        modal : true, autoOpen : false,
        buttons : {
          "Add task" : function () {
            var taskName = $('#task').val();
            if (taskName === '') { return false; }
            var taskHTML = '<li><span class="done">%</span>';
            taskHTML += '<span class="delete">x</span>';
            taskHTML += '<span class="edit">+</span>';
            taskHTML += '<span class="task"></span></li>';
            var $newTask = $(taskHTML);
            $newTask.find('.task').text(taskName);
            $newTask.hide();
            $('#todo-list').prepend($newTask);
            $newTask.show('clip',250).effect('highlight',1000);
            $(this).dialog('close');
            $('#task').val(''); //This bit clears the dialog box
          },
          "Cancel" : function () { $(this).dialog('close'); }
        }

      });
      $('#todo-list').on('click', '.done', function() {
        var $taskItem = $(this).parent('li');
        $taskItem.slideUp(250, function() {
          var $this = $(this);
          $this.detach();
          $('#completed-list').prepend($this);
          $this.slideDown();
        });
      });


          $('#edit').dialog({ modal : true, autoOpen : false});

          //allow edit
          $('#todo-list').on('click', '.edit', function() {
            var $taskNameInToDoList = $(this).parent('li').find('.task');
            var $taskNameInEdit=$('#edit-task');
            $taskNameInEdit.val($taskNameInToDoList.html());
            //setting edit dialog buttons
            $('#edit').dialog({
                      buttons : {
                      "Confirm" : function () {
                          $(this).dialog('close');
                          $taskNameInToDoList.text($taskNameInEdit.val());
                        },
                      "Cancel" : function () {
                          $(this).dialog('close');
                        }
                      }
                });
            //open dialog
            $('#edit').dialog('open');
          });


      $('.sortlist').sortable({
		      connectWith: '.sortlist', //connect the two lists together since they have the same class
		        cursor: 'pointer',
		          placeholder: 'ui-state-highlight',
		            cancel: '.delete,.done,.edit'
		            });


              $('#confirm-deletion').dialog({ modal : true, autoOpen : false});

    //function to allow us to delete a task
    $('.sortlist').on('click','.delete',function() {
        var $this=$(this);
        $('#confirm-deletion').dialog({
                  buttons : {
                  "Delete" : function () {
                      $(this).dialog('close');
                      $this.parent('li').effect('puff', function() {
                        $this.remove();
                      });
                    },
                  "Cancel" : function () {
                      $(this).dialog('close');
                    }
                  }
            });
        $('#confirm-deletion').dialog('open');
    });

    //Ajax Methods
    //Add an task
    function addTask(taskName){
    	$.ajax({
        method: 'PUT',
        url: "http://localhost:8080/task/create/",
        data: JSON.stringify({
    		task: taskName
    	 }),
    	 contentType: "application/json",
    	 dataType: "json"
     }).then(success_func, ERROR_LOG);
    }

    function completeTask(taskName){
    		$.ajax({
            method: 'POST',
            url: "http://localhost:8080/task/update/",
            data: JSON.stringify({
    				task: taskName
    			}),
    			contentType: "application/json",
    			dataType: "json"
         }).then(updated_func, ERROR_LOG);
    }

    function deleteTask(taskName){
    		$.ajax({
          	method: 'DELETE',
             url: "http://localhost:8080/task/delete/",
             data: JSON.stringify({
    				task: taskName
    			}),
    			contentType: "application/json",
    			dataType: "json"
         }).then(deleted_func, ERROR_LOG);
    }

    //Ajax methods
    //For debugging
    function success_func(data){
    	//Function that handle success
    	console.log('posted data.', data);
    };

    function updated_func(data){
    	//Function that handle success
    	console.log('updated data.', data);
    };

    function deleted_func(data){
    	//Function that handle success
    	console.log('deleted data.', data);
    };

    function redraw(data){
    //alert(data);
    //Prints them in order cool
    for (var i = 0; i < data.length; i++){
    		var taskName = data[i].item;
    		var completed = data[i].completed;
    		//console.log(taskName);
    		//console.log(completed);
    		displayTask(taskName, completed);
    }
    };

    function displayTask(taskName, completed){
    		var taskHTML = '<li><span class="done">%</span>';
    		taskHTML += '<span class="delete">x</span>';
    		taskHTML += '<span class="task"></span></li>';
    		var $newTask = $(taskHTML);
    		$newTask.find('.task').text(taskName);


    		$newTask.hide();
    		if (completed){
    			$('#completed-list').prepend($newTask);
    		}
    		else{
    			$('#todo-list').prepend($newTask);
    		}
    		$newTask.show('clip',250).effect('highlight',1000);
    		$('#task').val(''); //This bit clears the dialog box

    }
}); // end ready
