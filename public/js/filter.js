$(document).ready(function(e) {

    $("#assignedSelect").on("click", function(e) { 

     var isAssigned = this.value;
     var data = {"isAssigned":isAssigned}
        var url = "/ticket/filter";
        $.ajax({
            method: "POST",
            url: url,
            data:data
            })
            .done(function(response) {
                var searchResults = []
                for (var i=0;(i<6) && i<response.length;i++){
                    ticket = {};
                    ticket._id = response[i]._id;
                    ticket.completed = response[i].completed;
                    ticket.title = response[i].title;
                        searchResults.push(ticket);
                  
                }
                var html = "";
                searchResults.forEach(function(ticket,index) {   
                    if (ticket.completed) {
                        console.log(ticket.title);
                        html+=  `<tr key={`+index+`}>
                        <td class="statusTicket"><i class="completedIcon fa fa-check-circle"></i></td>
                          <td class="capitalize">`+ticket.title+`</td>
                          <td><a href="/ticket/`+ticket._id+`" class="nav-link"><i class="iconSee fa fa-search"></a></td>
                          <td><a href="/ticket/`+ticket._id+`/edit" class="nav-link"><i class="iconEdit fa fa-pencil"></a></td>
                      </tr>`;
                    } else {
                        html+=  `<tr key={`+index+`}>
                        <td class="statusTicket"><i class="notCompletedIcon fa fa-times-circle"></i></td> 
                          <td class="capitalize">`+ticket.title+`</td>
                          <td><a href="/ticket/`+ticket._id+`" class="nav-link"><i class="iconSee fa fa-search"></a></td>
                          <td><a href="/ticket/`+ticket._id+`/edit" class="nav-link"><i class="iconEdit fa fa-pencil"></a></td>
                      </tr>`;
                    }
                });
               $("tbody").html(html);
               
            });
               

    });
});