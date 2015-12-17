// JavaScript Document

Parse.initialize("JLwo9Lc2yVyfk5P04BFo07LNJ0SDe5ygReu5PiiA", "29M5wkyzLakOVVazsHVrDjnCwrp5tuFfbOzn2MBA");

var current_id;
var current_action;

$(document).ready(function(e){

	//setInterval(CheckLoginState, 100);
	setTimeout(CheckLoginState, 1000);
	
	RetriveData();

	/*$(window).scroll(function(e){
		AddSubject();
	})*/

	$("#btn_close").click(function(e){	
		$("#popup").css("display","none");
	})

 	$("#btn_yes").click(function(e){
		$("#popup").css("display","none");
		var Question = Parse.Object.extend("Question");
		var query = new Parse.Query(Question);
		query.equalTo("identify", current_id);
		query.find({
		  success: function(questions) {
			  var question = questions[0];
			  var num_yes = question.get("num_yes");
			  var num_no = question.get("num_no");
			  num_yes++;
			  question.set("num_yes", num_yes);
			  question.save();
	  		  $("#"+current_id+"_rating").html("Yes:"+num_yes+" No:"+num_no);
		  }
		});
	})

 	$("#btn_no").click(function(e){
		$("#popup").css("display","none");
		var Question = Parse.Object.extend("Question");
		var query = new Parse.Query(Question);
		query.equalTo("identify", current_id);
		query.find({
		  success: function(questions) {
			  var question = questions[0];
			  var num_yes = question.get("num_yes");
			  var num_no = question.get("num_no");
			  num_no++;
			  question.set("num_no", num_no);
			  question.save();
	  		  $("#"+current_id+"_rating").html("Yes:"+num_yes+" No:"+num_no);
		  }
		});
	})

 	$("#btn_like").click(function(e){
		$("#popup").css("display","none");
		var Viewpoint = Parse.Object.extend("Viewpoint");
		var query = new Parse.Query(Viewpoint);
		query.equalTo("identify", current_id);
		query.find({
		  success: function(viewpoints) {
			  var viewpoint = viewpoints[0];
			  var num_likes = viewpoint.get("num_likes");
			  num_likes++;
			  viewpoint.set("num_likes", num_likes);
			  viewpoint.save();
	  		  $("#"+current_id+"_rating").html("Likes:"+num_likes);
		  }
		});
	})
})

function SubjectTxtClick(id)
{
	var content = $("#"+id+"_txt").html();
	$("#popup p").html(content);
	$("#popup").css("display","inline-block");
	$("#btn_close").css("display","inline-block");
	$("#btn_yes").css("display","none");
	$("#btn_no").css("display","none");	
	$("#btn_like").css("display","none");	
}

function ViewpointClick(id)
{
	var content = $("#"+id+"_txt").html();
	$("#popup p").html(content);
	$("#popup").css("display","inline-block");
	$("#btn_close").css("display","inline-block");
	$("#btn_like").css("display","inline-block");
	$("#btn_yes").css("display","none");
	$("#btn_no").css("display","none");
	current_id = id;
}

function QuestionClick(id)
{
	var content = $("#"+id+"_txt").html();
	$("#popup p").html(content);
	$("#popup").css("display","inline-block");
	$("#btn_close").css("display","inline-block");
	$("#btn_yes").css("display","inline-block");
	$("#btn_no").css("display","inline-block");
	$("#btn_like").css("display","none");	
	current_id = id;
}

function SubjectAdded()
{
	if (event.keyCode == 13)
	{
		CheckLogin("SubjectAdded", 0);
	}
}

function ViewpointAdded(id)
{
	if (event.keyCode == 13)
	{
		CheckLogin("ViewpointAdded", id);
	}
}

function QuestionAdded(id)
{
	if (event.keyCode == 13)
	{
		CheckLogin("QuestionAdded", id);
	}
}

function FBNameResponse(action, id, name)
{
	var text;
	
	switch(action)
	{
		case "SubjectAdded":
			text = $("#subjectadd").val();
			SaveSubject(text, name);
			ShareContent(text);
			$("#subjectadd").val("");
			break;
		case "ViewpointAdded":
			text = $("#"+id).val();
			var str = id.slice(id.indexOf("_")+1);
			SaveViewpoint("subject_"+str, text, name);
			ShareContent(text);
			$("#"+id).val("");
			break;
		case "QuestionAdded":
			text = $("#"+id).val();
			var str = id.slice(id.indexOf("_")+1);
			SaveQuestion("subject_"+str, text, name);
			ShareContent(text);
			$("#"+id).val("");
			break;
	}
}

function SaveSubject(text, name)
{
	var Subject = Parse.Object.extend("Subject");
	var query = new Parse.Query(Subject);
	query.find({
	  success: function(subjects) {
		var num_subject = subjects.length;
		var subject = new Subject();
		subject.set("identify", "subject_"+num_subject);
		subject.set("num_subject", num_subject);
		subject.set("text", text);
		subject.set("name", name);
		subject.set("num_viewpoints", 0);
		subject.set("num_questions", 0);
		subject.save();
		ShowSubject(num_subject, text, name);
	  }
	});
}

function SaveViewpoint(identify, text, name)
{
	var Subject = Parse.Object.extend("Subject");
	var query = new Parse.Query(Subject);
	query.equalTo("identify", identify);
	query.find({
	  success: function(subjects) {
		var subject = subjects[0];
		var num_subject = subject.get("num_subject");
		var num_viewpoint = subject.get("num_viewpoints");
		subject.set("num_viewpoints", num_viewpoint+1);
		var Viewpoint = Parse.Object.extend("Viewpoint");
		var viewpoint = new Viewpoint();
		viewpoint.set("identify", "viewpoint_"+num_subject+"_"+num_viewpoint);
		viewpoint.set("num_subject", num_subject);
		viewpoint.set("num_viewpoint", num_viewpoint);
		viewpoint.set("text", text);
		viewpoint.set("name", name);
		viewpoint.set("num_likes", 0);
		viewpoint.set("subject", subject);
		viewpoint.save();
		ShowViewpoint(num_subject, num_viewpoint, text, name, 0);
	  }
	});
}

function SaveQuestion(identify, text, name)
{
	var Subject = Parse.Object.extend("Subject");
	var query = new Parse.Query(Subject);
	query.equalTo("identify", identify);
	query.find({
	  success: function(subjects) {
		var subject = subjects[0];
		var num_subject = subject.get("num_subject");
		var num_question = subject.get("num_questions");
		subject.set("num_questions", num_question+1);
		var Question = Parse.Object.extend("Question");
		var question = new Question();
		question.set("identify", "question_"+num_subject+"_"+num_question);
		question.set("num_subject", num_subject);
		question.set("num_question", num_question);
		question.set("text", text);
		question.set("name", name);
		question.set("num_yes", 0);
		question.set("num_no", 0);
		question.set("subject", subject);
		question.save();
		ShowQuestion(num_subject, num_question, text, name, 0, 0);
	  }
	});
}

function RetriveData()
{
	var text, name, query, num_subject;

	var Subject = Parse.Object.extend("Subject");
	query = new Parse.Query(Subject);
	query.find({
	  success: function(subjects) {
		for (var i = 0; i < subjects.length; i++) { 
		    var subject = subjects[i];
			num_subject = subject.get("num_subject");
		    text = subject.get("text");
			name = subject.get("name");
			ShowSubject(num_subject, text, name);
			}
		  }
		});
			
		var Viewpoint = Parse.Object.extend("Viewpoint");
		query = new Parse.Query(Viewpoint);
		query.find({
		  success: function(viewpoints) {
			for (var i = 0; i < viewpoints.length; i++) { 
			  var viewpoint = viewpoints[i];
			  num_subject = viewpoint.get("num_subject");
			  var num_viewpoint = viewpoint.get("num_viewpoint");
			  text = viewpoint.get("text");
			  name = viewpoint.get("name");
			  var num_likes = viewpoint.get("num_likes");
			  ShowViewpoint(num_subject, num_viewpoint, text, name, num_likes);
			}
		  }
		});
			
		var Question = Parse.Object.extend("Question");
		query = new Parse.Query(Question);
		query.find({
		  success: function(questions) {
			for (var i = 0; i < questions.length; i++) { 
			  var question = questions[i];
			  num_subject = question.get("num_subject");
			  var num_question = question.get("num_question");
			  text = question.get("text");
			  name = question.get("name");
			  var num_yes = question.get("num_yes");
			  var num_no = question.get("num_no");
			  ShowQuestion(num_subject, num_question, text, name, num_yes, num_no);
			}
		  }
		});
}


function ShowSubject(subject_num, text, name)
{
	$("#all_site").append('<div class="subject" id=subject_'+subject_num+'></div>');

	$("#subject_"+subject_num).append('<div class="subject_content" id=subject_content_'+subject_num+' onClick="SubjectTxtClick(id)"></div>');
	
	$("#subject_content_"+subject_num).append('<div class="viewpoint_image" id=subject_content_'+subject_num+'_image></div>');
	$("#subject_content_"+subject_num+"_image").append('<img src="_images/photo.jpg" width="20px" height="20px"/>');
	$("#subject_content_"+subject_num).append('<div class="viewpoint_name" id=subject_content_'+subject_num+'_name></div>');
	$("#subject_content_"+subject_num+"_name").html(name);
	$("#subject_content_"+subject_num).append('<div class="viewpoint_txt" id=subject_content_'+subject_num+'_txt></div>');
	$("#subject_content_"+subject_num+"_txt").html(text);

	$("#subject_"+subject_num).append('<div class="viewpoints" id=viewpoints_'+subject_num+'></div>');
	
	$("#viewpoints_"+subject_num).append('<textarea class="viewpoint_add" id=viewpointadd_'+subject_num+' rows="2" cols="1" placeholder="Add new viewpoint" onKeyUp="ViewpointAdded(id)"></textarea>');

	$("#subject_"+subject_num).append('<div class="questions" id=questions_'+subject_num+'></div>');
	
	$("#questions_"+subject_num).append('<textarea class="viewpoint_add" id=questionadd_'+subject_num+' rows="2" cols="1" placeholder="Add new question" onKeyUp="QuestionAdded(id)"></textarea>');

	$("#subject_"+subject_num).append('<p class="clear"></p>');
}

function ShowViewpoint(subject_num, viewpoint_num, text, name, num_likes)
{
	$("#viewpoints_"+subject_num).append('<div class="viewpoint" id=viewpoint_'+subject_num+'_'+viewpoint_num+' onClick="ViewpointClick(id)"></div>');
	$("#viewpoint_"+subject_num+"_"+viewpoint_num).append('<div class="viewpoint_image" id=viewpoint_'+subject_num+'_'+viewpoint_num+'_image></div>');
	$("#viewpoint_"+subject_num+"_"+viewpoint_num+"_image").append('<img src="_images/photo.jpg" width="20px" height="20px"/>');
	$("#viewpoint_"+subject_num+"_"+viewpoint_num).append('<div class="viewpoint_name" id=viewpoint_'+subject_num+'_'+viewpoint_num+'_name></div>');
	$("#viewpoint_"+subject_num+"_"+viewpoint_num+"_name").html(name);
	$("#viewpoint_"+subject_num+"_"+viewpoint_num).append('<div class="viewpoint_txt" id=viewpoint_'+subject_num+'_'+viewpoint_num+'_txt></div>');
	$("#viewpoint_"+subject_num+"_"+viewpoint_num+"_txt").html(text);
	$("#viewpoint_"+subject_num+"_"+viewpoint_num).append('<div class="viewpoint_rating" id=viewpoint_'+subject_num+'_'+viewpoint_num+'_rating></div>');
	$("#viewpoint_"+subject_num+"_"+viewpoint_num+"_rating").html("Likes:"+num_likes);
}

function ShowQuestion(subject_num, question_num, text, name, num_yes, num_no)
{
	$("#questions_"+subject_num).append('<div class="viewpoint" id=question_'+subject_num+'_'+question_num+' onClick="QuestionClick(id)"></div>');
	$("#question_"+subject_num+"_"+question_num).append('<div class="viewpoint_image" id=question_'+subject_num+'_'+question_num+'_image></div>');
	$("#question_"+subject_num+"_"+question_num+"_image").append('<img src="_images/photo.jpg" width="20px" height="20px"/>');
	$("#question_"+subject_num+"_"+question_num).append('<div class="viewpoint_name" id=question_'+subject_num+'_'+question_num+'_name></div>');
	$("#question_"+subject_num+"_"+question_num+"_name").html(name);
	$("#question_"+subject_num+"_"+question_num).append('<div class="viewpoint_txt" id=question_'+subject_num+'_'+question_num+'_txt></div>');
	$("#question_"+subject_num+"_"+question_num+"_txt").html(text);
	$("#question_"+subject_num+"_"+question_num).append('<div class="viewpoint_rating" id=question_'+subject_num+'_'+question_num+'_rating></div>');
	$("#question_"+subject_num+"_"+question_num+"_rating").html("Yes:"+num_yes+" No:"+num_no);
}