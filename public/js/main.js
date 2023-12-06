// Wait for document to be ready
$(document).ready(function(){
    // Add listener for id
    $(".delete-book").on("click", function(e){
        // Get id when button clicked
        $target = $(e.target);
        const id = $target.attr("data-id");
        // Send request to expresss with DELETE method
        $.ajax({
            type: "DELETE",
            url: "/book/" + id,
            success: function(response){
                // Show book deleted and redirect
                alert("Deleting Book");
                window.location.href="/";
            },
            error: function(err){
                console.log(err);
            }
        })
    })
});
