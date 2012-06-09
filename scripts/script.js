var loginElements = document.getElementsByClassName('loginElements');	
var loadingElements = document.getElementsByClassName('loadingElements');

var response;
var loggedUser; 
var loggedIsInstructor;

var username;
var project;

var validUsers = [
	{
		"user": "mdelong",
		"pass": "M",
		"role": 1
	},
	{
		"user": "dvijayak",
		"pass": "D",
		"role": 1
	},
	{
		"user": "qmahmoud",
		"pass": "Q",
		"role": 0
	}
];	

var projectTypes = ["C", "C++", "BB"];

function validate(){  
    val = document.getElementById("userText").value;  
    myClass.validateEmail(val, {          
        "onFinish": function(response){              
            if(response) alert("Valid Email Address!");  
            else alert("Invalid Email Address!");  
        }  
    });  
}

//**********************************
// General Utilities
//**********************************

/*
* Conceals or reveals the specified element depending on the request
*/
function forceElementDisplay(element, state) {

	if (state == "ON")
		element.style.display = "block";
	else if (state == "OFF")
		element.style.display = "none";	
		
}

/*
* Conceals or reveals a list of elements depending on the request
*/
function forceElementSDisplay(elements, state) {
	
	for (var i = 0; i < elements.length; i++) {		
		forceElementDisplay(elements[i], state);
	}
	
}

function checkValidResource(user) {
	
	var invalidURL = true;
	
	for (var i = 0; i < validUsers.length; i++) {
		if (user == validUsers[i].user || user == validUsers[i].user + "#") {
			invalidURL = false;
			break;
		}
	}
	
	return invalidURL;
}

function logOut() {
	
	// Routines for saving, clearing memory of current user, etc.
	// ----------	
	// --------- -
	// End
	
	// location.href = "index.html";
	location.href = "index.html";
	
}

function getKeys(dictionary) {
    if (!Object.keys) {
        Object.keys = (function () {  
            var hasOwnProperty = Object.prototype.hasOwnProperty,  
            hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),  
            dontEnums = [  
            'toString',  
            'toLocaleString',  
            'valueOf',  
            'hasOwnProperty',  
            'isPrototypeOf',  
            'propertyIsEnumerable',  
            'constructor'  
            ],  
            dontEnumsLength = dontEnums.length  

            return function (obj) {  
                if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object')  

                var result = []  

                for (var prop in obj) {  
                    if (hasOwnProperty.call(obj, prop)) result.push(prop)  
                }  

                if (hasDontEnumBug) {  
                    for (var i=0; i < dontEnumsLength; i++) {  
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i])  
                    }  
                }  
                return result  
            }  
        })()  
    }
    
    return Object.keys(dictionary);
}


//**********************************
// Log-In Page
//**********************************

function logIn() {
	
	var user = document.getElementById('userText').value;
	var pass = document.getElementById('passText').value;
	
	var success = authenticate(user, pass);	
	if (success[0] == true) {
		if (isInstructor(success[1]) == true) {
			location.href = "viewlabs.php?user=" + user + "?instructor=true";
		}
		else {
			location.href = "viewlabs.php?user=" + user;
        }
	}
	else {
	
		alert("Log-In attempt was unsuccessful! Check username and/or password!");
	
	}
	
	forceElementSDisplay(loginElements, "ON");
	forceElementSDisplay(loadingElements, "OFF");	
}

function authenticate(user, pass) {	
		
	forceElementSDisplay(loginElements, "OFF");
	forceElementSDisplay(loadingElements, "ON");
	
	for (var i = 0; i < validUsers.length; i++)
		if (user == validUsers[i].user && pass == validUsers[i].pass)
			return [true, validUsers[i]];		
	
	return [false];

}

function isInstructor(user) {		
	if (user.role == 0)
		return true;
	return false;		
}


//**********************************
// View Labs Page
//**********************************

function viewLabsInit() {	
	var loggedUser = (new String(window.location)).split("?")[1].split("=")[1];
    username = loggedUser.split("#")[0];
	var loggedIsInstructor = (new String(window.location).split("?")[2] != undefined) ? new String(window.location).split("?")[2].split("=")[1] : undefined; 			
	
	if (checkValidResource(username) == true) {		
		alert("Security Breach: Trespasser has attempted to access a private user space!");
		// location.href = "index.html";		
		location.href = "index.html";		
		return;
	}
	else {
		if (username != undefined)	
			// document.getElementById("titlebar").childNodes[1].innerHTML += user + ": View Labs";					
			document.getElementById("userlabel").innerHTML = username + ":";					
		
		if (loggedIsInstructor) {
		
			forceElementDisplay(document.getElementById("instructorControlsToolbar"), "ON");
		
		}
		else {
			forceElementDisplay(document.getElementById("studentControlsToolbar"), "ON");
        }

		//------------------------
		// Code for loading all the user's labs 
		//------------------------
        
        projectManager.list_projects({
            "onFinish": function(response) {
                var labs = getKeys(jQuery.parseJSON(response));
                var fileListContainer = document.getElementById("fileListContainer");
                
                for (var i = 0; i < fileListContainer.childNodes.length; i++) {
                    if (fileListContainer.childNodes[i].nodeName == "UL") {
                        var ulist = fileListContainer.childNodes[i];
                        
                        for (var j = 0; j < labs.length; j++) {
                            var listitem = document.createElement("LI");			
                            var anchor = document.createElement("a");
                            anchor.setAttribute("href", "#");
                            anchor.setAttribute("onclick", "editLab(\"" + labs[j] + "\")");
                            anchor.setAttribute("value", labs[j]);
                            anchor.innerHTML = labs[j];
                            listitem.appendChild(anchor);
                            ulist.appendChild(listitem);
                        }
                        break;
                    }
                }
            }
        });
	}		
		
}

//var LabTypes = {"Type_C":1, "Type_Cpp":2, "Type_BlackBerry":3};
//Object.freeze(LabTypes);

function viewFilePaneInit() {	
	
	var TextMode = require("ace/mode/text").Mode;
	window.aceViewFilePane.getSession().setMode(new TextMode());
	window.aceViewFilePane.setReadOnly(true);
    window.aceViewFilePane.setShowPrintMargin(false);
	window.aceViewFilePane.renderer.setShowGutter(false);
}

function createLab(name, type) {
    if (type == "C") {
        projectManager.create_c_project(name, {
            "onFinish": function(response) {
                return response;
            }
        });        
    }
    else if (type == "C++") {
        projectManager.create_cpp_project(name, {
            "onFinish": function(response) {
                return response;
            }
        });    
    }
    else if (type == "BB") {
        projectManager.create_bb_project(name, {
            "onFinish": function(response) {                
                return response;
            }
        });
    }
    else {
        alert("Error: invalid lab type entered. Lab will not be created.");
        return false;
    }
}

function newLab() {
	
	var newLab = {
		"name"  : prompt("Enter the name of the new lab:", "defaultLab"),
		"type"  : prompt("Enter the type of the lab (C [C], C++ [C++] or BlackBerry Web App [BB]")
	};
	
    if (createLab(newLab.name, newLab.type) != false) {
        alert("Lab " + newLab.name + " successfully created!");
    }
    else {
        alert("Error: failed to create lab " + newLab.name);
        return;
    }
    
	var fileListContainer = document.getElementById("fileListContainer");
	for (var i = 0; i < fileListContainer.childNodes.length; i++) {
		
		if (fileListContainer.childNodes[i].nodeName == "UL") {
			
			var ulist = fileListContainer.childNodes[i];
			
			// Append a new LI element that represents a new file called <FilePath> (modify code as needed for correct file name)
			var listitem = document.createElement("LI");			
			var anchor = document.createElement("a");
			anchor.setAttribute("href", "#");
			anchor.setAttribute("onclick", "editLab(\"" + newLab.name + "\")");
			anchor.setAttribute("value", newLab.name);
			anchor.innerHTML = newLab.name;
			listitem.appendChild(anchor);

			ulist.appendChild(listitem);
			break;
		}
	}
}

function deleteLab() {

	var delLab = {
		"name"  : prompt("Enter the name of the lab you would like to delete", "defaultLab")/* ,
		"users" : prompt("Enter the usernames of the students (separated by spaces only) that were assigned this lab:" */
	};
	
	var fileListContainer = document.getElementById("fileListContainer");
	
	for (var i = 0; i < fileListContainer.childNodes.length; i++) {
		
		if (fileListContainer.childNodes[i].nodeName == "UL") {
			
			var ulist = fileListContainer.childNodes[i];
			
			for (var j = 0; j < ulist.childNodes.length; j++) {												
				if (ulist.childNodes[j].nodeName == "LI" && ulist.childNodes[j].firstChild.nodeName == "A") {
					for (var k = 0; k < ulist.childNodes[j].firstChild.attributes.length; k++) {
						if (delLab.name == ulist.childNodes[j].firstChild.attributes[k].value) {						
							ulist.removeChild(ulist.childNodes[j]);
							break;						
						}
					}
				}
			}																
		}		
	}
}

function openLab(fileName) {

	// Read file contents and store in buffer (not implemented yet)
	var buffer = fileName;
		
	window.aceViewFilePane.getSession().setValue(buffer);	

}

function editLab(fileName) {
	if (fileName != null && fileName != undefined) {
        location.href = "editor.php?user=" + username + "?lab=" + fileName;
		//location.href = "editor.html?lab=" + fileName;
    }
	else
		alert("Invalid Lab!");
}

//**********************************
// Code Editor
//**********************************

function editorInit() {

	username = (new String(window.location)).split("?")[1].split("=")[1];
    project  = (new String(window.location)).split("?")[2].split("=")[1];
    project = project.split("#")[0];
	
	/*if (checkValidResource(user) == true) {		
		// alert("Security Breach: Trespasser has attempted to access a private user space!");
		// location.href = "index.html";		
		// return;
	}
	else {*/
		
		window.aceEditor.setTheme("ace/theme/eclipse");
		var DefaultMode = require("ace/mode/c_cpp").Mode;
		window.aceEditor.getSession().setMode(new DefaultMode());
		window.aceEditor.insert("");	
		window.aceEditor.setShowPrintMargin(false);				
			
		/*if (user != undefined) 		
			// document.getElementById("titlebar").childNodes[1].innerHTML += user + ": View Labs";					
			document.getElementById("userlabel").innerHTML = user + ":";	
	
	}	*/
}

function consoleInit() {	
	window.aceConsole.setTheme("ace/theme/vibrant_ink");
	var TextMode = require("ace/mode/text").Mode;
	window.aceConsole.getSession().setMode(new TextMode());	
	var text = username + "@cloud-lab$> ";
	window.aceConsole.insert(text);	
	window.aceConsole.setReadOnly(true);
    window.aceConsole.setShowPrintMargin(false);
}

var type;
var fileArray;

function getAllFiles() {
    fileManager.get_source_files(username, project, {
        "onFinish": function(response){
            fileArray = jQuery.parseJSON(response);
            var filenames = getKeys(fileArray);
            
            e = document.getElementById("fileList");
            
            ///////////////////
            // This code needs to be changed to correct way of modifying HTML; append elements instead
            ///////////////////
            var file_html = "";
            for (var i = 0; i < filenames.length; i++) {
            
                if ((i == 0) && (filenames[i] != "type.txt")) {
                    file_html += "<li class=\"highlight\">" + filenames[i] + "</li>\n";
                    window.aceEditor.getSession().setValue(fileArray[filenames[i]]);
                }
                
                else if (filenames[i] != "type.txt") {
                    file_html += "<li>" + filenames[i] + "</li>\n";
                }
            }
            
            e.innerHTML = file_html;
            
            type = fileArray["type.txt"];
            var newFiles = document.getElementById("file_types");
            file_html = "";
            
            /////////////////////////
            // This code needs to be changed to correctly modify the HTML; append elements instead
            ////////////////////////
            if (type == "C") {
                file_html += "<li><a href=\"#\" onclick='newFile(\"c\")'>C Source</a></li>";
                file_html += "<li><a href=\"#\" onclick='newFile(\"h\")'>C Header</a></li>";
            }
            else if (type == "CPP") {
                file_html += "<li><a href=\"#\" onclick='newFile(\"cpp\")'>CPP Source</a></li>";
                file_html += "<li><a href=\"#\" onclick='newFile(\"hpp\")'>CPP Header</a></li>";
            }
            else if (type == "BB") {
                file_html += "<li><a href=\"#\" onclick='newFile(\"html\")'>HTML Document</a></li>";
                file_html += "<li><a href=\"#\" onclick='newFile(\"js\")'>Javascript Source</a></li>";
                file_html += "<li><a href=\"#\" onclick='newFile(\"css\")'>CSS Stylesheet</a></li>";
            }
    
            newFiles.innerHTML = file_html;
            
            // get rid of this eventually
            $('.file_list li').click(function() {
                fileArray[$('.highlight').text()] = window.aceEditor.getSession().getValue();
                $('.highlight').removeClass('highlight');
                $(this).addClass('highlight');
                window.aceEditor.getSession().setValue(fileArray[$(this).text()]);
            });
        }
    });
}

function setupEnvironment() {
    fileManager.checkIfEdited(username, project, {});
    getAllFiles();
    //setTimeout(function() {getAllFiles();}, 1000);
    //compileManager.create_compile_dir(username, project, {"onFinish": function(response){alert("done, mf"); alert(response);}});
}

function overlay(element) {
	e = document.getElementById(element);
	e.style.display = (e.style.display == "block") ? "none" : "block";			
}

function newFile(ext) {	
	var newFile = prompt("Enter the name of your new file:", "Untitled");
    
    if (ext == "c") {
        fileManager.create_c_source(username, project, newFile, {"onFinish": function(response){addNewFile(newFile + "." + ext);}});
    }
    else if (ext == "cpp") {
        fileManager.create_cpp_source(username, project, newFile, {"onFinish": function(response){addNewFile(newFile + "." + ext);}});
    }
    else if (ext == "h") {
        fileManager.create_h_source(username, project, newFile, {"onFinish": function(response){addNewFile(newFile + "." + ext);}});
    }
    else if (ext == "hpp") {
        fileManager.create_hpp_source(username, project, newFile, {"onFinish": function(response){addNewFile(newFile + "." + ext);}});
    }
    else if (ext == "html") {
        fileManager.create_html_source(username, project, newFile, {"onFinish": function(response){addNewFile(newFile + "." + ext);}});
    }
    else if (ext == "js") {
        fileManager.create_js_source(username, project, newFile, {"onFinish": function(response){addNewFile(newFile + "." + ext);}});
    }
    else if (ext == "css") {
        fileManager.create_css_source(username, project, newFile, {"onFinish": function(response){addNewFile(newFile + "." + ext);}});
    }
}

function addNewFile(name) {
    var fileListContainer = document.getElementById("filePane");

    for (var i = 0; i < fileListContainer.childNodes.length; i++) {
		if (fileListContainer.childNodes[i].nodeName == "UL") {
			fileArray[$('.highlight').text()] = window.aceEditor.getSession().getValue();
            $('.highlight').removeClass('highlight');
            
			var ulist = fileListContainer.childNodes[i];
			var listitem = document.createElement("LI");			
			listitem.setAttribute("class", "highlight");
			listitem.innerHTML = name;
			ulist.appendChild(listitem);
            getFile(name);
			break;
		}
	}    

    // get rid of this eventually; use onclick if possible
    $('.file_list li').click(function() {
        fileArray[$('.highlight').text()] = window.aceEditor.getSession().getValue();
        $('.highlight').removeClass('highlight');
        $(this).addClass('highlight');
        window.aceEditor.getSession().setValue(fileArray[$(this).text()]);
    });
}

function getFile(name) {
    fileManager.get_source_file(username, project, name, {
        "onFinish": function(response){
            fileArray[name] = response;
            window.aceEditor.getSession().setValue(fileArray[name]);
        }
    });
}

function saveFile() {
    fileArray[$('.highlight').text()] = window.aceEditor.getSession().getValue();
    data = fileArray[$('.highlight').text()];
    fileManager.save_file(project, username + "/" + $('.highlight').text(), data, {          
        "onFinish": function(response){}});
}

function saveAllFiles() {
    var filenames = getKeys(fileArray);
    fileArray[$('.highlight').text()] = window.aceEditor.getSession().getValue();
    for (var i = 0; i < filenames.length; i++) {
        fileManager.save_file(project, username + "/" + filenames[i], fileArray[filenames[i]], {          
            "onFinish": function(response){}}); 
    }
}

function deleteFile() {
    fileManager.delete_file(username, project, $('.highlight').text(), {
        "onFinish": function(response){
            var filenames = getKeys(fileArray);
            var flist = document.getElementById("fileList");
            var listitem = flist.childNodes[0];
            
            delete fileArray[$('.highlight').text()];
            for (var j = 0; j < flist.childNodes.length; j++) {											
				if (flist.childNodes[j].nodeName == "LI") {
					if (flist.childNodes[j].innerHTML == $('.highlight').text()) {
                        flist.removeChild(flist.childNodes[j]);
                        break;
                    }
				}
			}

            listitem.setAttribute("class", "highlight");
            window.aceEditor.getSession().setValue(fileArray[$('.highlight').text()]);
        }
    });
}

function compileSource() {
    var results = "";
    var filenames = getKeys(fileArray);
    var sourcecode = "";
    
    for (var i = 0; i < filenames.length; i++) {
        sourcecode += filenames[i] + " ";
    }
    
    if (type == "C") {
        window.aceConsole.setReadOnly(false);
        window.aceConsole.insert("gcc " + sourcecode + "-o main -Wall\n");
        window.aceConsole.setReadOnly(true);
        //results = setTimeout(function() {compileManager.compile_c_source(username, project);}, 3000);
        window.aceConsole.setReadOnly(false);
        window.aceConsole.insert(results + "\n" + username + "@cloud-lab$> ");
        window.aceConsole.setReadOnly(true);
    }
    else if (type == "CPP") {
        window.aceConsole.setReadOnly(false);
        window.aceConsole.insert("g++ " + sourcecode + "-o main -Wall\n");
        window.aceConsole.setReadOnly(true);
        //results = setTimeout(function() {compileManager.compile_cpp_source(username, project);}, 3000);
        window.aceConsole.setReadOnly(false);
        window.aceConsole.insert(results + "\n" + username + "@cloud-lab$> ");
        window.aceConsole.setReadOnly(true);
    }
    else if (type == "BB") {
        //setTimeout(function() {getAllFiles(username project);}, 3000);
        alert("Blackberry compilation not implemented.");
    }
}

function charCount() {
	var text = window.aceEditor.getSession().getValue();
	alert("The total number of characters in your code is " + text.length + " chars.");
}

function applyChanges() {

 	var mode = (require(document.getElementById("mode").value)).Mode;	
	window.aceEditor.getSession().setMode(new mode()); 
	
	var theme = document.getElementById("theme").value;
	window.aceEditor.setTheme(theme);
	
	var fontSize = document.getElementById("fontsize").value;	
	document.getElementById("editor").style.fontSize = fontSize;

	var toggle = document.getElementById("highlight_active").checked;		
	window.aceEditor.setHighlightActiveLine(toggle);	
	
	toggle = document.getElementById("show_gutter").checked;
	window.aceEditor.renderer.setShowGutter(toggle);
}
