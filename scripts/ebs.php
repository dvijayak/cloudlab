<?php
	require_once "lib/aws/sdk.class.php";

	error_reporting(-1);
		
	$ec2 = new AmazonEC2();
	$instanceId = "i-57d8d32b"; // dvijayak-ubuntu-server

	// Describe all volumes attached to this instance
	$response = $ec2->describe_volumes();

	if ($response->isOK()) {
		$count = count($response->body->volumeSet->item);
		for ($i = 0; $i < $count; $i++)
			print_r($response->body->volumeSet->item[$i]);		
	}
	
	// Create a new volume and attach to this instance
	// (Represents a project)
	
	$response = $ec2->describe_instances(array('InstanceId' => $instanceId));
	if ($response->isOK())
		print_r($response);

?>
