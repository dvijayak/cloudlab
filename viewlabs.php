 <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" id="viewport" content="height=device-height,width=device-width,user-scalable=no" />
		<title>Cloud Lab: Code Editor</title>
		<link href="css/style_viewlabs.css" rel="stylesheet" type="text/css">		
		<script type="text/javascript" src="scripts/jquery.js"></script> 
 		<script type="text/javascript" src="scripts/jquery.tools.min.js"></script>	
		<script src="ace_src/ace.js" type="text/javascript" charset="utf-8"></script>	
		<script src="ace_src/theme-vibrant_ink.js" type="text/javascript" charset="utf-8"></script>		
<!--		<script type="text/javascript" src="scripts/jquery-1.7.1.js"></script>		
		<script type="text/javascript" src="scripts/jquery.ui.core.js"></script>		
		<script type="text/javascript" src="scripts/jquery.ui.mouse.js"></script>		
		<script type="text/javascript" src="scripts/jquery.ui.widget.js"></script>		
		<script type="text/javascript" src="scripts/jquery.ui.resizable.js"></script>	 -->	
        <script type="text/javascript" src="scripts/phplivex.js"></script>	
        <script type="text/javascript" src="scripts/script.js"></script>		
        <?php include "scripts/project_manager.php"; ?>				
		<script type="text/javascript">
			$(document).ready(function() {	
				window.onload = function() {
					window.aceViewFilePane = ace.edit("viewFilePane");			
					viewFilePaneInit();
					viewLabsInit();					
				};

			});
		</script>
	</head>
	
	<body>				
	
		<div id="barContainer">
			<div id="titlebar">
				<div>View Labs</div>				
				<a href="#" onclick="logOut()">Log-out</a>
				<div id="userlabel"></div>
			</div>						
		
			<div id="instructorControlsToolbar" class="custom_style">
				<ul>
					<li><a href="#">File</a>
						<ul>
							<li><a href="#" onclick="newLab()">New Lab</a>
								<!-- <ul>
									<li><a href="#">Java Class</a></li>
									<li><a href="#">HTML File</a></li>
									<li><a href="#">CSS Stylesheet</a></li>
									<li><a href="#">JS Script</a></li>
								</ul> -->
							</li>
							<li><a href="#" onclick="deleteLab()">Delete Lab(s)</a></li>
							<!-- <li><a href="#">Edit Lab</a></li> -->
						</ul>
					</li>
					<li><a href="#">Help</a>
						<!-- <ul>
							<li><a href="#">About</a></li>						
						</ul> -->
					 </li>
				</ul>
			</div>
			
			<div id="studentControlsToolbar" class="custom_style">
				<ul>
					<li><a href="#" name="" onclick="editLab()">Edit Lab: </a></li>
					<script type="text/javascript">
						$("#studentControlsToolbar a").click(function(){
							alert("Clicked!");
						});
					</script>
				</ul>				
			</div>
			
		</div>
		
		<div id="contentsContainer">
			<img src="images/clouds.jpg" id="back-image"/>
			<div id="fileViewContainer">
				<div id="fileListContainer">
					<ul>			
					</ul>
				</div>				
			</div>
			
			<div id="viewFilePane" class="custom_style"></div>
		</div>
		

	</body>
	
</html>

